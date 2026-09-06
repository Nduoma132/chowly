import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// list chefs with their assigned (food) order items
router.get("/", async (_req, res) => {
  const chefs = await prisma.chef.findMany({
    include: {
      restaurant: true,
      orderItems: { include: { order: true, menuItem: true } },
    },
  });
  res.json(chefs);
});

// create a chef
router.post("/", async (req, res) => {
  const { restaurantId, name, specialty } = req.body;
  const chef = await prisma.chef.create({
    data: { restaurantId, name, specialty },
  });
  res.status(201).json(chef);
});

// assign a chef to prepare a specific order item
router.patch("/:id/items/:itemId", async (req, res) => {
  const item = await prisma.orderItem.update({
    where: { id: req.params.itemId },
    data: { chefId: req.params.id },
  });
  res.json(item);
});

export default router;
