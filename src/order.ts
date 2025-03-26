import { Request, Response } from "express";
import { db } from "./database";
import { OrderService } from "./orderServices";
import { OrderDTO } from "./dto/OrderDTO";

export async function createOrder(req: Request, res: Response): Promise<void> {
  const { items, shipping_method, payment_method } = req.body;

  let totalPrice = 0;
  let totalDiscount = 0;
  let totalTaxes = 0;
  let totalShippingCost = 0;

  try {
    const [orderResult]: any = await db.execute(
      "INSERT INTO orders (shipping_method, payment_method) VALUES (?, ?)",
      [shipping_method, payment_method]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const { item_name, quantity, price } = item;
      const orderSummary = OrderService.computeOrderSummary(
        price,
        quantity,
        shipping_method
      );

      totalPrice += orderSummary.subtotal;
      totalDiscount += orderSummary.discount;
      totalTaxes += orderSummary.taxes;
      totalShippingCost += orderSummary.shipping_cost;

      await db.execute(
        "INSERT INTO order_items (order_id, item_name, quantity, price, discount, taxes, shipping_cost, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          item_name,
          quantity,
          price,
          orderSummary.discount,
          orderSummary.taxes,
          orderSummary.shipping_cost,
          orderSummary.total,
        ]
      );
    }

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
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
}
export async function getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const [orders]: any = await db.execute(`
      SELECT 
        o.id as orderId, 
        GROUP_CONCAT(oi.item_name) AS productNames,
        SUM(oi.quantity) AS totalQuantity,
        SUM(oi.total) AS totalAmount
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
    `);

    res.json(orders);
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;

  try {
    const [orders]: any = await db.execute(
      `
      SELECT o.id as orderId, oi.item_name, oi.quantity, oi.price, oi.total
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
    `,
      [orderId]
    );

    if (orders.length === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(orders.map((order: any) => new OrderDTO(order)));
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
}
