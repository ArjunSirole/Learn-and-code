import { Request, Response } from "express";
import { db } from "./database";
import { OrderService } from "./orderServices";
import { OrderDto } from "./dto/OrderDTO";
import { Order } from "./types";

export async function createOrder(req: Request, res: Response): Promise<void> {
  const { items, shippingMethod, paymentMethod }: Order = req.body;

  let totalPrice = 0,
    totalDiscount = 0,
    totalTaxes = 0,
    totalShippingCost = 0;

  try {
    const [orderResult]: any = await db.execute(
      "INSERT INTO orders (shipping_method, payment_method) VALUES (?, ?)",
      [shippingMethod, paymentMethod]
    );

    const orderId = orderResult.insertId;

    const insertItems = items.map(async (item) => {
      const { itemName, quantity, price } = item;
      const orderSummary = OrderService.calculateOrderSummary(
        price,
        quantity,
        shippingMethod
      );

      totalPrice += orderSummary.subtotal;
      totalDiscount += orderSummary.discount;
      totalTaxes += orderSummary.taxes;
      totalShippingCost += orderSummary.shippingCost;

      return db.execute(
        "INSERT INTO order_items (order_id, item_name, quantity, price, discount, taxes, shipping_cost, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          itemName,
          quantity,
          price,
          orderSummary.discount,
          orderSummary.taxes,
          orderSummary.shippingCost,
          orderSummary.total,
        ]
      );
    });

    await Promise.all(insertItems);

    res.json({
      message: "Order created successfully",
      orderId,
      totalPrice,
      totalDiscount,
      totalTaxes,
      totalShippingCost,
      grandTotal: totalPrice - totalDiscount + totalTaxes + totalShippingCost,
    });
  } catch (error: unknown) {
    res
      .status(500)
      .json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
  }
}

export async function getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const [orders]: any = await db.execute(
      `SELECT 
        o.id as orderId, 
        JSON_ARRAYAGG(
          JSON_OBJECT('itemName', oi.item_name, 'quantity', oi.quantity, 'price', oi.price, 'total', oi.total)
        ) AS items,
        SUM(oi.total) AS totalAmount
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id`
    );

    res.json(orders);
  } catch (error: unknown) {
    res
      .status(500)
      .json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;

  try {
    const [orders]: any = await db.execute(
      "SELECT o.id as orderId, oi.item_name, oi.quantity, oi.price, oi.total FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.id = ?",
      [orderId]
    );

    if (orders.length === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(orders.map((order: any) => new OrderDto(order)));
  } catch (error: unknown) {
    res
      .status(500)
      .json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
  }
}
