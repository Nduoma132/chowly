import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// list all menu items
router.get("/", async (_req, res) => {
  const items = await prisma.menuItem.findMany({
    include: { restaurant: true },
  });
  res.json(items);
});

// create a menu item for a restaurant
router.post("/", async (req, res) => {
  const { restaurantId, name, type, price, preparationTime } = req.body; // type: Food/Drink
  const item = await prisma.menuItem.create({
    data: {
      restaurantId,
      name,
      type,
      price: Number(price),
      preparationTime: preparationTime !== undefined ? Number(preparationTime) : 0,
    },
  });
  res.status(201).json(item);
});

// update a menu item (price / availability)
router.patch("/:id", async (req, res) => {
  const { price, name, type, preparationTime } = req.body;
  const data: { price?: number; name?: string; type?: string; preparationTime?: number } = {};
  if (price !== undefined) data.price = Number(price);
  if (name !== undefined) data.name = name;
  if (type !== undefined) data.type = type;
  if (preparationTime !== undefined) data.preparationTime = Number(preparationTime);
  const item = await prisma.menuItem.update({
    where: { id: req.params.id },
    data,
  });
  res.json(item);
});

export default router;
