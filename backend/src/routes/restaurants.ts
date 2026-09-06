import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// list restaurants
router.get("/", async (_req, res) => {
  const restaurants = await prisma.restaurant.findMany();
  res.json(restaurants);
});

// create a restaurant
router.post("/", async (req, res) => {
  const { name, address, contactNumber } = req.body;
  const restaurant = await prisma.restaurant.create({
    data: { name, address, contactNumber },
  });
  res.status(201).json(restaurant);
});

// one restaurant + its menu
router.get("/:id", async (req, res) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: req.params.id },
    include: { menuItems: true, waiters: true, chefs: true, bartenders: true },
  });
  res.json(restaurant);
});

export default router;