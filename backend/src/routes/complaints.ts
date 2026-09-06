import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// list complaints
router.get("/", async (_req, res) => {
  const complaints = await prisma.complaint.findMany({
    include: { order: { include: { customer: true } } },
  });
  res.json(complaints);
});

// submit a complaint (with rating 1-5) on an order
router.post("/", async (req, res) => {
  const { orderId, description, rating } = req.body;
  const complaint = await prisma.complaint.create({
    data: { orderId, description, rating: Number(rating) },
  });
  res.status(201).json(complaint);
});

export default router;
