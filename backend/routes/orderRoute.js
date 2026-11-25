import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
} from "../controllers/orderController.js";
import authUser from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

const orderRouter = express.Router();

// Admin (the read-only demo admin can view orders but not change them)
orderRouter.post("/list", adminAuth({ allowDemo: true }), allOrders);
orderRouter.post("/status", adminAuth(), updateStatus);

// Checkout
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/verifyStripe", authUser, verifyStripe);

// Customer
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
