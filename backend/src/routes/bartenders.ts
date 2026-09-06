import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// list bartenders with their assigned (drink) order items
router.get("/", async (_req, res) => {
  const bartenders = await prisma.bartender.findMany({
    include: {
      restaurant: true,
      orderItems: { include: { order: true, menuItem: true } },
    },
  });
  res.json(bartenders);
});

// create a bartender
router.post("/", async (req, res) => {
  const { restaurantId, name } = req.body;
  const bartender = await prisma.bartender.create({
    data: { restaurantId, name },
  });
  res.status(201).json(bartender);
});

// assign a bartender to prepare a specific order item
router.patch("/:id/items/:itemId", async (req, res) => {
  const item = await prisma.orderItem.update({
    where: { id: req.params.itemId },
    data: { bartenderId: req.params.id },
  });
  res.json(item);
});

export default router;
