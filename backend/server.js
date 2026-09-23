import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRoute.js";
// App Config
const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
const allowedOrigins = [
  "https://forever-full-statck.vercel.app",
  "https://forever-admin-pied-ten.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Postman/server-to-server requests ka origin nahi hota
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    allowedHeaders: ["Content-Type", "token"],
  }),
);

// API Endpoints
app.use("/api/users", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
