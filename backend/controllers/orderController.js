import Stripe from "stripe";
import mongoose from "mongoose";
import { orderModel } from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import { productModel } from "../models/productModel.js";

const currency = "pkr";
export const DELIVERY_FEE = 250;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const ORDER_STATUSES = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered", "Cancelled"];
const ADDRESS_FIELDS = ["firstName", "lastName", "email", "street", "city", "state", "zipcode", "country", "phone"];

// Never trust prices or totals sent by the browser: rebuild the order from the database.
const buildOrderItems = async (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("Your cart is empty");
  }

  const ids = [...new Set(rawItems.map((i) => String(i?._id)))].filter((id) => mongoose.isValidObjectId(id));
  const products = await productModel.find({ _id: { $in: ids } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  let subtotal = 0;
  for (const raw of rawItems) {
    const product = byId.get(String(raw?._id));
    const quantity = Number.parseInt(raw?.quantity, 10);
    if (!product) throw new Error("A product in your cart is no longer available");
    if (!product.sizes.includes(raw.size)) throw new Error(`Size ${raw.size} is not available for ${product.name}`);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("Invalid quantity");

    items.push({
      _id: String(product._id),
      name: product.name,
      price: product.price,
      image: product.image.slice(0, 1),
      category: product.category,
      size: raw.size,
      quantity,
    });
    subtotal += product.price * quantity;
  }
  return { items, amount: subtotal + DELIVERY_FEE };
};

const cleanAddress = (address = {}) => {
  const clean = {};
  for (const field of ADDRESS_FIELDS) {
    const value = String(address[field] ?? "").trim();
    if (!value) throw new Error("Please fill in all delivery details");
    clean[field] = value.slice(0, 120);
  }
  return clean;
};

const placeOrder = async (req, res) => {
  try {
    const { userId, items: rawItems, address } = req.body;
    const { items, amount } = await buildOrderItems(rawItems);

    await orderModel.create({
      userId,
      items,
      address: cleanAddress(address),
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });
    await userModel.findByIdAndUpdate(userId, { cart: {} });

    res.json({ success: true, message: "Order placed" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    if (!stripe) throw new Error("Card payments are not configured");
    const { userId, items: rawItems, address } = req.body;
    const { origin } = req.headers;
    const { items, amount } = await buildOrderItems(rawItems);

    const order = await orderModel.create({
      userId,
      items,
      address: cleanAddress(address),
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: `${item.name} (${item.size})` },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: { currency, product_data: { name: "Delivery" }, unit_amount: DELIVERY_FEE * 100 },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
      line_items,
      mode: "payment",
      metadata: { orderId: String(order._id) },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Confirms payment with Stripe itself instead of trusting the "success" query parameter.
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order" });
    }

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.payment) return res.json({ success: true });

    let paid = false;
    if (success === "true" && stripe && order.stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
      paid = session.payment_status === "paid";
    }

    if (paid) {
      order.payment = true;
      await order.save();
      await userModel.findByIdAndUpdate(userId, { cart: {} });
      return res.json({ success: true });
    }

    await orderModel.deleteOne({ _id: orderId, payment: false });
    return res.json({ success: false, message: "Payment was not completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not verify payment" });
  }
};

const maskAddress = (address = {}) => ({
  ...address,
  lastName: address.lastName ? `${String(address.lastName)[0]}.` : "",
  email: "hidden@demo",
  street: "Hidden in demo mode",
  phone: "•••• •••••••",
  zipcode: "•••••",
});

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 }).lean();
    const result = req.adminRole === "demo" ? orders.map((o) => ({ ...o, address: maskAddress(o.address) })) : orders;
    res.json({ success: true, orders: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load orders" });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load your orders" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not update status" });
  }
};

export { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe };
