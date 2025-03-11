import { db } from '../database';
import { Order } from '../models/Order';

export class OrderRepository {
    static async saveOrder(order: Order) {
        const { subtotal, discount, shippingCost, taxes, total } = order.getTotal();

        try {
            const [result] = await db.execute(
                `INSERT INTO orders (item_name, quantity, price, discount, shipping_method, payment_method, shipping_cost, taxes, total)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [order.itemName, order.quantity, order.price, discount, order.shippingMethod, order.paymentMethod, shippingCost, taxes, total]
            );

            return { id: (result as any).insertId, ...order, discount, shippingCost, taxes, total };
        } catch (error) {
            throw new Error('Database Error: Unable to save order');
        }
    }
}
