import mongoose from "mongoose";

// ⚠️ Agar try-catch na hota? Database connect na hone pe app ek ganda crash deti, koi clear message na hota. try-catch se humein saaf pata chalta hai "database mein masla hai."

// Bina try-catch server proper errror message deta, hamain pata chalta ky database mai issue yaa credentials galat hai.

// process.exit(1) = "agar database hi connect na ho, toh poora server band kar do" (kyunki bina DB ke server bekaar hai). 1 ka matlab "error ke saath band hua."

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
