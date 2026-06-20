import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  // userId is from token decode.
  const { userId, ItemId, size } = req.body;
  //   And from his userID we will get his cart data and then we will add product to his cart.
  const userData = await userModel.findById(userId);
};

// update user cart
const updateCart = async (req, res) => {};

// get user cart data
const getUserCart = async (req, res) => {};

export const { addToCart, updateCart, getUserCart };
