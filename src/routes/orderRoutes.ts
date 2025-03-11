// // src/routes/orderRoutes.ts
// import express from "express";
// import { OrderController } from "../controllers/OrderController";

// const router = express.Router();

// router.post("/checkout", OrderController.createOrder);

// export default router;

import express from 'express';
import { OrderController } from '../controllers/OrderController';

const router = express.Router();

const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/checkout', asyncHandler(OrderController.createOrder));

export default router;
