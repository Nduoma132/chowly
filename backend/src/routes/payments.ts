import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// make a payment for an order. amount is auto-calculated from the order items.
router.post("/", async (req, res) => {
  const { orderId, method, status } = req.body; // method: Card/Cash/Transfer/Wallet

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { menuItem: true } } },
  });

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  let amount = 0;
  for (const item of order.items) {
    amount += item.quantity * item.menuItem.price;
  }

  const payment = await prisma.payment.upsert({
    where: { orderId },
    update: {
      method: method ?? "Card",
      status: status ?? "Completed",
      paymentTime: new Date(),
    },
    create: {
      orderId,
      amount,
      method: method ?? "Card",
      status: status ?? "Completed",
    },
  });

  res.status(201).json(payment);
});

export default router;
