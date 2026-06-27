// Yeh hamary pss userModel Schea syy Link hoo ga .
import { userModel } from "../models/userModel.js";

// Add products to user cart
// Most Important Concept:-
// Sawaal: dono jagah same logic kyun fronetnd and backend prr same code hai addToCart ka.?

// Frontend → screen foran update ho (user ko turant dikhe), DB ka intezaar na karna pade
// Backend → DB mein permanent save ho (refresh pe bach jaaye)
// Isay "optimistic update" kehte hain — frontend pehle dikha deta hai, backend baad mein confirm karta hai. ⚡ (Interview keyword!)

const addToCart = async (req, res) => {
  try {
    // userId is from token decode.
    const { userId, itemId, size } = req.body;
    //   And from his userID we will get his cart data and then we will add product to his cart.
    const userData = await userModel.findById(userId);
    // Remember, userData is the object that contain all data of user including his cart data. And cart data is also an object that contain product id as key and size and quantity as value.
    //   We will update this cart data and then we will save it in database.
    let cartData = userData.cart;

    // We will check if this cartData has this itemId available or not.
    // Means to say kia yeh already cart mai hai ya nahi.
    if (cartData[itemId]) {
      // We will check if this cartData for this itemId has this size available or not if yes then we will increase the quantity by 1 otherwise we will add this size in this itemId with quantity 1.
      // Means if this size was already there we will increase its count otherwise we will add this size with quantity 1
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      // Agrr iss itemId ka data hi nahi hai tou hmm usko add kr den gy with this size and quantity 1
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Isss user ko dhoondho aur uska cart field naye cartData se update kar do
    await userModel.findByIdAndUpdate(userId, { cart: cartData });

    res.json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

// update user cart
//Agrr kaam upar waly syy hii joo jana tha atou iss ska kia purpposoe hai
//Dekho user, agrr addTocart product kii a ur +1 krii jaa rhaa then upar wala hii sue hoo ga
//Lkain agrr quantity direct 5 likh dyy means bss quantity update hoo rhii hai then yeh use hoo gs
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    // Hm nyy uss cart maii syy cartData ko access kia.
    let cartData = userData.cart;

    // We will update the quantity of this size in this itemId with the given quantity.
    cartData[itemId][size] = quantity;
    // Ab hum nyy cartData update kr diya hai tou usko database mai save kr den gy.
    await userModel.findByIdAndUpdate(userId, { cart: cartData });

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
    const userData = await userModel.findById(userId);

    // Simply iss tarahn bhii krr skty hain.
    // Lkain agrr lines of code increase krna hai tou
    // res.json({ success: true, cartData: userData.cart });

    let cartData = userData.cart;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, updateCart, getUserCart };
