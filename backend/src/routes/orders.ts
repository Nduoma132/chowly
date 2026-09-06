import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// create an order (with its items)
router.post("/", async (req, res) => {
  const { customerId, waiterId, items } = req.body;
  // items = [{ menuItemId, quantity }]

  const order = await prisma.order.create({
    data: {
      customerId,
      waiterId,
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

// update an order's status / waiting time
router.patch("/:id", async (req, res) => {
  const { status, waitingTime } = req.body;
  const data: { status?: string; waitingTime?: number } = {};
  if (status !== undefined) data.status = status;
  if (waitingTime !== undefined) data.waitingTime = waitingTime;
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data,
  });
  res.json(order);
});

router.get("/", async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { customer: true, waiter: true, items: { include: { menuItem: true } }, payment: true },
  });
  res.json(orders);
});

export default router;