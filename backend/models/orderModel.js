// Jb user apna cart complete krr lai ga place-order page mai apni details joo enter kryyy ga uss kyy liay ab Schema banain gy.

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // Here we will store product data that user has added to cart and placed order.
  items: { type: Array, required: true },
  // Here we will store the total amount of the order.
  amount: { type: Number, required: true },
  // Here we will store the delivery address of the order.
  address: { type: Object, required: true },
  // Here we will store the status of the order.
  //   default value is Order Placed because jb user order place krrta hai tou order ka status Order Placed hoga aur jb admin order ko process krrta hai tou uska status change kr den gy.
  status: { type: String, required: true, default: "Order Placed" },
  // Here we will store the payment method of the order.
  paymentMethod: { type: String, required: true },
  // Here we will store the payment status of the order.
  //default:false bcz jb user order place krrta hai tou payment complete nhi hoti hai tou payment status false hoga aur jab user payment complete krrta hai tou payment status true kr den gy.
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },
});

// Yeh iss
export const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
