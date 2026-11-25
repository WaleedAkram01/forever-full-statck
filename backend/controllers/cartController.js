import { userModel } from "../models/userModel.js";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    if (!itemId || !SIZES.includes(size)) {
      return res.status(400).json({ success: false, message: "Invalid item or size" });
    }

    const userData = await userModel.findById(userId);
    const cartData = userData.cart || {};
    cartData[itemId] = cartData[itemId] || {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cart: cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const qty = Number.parseInt(quantity, 10);
    if (!itemId || !SIZES.includes(size) || !Number.isInteger(qty) || qty < 0 || qty > 20) {
      return res.status(400).json({ success: false, message: "Invalid cart update" });
    }

    const userData = await userModel.findById(userId);
    const cartData = userData.cart || {};
    cartData[itemId] = cartData[itemId] || {};
    if (qty === 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      cartData[itemId][size] = qty;
    }

    await userModel.findByIdAndUpdate(userId, { cart: cartData });
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    res.json({ success: true, cartData: userData?.cart || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, updateCart, getUserCart };
