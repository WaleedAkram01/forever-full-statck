import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // Snapshot of each purchased product (name, price, image, size, quantity) at order time
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  stripeSessionId: { type: String },
  date: { type: Number, required: true },
});

export const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
