import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // image field ko array banaya gaya hai, jisme multiple images store ki ja sakti hain
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
  bestseller: {
    type: Boolean,
  },
  date: {
    type: Number,
    required: true,
  },
});

// Problem happens that when we will run the project the productModel would be created multiple times and it will give us an error that "Cannot overwrite `product` model once compiled." To solve this problem we will check if the model already exists or not before creating it.
export const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);
