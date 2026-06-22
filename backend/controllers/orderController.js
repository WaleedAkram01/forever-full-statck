import { orderModel } from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import Stripe from "stripe";

// global variables for stripe payment
const currency = "PKR";
const deliveryCharge = 10;
//gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing orders using COD Method
// Agrr user nyy paymnet method mai COD select kia hai tou uss case mai yeh API call hogi aur order place hoga.
const placeOrder = async (req, res) => {
  try {
    // This userId is from token decode. And items, amount, address are from request body that user will send when placing order.
    const { userId, items, amount, address } = req.body;

    // Ab hum nyy order data ko create krain gy aur usko database mai save kr den gy.
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    // Ab hum nyy orderData create kr diya hai tou usko database mai save kr den gy.
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clears the user's cart data after successfully placing the order
    await userModel.findByIdAndUpdate(userId, { cart: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    // This userId is from token decode. And items, amount, address are from request body that user will send when placing order.
    const { userId, items, amount, address } = req.body;
    // Yeh origin basically na kya hai kyy na user ka domain name hai jahan syy user nyy request bheji hai. Agrr user nyy apne website syy request bheji hai tou origin mai uska domain name hoga aur agrr user nyy postman syy request
    // Like abhii frontend syy basicalay krty  tou origin mai localhost:5173 aay ga.
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };
    // Ab hum nyy orderData create kr diya hai tou usko database mai save kr den gy.
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // After placing the order we would create line items using that we can execue stripe payment
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// AB jb payment successfully agrr hoo gii ou redrect kryy ga
// Ab check krnyy kyy liay either succesfull payyment hui hai yaa nhii.
// Iss kyy liay aik controller function
// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method
// const placeOrderRazorpay = async (req, res) => {};

// *********************************
// All Orders data for Admin Panel
// Admin Panel mai hum nyy ek page banaya hai jismein admin apne store ke sare orders dekh sakta hai aur unka status update kar sakta hai. Tou iss page ke liye yeh API call hogi jismein admin apne store ke sare orders ka data fetch kar sakta hai.
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data For Forntend
// Purpose of this API is that when user place an order tou usko apne orders ka data dikhe jismein uske sare orders ka data show ho aur usko apne orders ka status bhi pata chale.
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status
// Admin Panel mai admin apne store ke orders ka status update kar sakta hai. Tou iss API call se admin apne store ke orders ka status update kar sakta hai.
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  // placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
};
