// src/controllers/OrderController.ts
import { Request, Response } from "express";
import { Order } from "../models/Order";
import { OrderRepository } from "../repository/OrderRepository";

export class OrderController {
    static async createOrder(req: Request, res: Response) {
        try {
            const { items, shipping_method, payment_method } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0 || !shipping_method || !payment_method) {
                return res.status(400).json({ error: "All fields are required." });
            }

            const order = new Order(null, items, shipping_method, payment_method);
            const savedOrder = await OrderRepository.saveOrder(order);

            return res.status(201).json({
                message: "Order created successfully",
                order: savedOrder
            });
        } catch (error: unknown) {
            let errorMessage = "An unexpected error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ error: errorMessage });
        }
    }

    static async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await OrderRepository.getAllOrders();
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message  });
        }
    }

    static async getOrderById(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const order = await OrderRepository.getOrderById(Number(orderId));

            if (!order) return res.status(404).json({ error: "Order not found" });

            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message  });
        }
    }
}
