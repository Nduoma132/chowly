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
  const { restaurantId, name, type, price } = req.body; // type: Food/Drink
  const item = await prisma.menuItem.create({
    data: { restaurantId, name, type, price: Number(price) },
  });
  res.status(201).json(item);
});

// update a menu item (price / availability)
router.patch("/:id", async (req, res) => {
  const { price, name, type } = req.body;
  const data: { price?: number; name?: string; type?: string } = {};
  if (price !== undefined) data.price = Number(price);
  if (name !== undefined) data.name = name;
  if (type !== undefined) data.type = type;
  const item = await prisma.menuItem.update({
    where: { id: req.params.id },
    data,
  });
  res.json(item);
});

export default router;
