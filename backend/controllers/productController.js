import { v2 as cloudinary } from "cloudinary";
import { productModel } from "../models/productModel.js";

const CATEGORIES = ["Men", "Women", "Kids"];
const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

// Extracts "folder/name" from a Cloudinary URL so the image can be deleted with the product
const publicIdFromUrl = (url) => {
  const match = String(url).match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
  return match ? match[1] : null;
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const parsedSizes = JSON.parse(sizes || "[]");
    const numericPrice = Number(price);
    if (!name?.trim() || !description?.trim()) throw new Error("Name and description are required");
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) throw new Error("Enter a valid price");
    if (!CATEGORIES.includes(category) || !SUB_CATEGORIES.includes(subCategory)) throw new Error("Invalid category");
    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0 || parsedSizes.some((s) => !SIZES.includes(s))) {
      throw new Error("Select at least one size");
    }

    const images = ["image1", "image2", "image3", "image4"]
      .map((key) => req.files?.[key]?.[0])
      .filter(Boolean);
    if (images.length === 0) throw new Error("Upload at least one image");

    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "image", folder: "kapra/products" });
        return result.secure_url;
      }),
    );

    await productModel.create({
      name: name.trim(),
      description: description.trim(),
      category,
      subCategory,
      price: numericPrice,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    });

    res.json({ success: true, message: "Product added" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not load products" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.body.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Clean up the product's images in Cloudinary (failures here don't block the delete)
    await Promise.all(
      product.image.map((url) => {
        const publicId = publicIdFromUrl(url);
        return publicId ? cloudinary.uploader.destroy(publicId).catch(() => null) : null;
      }),
    );

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not delete product" });
  }
};

const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch {
    res.status(400).json({ success: false, message: "Invalid product id" });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct, publicIdFromUrl };
