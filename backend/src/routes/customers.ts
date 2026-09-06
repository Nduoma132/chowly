import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// list customers
router.get("/", async (_req, res) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

// create a customer (used when someone places an order first time)
router.post("/", async (req, res) => {
  const { name, phoneNumber, email } = req.body;
  const customer = await prisma.customer.create({
    data: { name, phoneNumber, email },
  });
  res.status(201).json(customer);
});

export default router;
