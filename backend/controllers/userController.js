import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Route for user registration
const registration = async (req, res) => {
  try {
    // data aaya frontend syy
    const { name, email, password } = req.body;

    // Check if user already exists then error de do.
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // validation of email and password using validator library
    //Yeh code check karta hai ke user ne jo email enter kiya hai, kya woh sach mein aik sahi email address hai (jaise ali@gmail.com) ya bas fazool text hai.Agr galat jaisy yehan not operator hai ou error message dyy do Plz.
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
    }

    // If email and password are both correct then
    // For passord hashing we will use bcrypt library
    // 10 level of sceurity ko bta-ta hai.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Now,user would be ceated in database.
    const user = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    // Ab jb user DB mai save hota hai dydefault _id key hoti hai uss mai.
    await user.save();

    // Ab joo user save kia thaa uss ki id sy hii token generate krwa lia
    // Innterview Most Important Question: JWT Token kya hota hai? Iss ka benefit?See blogger

    const token = createToken(user._id);
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Route for admin login
// Now ,here  we will create admin authentication system
// First in .env add admin email and password
const adminLogin = async (req, res) => {
  try {
    // Yeh user ny joo credentials enter kiay hain.
    const { email, password } = req.body;

    // Matching credentials with our .env credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // If credentials match, then generate token (object ki tarah pass karna best hai)
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      return res.status(200).json({
        success: true,
        // Using this token we will authenticate our admin
        // To authenticate we will make middleWare(adminAuth).
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { login, registration, adminLogin };
