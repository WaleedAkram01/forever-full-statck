import { userModel } from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    // userId is from token decode.
    const { userId, ItemId, size } = req.body;
    //   And from his userID we will get his cart data and then we will add product to his cart.
    const userData = await userModel.findById(userId);
    // Remember, userData is the object that contain all data of user including his cart data. And cart data is also an object that contain product id as key and size and quantity as value.
    //   We will update this cart data and then we will save it in database.
    let cartData = await userData.cartData;

    // We will check if this cartData has this itemId available or not.
    // Means to say kia yeh already cart mai hai ya nahi.
    if (cartData[ItemId]) {
      // We will check if this cartData for this ItemId has this size available or not if yes then we will increase the quantity by 1 otherwise we will add this size in this ItemId with quantity 1.
      // Means if this size was already there we will increase its count otherwise we will add this size with quantity 1
      if (cartData[ItemId][size]) {
        cartData[ItemId][size] += 1;
      } else {
        cartData[ItemId][size] = 1;
      }
    } else {
      // Agrr iss ItemId ka data hi nahi hai tou hmm usko add kr den gy with this size and quantity 1
      cartData[ItemId] = {};
      cartData[ItemId][size] = 1;
    }

    // Ab hum nyy cartData update kr diya hai tou usko database mai save kr den gy.
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    // Hm nyy uss cart maii syy cartData ko access kia.
    let cartData = await userData.cartData;

    // We will update the quantity of this size in this ItemId with the given quantity.
    cartData[itemId][size] = quantity;
    // Ab hum nyy cartData update kr diya hai tou usko database mai save kr den gy.
    await userModel.findByIdAndUpdate(userId, { cartData: cartData });

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
  } catch (error) {}
};

export { addToCart, updateCart, getUserCart };
