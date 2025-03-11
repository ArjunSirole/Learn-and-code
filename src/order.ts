import { Request, Response } from "express";
import { db } from "./database";
import { OrderService } from "./orderServices";

export async function createOrder(req: Request, res: Response) {
  const { item_name, quantity, price, shipping_method, payment_method } =
    req.body;

  const orderSummary = OrderService.computeOrderSummary(
    price,
    quantity,
    shipping_method
  );

  try {
    const [result] = await db.execute(
      "INSERT INTO orders (item_name, quantity, price, discount, shipping_method, payment_method, shipping_cost, taxes, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        item_name,
        quantity,
        price,
        orderSummary.discount,
        shipping_method,
        payment_method,
        orderSummary.shipping_cost,
        orderSummary.taxes,
        orderSummary.total,
      ]
    );

    res.json({
      message: "Order created successfully",
      order: {
        item_name,
        quantity,
        price,
        ...orderSummary,
        shipping_method,
        payment_method,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
