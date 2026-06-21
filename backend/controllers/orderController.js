// Placing orders using COD Method
// Agrr user nyy paymnet method mai COD select kia hai tou uss case mai yeh API call hogi aur order place hoga.
const placeOrder = async (req, res) => {};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

// *********************************
// All Orders data for Admin Panel
// Admin Panel mai hum nyy ek page banaya hai jismein admin apne store ke sare orders dekh sakta hai aur unka status update kar sakta hai. Tou iss page ke liye yeh API call hogi jismein admin apne store ke sare orders ka data fetch kar sakta hai.
const allOrders = async (req, res) => {};

// User Order Data For Forntend
// Purpose of this API is that when user place an order tou usko apne orders ka data dikhe jismein uske sare orders ka data show ho aur usko apne orders ka status bhi pata chale.
const userOrders = async (req, res) => {};

// update order status
// Admin Panel mai admin apne store ke orders ka status update kar sakta hai. Tou iss API call se admin apne store ke orders ka status update kar sakta hai.
const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
