import "dotenv/config";
import express from "express";
import cors from "cors";
import restaurantsRouter from "./routes/restaurants";
import ordersRouter from "./routes/orders";
import menuItemsRouter from "./routes/menuItems";
import customersRouter from "./routes/customers";
import waitersRouter from "./routes/waiters";
import chefsRouter from "./routes/chefs";
import bartendersRouter from "./routes/bartenders";
import paymentsRouter from "./routes/payments";
import complaintsRouter from "./routes/complaints";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/restaurants", restaurantsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/menu-items", menuItemsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/waiters", waitersRouter);
app.use("/api/chefs", chefsRouter);
app.use("/api/bartenders", bartendersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/complaints", complaintsRouter);

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));