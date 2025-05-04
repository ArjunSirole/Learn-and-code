import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { createOrder, getAllOrders, getOrderById } from "./order";

const app = express();
app.use(bodyParser.json());

app.post("/api/checkout", createOrder);
app.get("/api/orders", getAllOrders);
app.get("/api/orders/:orderId", getOrderById);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
