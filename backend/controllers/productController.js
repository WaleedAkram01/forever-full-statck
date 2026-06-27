import { v2 as cloudinary } from "cloudinary";
import { productModel } from "../models/productModel.js";

// We will make 4 controler functions here
// -create product , -getAllproduct, -getSingleProduct, -remove product
// function for add product

// What we learnt in this function:-
// To handle Images through multer and other stuff .
const addProduct = async (req, res) => {
  // To add a product
  // We will create a middleWare using multer here so if we pass any file using formData it should pass through multer.
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    // Purpose of && yeh hai kyy agar image1 exist krta hai tou hi uss ki value ko image1 mai daal do warna undefined daal do.
    //req.files.image1 && req.files.image1[0] — yeh ek safety check hai: "agar image1 mojood hai (&&), tabhi usay lo." Kyunki ho sakta admin ne sirf 2 images di hon, 4 nahi. (Bina is check ke undefined pe crash hota.)
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Yeh iss liay bcz  all 4 images mai syy joo upload nhii hoti thii woo undefined show krta thaa.
    //  hmm chchty hain sirf joo uplaod woo iss varbale mai aa jai.

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );
    //  SEE IN BLOOGER REGARDING THIS QUESTION:-14
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        // item.path --->.path idhar na joo multer temporary iMage save krta hai woo hmm ab cloudianry mai uplaod karain gyy AUR then woo URL daii ga cludinary ga jisy DB mai save krwaa lain gy.
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      // Frontend syy data strng kii form mai aata hai iss liay hmm ussay number mai convert krwa lain gy.
      // As DB mai hmm number ki form proceas nuber store krwain gy
      price: Number(price),
      subCategory,
      // bestSeller boolean hai iss liay true ya false save krwain gy
      bestseller: bestseller === "true" ? true : false,
      //   JSON.parse iss liay bcz string ki form mai data ko object ya array ki form mai convert krr sakain hmm.
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);

    // Waleed undefined 100 Mens topwear ["M"] true
    console.log(
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    );

    console.log(imagesUrl);
    /*  [
  'https://res.cloudinary.com/dyaqjxqtd/image/upload/v178137
  'https://res.cloudinary.com/dyaqjxqtd/image/upload/v178137
  'https://res.cloudinary.com/dyaqjxqtd/image/upload/v178137
  'https://res.cloudinary.com/dyaqjxqtd/image/upload/v178137
] */

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// fucnction for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// function for removing product
// Product differnet ways syy del hoo skti hai But hmm req.body syy delete karain gyy brother.
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    // 1. findByIdAndDelete use karein aur await lagayein
    const product = await productModel.findByIdAndDelete(id);

    // 2. Check karein agar product database mai mila hi nahi
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
