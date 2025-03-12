import { Request, Response } from "express";
import { Order } from "../models/Order";
import { OrderRepository } from "../repository/OrderRepository";

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
      const { item_name, quantity, price, shipping_method, payment_method } =
        req.body;

      if (
        !item_name ||
        !quantity ||
        !price ||
        !shipping_method ||
        !payment_method
      ) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const order = new Order(
        item_name,
        quantity,
        price,
        shipping_method,
        payment_method
      );
      const savedOrder = await OrderRepository.saveOrder(order);

      return res.status(201).json({
        message: "Order created successfully",
        order: savedOrder,
      });
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return res.status(500).json({ error: errorMessage });
    }
  }
}
