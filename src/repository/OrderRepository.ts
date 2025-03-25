// src/repository/OrderRepository.ts
import { db } from "../database";
import { Order } from "../models/Order";
import { OrderDTO } from "../dto/OrderDTO";

export class OrderRepository {
    static async saveOrder(order: Order) {
        const { subtotal, discount, shippingCost, taxes, total } = order.getTotal();

        try {
            const [orderResult] = await db.execute(
                `INSERT INTO orders (shipping_method, payment_method, shipping_cost, taxes, total)
                 VALUES (?, ?, ?, ?, ?)`,
                [order.shippingMethod, order.paymentMethod, shippingCost, taxes, total]
            );

            const orderId = (orderResult as any).insertId;

            for (const item of order.items) {
                await db.execute(
                    `INSERT INTO order_items (order_id, item_name, quantity, price)
                     VALUES (?, ?, ?, ?)`,
                    [orderId, item.itemName, item.quantity, item.price]
                );
            }

            return new OrderDTO(orderId, order.items, total);
        } catch (error) {
            throw new Error("Database Error: Unable to save order");
        }
    }

    static async getAllOrders(): Promise<OrderDTO[]> {
        try {
            const [orders] = await db.execute(`
                SELECT o.id AS order_id, oi.item_name, oi.quantity, oi.price, o.total
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
            `);

            const orderMap = new Map<number, OrderDTO>();

            (orders as any[]).forEach(row => {
                if (!orderMap.has(row.order_id)) {
                    orderMap.set(row.order_id, new OrderDTO(row.order_id, [], row.total));
                }
                orderMap.get(row.order_id)!.items.push({
                    itemName: row.item_name,
                    quantity: row.quantity,
                    price: row.price
                });
            });

            return Array.from(orderMap.values());
        } catch (error) {
            throw new Error("Database Error: Unable to fetch orders");
        }
    }

    static async getOrderById(orderId: number): Promise<OrderDTO | null> {
        try {
            const [orders] = await db.execute(
                `SELECT o.id AS order_id, oi.item_name, oi.quantity, oi.price, o.total
                 FROM orders o
                 JOIN order_items oi ON o.id = oi.order_id
                 WHERE o.id = ?`,
                [orderId]
            );

            if (!(orders as any[]).length) return null;

            const orderDTO = new OrderDTO(orderId, [], (orders as any[])[0].total);

            (orders as any[]).forEach(row => {
                orderDTO.items.push({
                    itemName: row.item_name,
                    quantity: row.quantity,
                    price: row.price
                });
            });

            return orderDTO;
        } catch (error) {
            throw new Error("Database Error: Unable to fetch order by ID");
        }
    }
}