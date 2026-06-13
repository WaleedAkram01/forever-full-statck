import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRouter.js";
// App Config
const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/users", userRouter);
aapp.use("/api/product", productRouter);
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
