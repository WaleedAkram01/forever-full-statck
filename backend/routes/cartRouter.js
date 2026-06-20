import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import { authUser } from "../middlewares/authMiddleware.js";
const cartRouter = express.Router();

// Remember:-
// Jb koi user inn API koo request kryy ga tou ny Hm nyy middleWare mai add kia hua hai kyy req.bdy mai ID hmm daal den gy. Aur controller function mai ussay lyy lain gy.
cartRouter.post("/get", authUser, getUserCart);
cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/update", authUser, updateCart);

export default cartRouter;
