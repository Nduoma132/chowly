import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// create an order (with its items)
router.post("/", async (req, res) => {
  const { customerId, waiterId, items } = req.body;
  // items = [{ menuItemId, quantity }]

  // look up the menu items so we can compute the waiting time
  const ordered = await prisma.menuItem.findMany({
    where: { id: { in: items.map((i: any) => i.menuItemId) } },
  });

  // waiting time = sum of preparation times of the ordered items
  const waitingTime = ordered.reduce(
    (sum, mi) => sum + (mi.preparationTime || 0),
    0
  );

  const order = await prisma.order.create({
    data: {
      customerId,
      waiterId,
      waitingTime,
      items: {
        create: items.map((i: any) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: { include: { menuItem: true } } },
  });

  res.status(201).json(order);
});

// waiter updates an order: assign chef + bartender, change status, set waiting time
router.patch("/:id", async (req, res) => {
  const { status, waitingTime, chefId, bartenderId } = req.body;
  const data: { status?: string; waitingTime?: number } = {};
  if (status !== undefined) data.status = status;
  if (waitingTime !== undefined) data.waitingTime = waitingTime;

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data,
    include: { items: true },
  });

  // if a chef was chosen, assign them to every food item in the order
  if (chefId) {
    await prisma.orderItem.updateMany({
      where: { orderId: req.params.id, menuItem: { type: "Food" } },
      data: { chefId },
    });
  }
  // if a bartender was chosen, assign them to every drink item in the order
  if (bartenderId) {
    await prisma.orderItem.updateMany({
      where: { orderId: req.params.id, menuItem: { type: "Drink" } },
      data: { bartenderId },
    });
  }

  res.json(order);
});

router.get("/", async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      waiter: true,
      items: { include: { menuItem: true, chef: true, bartender: true } },
      payment: true,
    },
  });
  res.json(orders);
});

export default router;
