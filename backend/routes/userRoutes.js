import express from "express";
import {
  login,
  registration,
  adminLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();
// Route for user login
userRouter.post("/login", login);
// Route for user registration
userRouter.post("/register", registration);
// Route for admin login
userRouter.post("/admin", adminLogin);

export default userRouter;
