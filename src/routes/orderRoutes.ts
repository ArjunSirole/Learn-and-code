import express from "express";
import { OrderController } from "../controllers/OrderController";

const router = express.Router();
const asyncHandler =
  (fn: Function) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post("/checkout", asyncHandler(OrderController.createOrder));
router.get("/orders", asyncHandler(OrderController.getAllOrders));
router.get("/orders/:orderId", asyncHandler(OrderController.getOrderById));

export default router;
