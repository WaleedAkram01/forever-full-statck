import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Read-only demo admin, so the admin panel can be shown safely in a portfolio.
// Override with DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD, or disable with DEMO_ADMIN_ENABLED=false.
const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || "demo@kapra.store";
const DEMO_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "demo1234";
const demoEnabled = process.env.DEMO_ADMIN_ENABLED !== "false";

if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length < 12) {
  console.warn("[security] ADMIN_PASSWORD is shorter than 12 characters. Set a strong value in your environment.");
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email: String(email).toLowerCase().trim() });
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.json({ success: true, token: createToken(user._id), name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Please enter your name" });
    }
    if (!email || !validator.isEmail(String(email))) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await userModel.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created",
      token: createToken(user._id),
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // The token only carries a role. It never contains the credentials.
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ success: true, token, role: "admin" });
    }

    if (demoEnabled && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const token = jwt.sign({ role: "demo" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ success: true, token, role: "demo" });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

export { login, registration, adminLogin };
