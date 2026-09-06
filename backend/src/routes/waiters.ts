import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// list waiters
router.get("/", async (_req, res) => {
  const waiters = await prisma.waiter.findMany();
  res.json(waiters);
});

// create a waiter
router.post("/", async (req, res) => {
  const { restaurantId, name } = req.body;
  const waiter = await prisma.waiter.create({
    data: { restaurantId, name },
  });
  res.status(201).json(waiter);
});

export default router;
