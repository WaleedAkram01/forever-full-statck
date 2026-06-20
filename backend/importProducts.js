/**
 * BULK PRODUCT IMPORT SCRIPT
 * ---------------------------
 * Ye script tumhare assets.js ke andar wale 52 products ko
 * automatically tumhare backend ke "Add Product" API pe POST kar dega,
 * tumhare assets folder ki actual image files ke saath.
 *
 * SETUP (sirf ek baar):
 *   1) Is file ko apne project mein kahin bhi rakho (e.g. backend folder ke andar)
 *   2) Terminal mein wahan ja kar ye run karo:
 *        npm install axios form-data
 *   3) Niche CONFIG section mein apni admin email/password aur paths set karo
 *   4) Run karo:
 *        node importProducts.js
 *
 * Agar tumhara backend route ya field names is se mismatch karte hain,
 * to CONFIG section ke comments follow karke change kar dena.
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

// ============================================================
// CONFIG -- ISE APNE PROJECT KE MUTABIQ SET KARO
// ============================================================

// Backend ka base URL (jaisa tumne diya: localhost:9000)
const BASE_URL = "http://localhost:9000";

// Jahan tumhari images actually rakhi hain (E: drive wala path)
const IMAGES_DIR =
  "E:\\PERSONAL PROJECTS\\Full-Stack-Ecommerce\\frontend\\src\\assets";

// Tumne already admin token de diya hai, isliye login step skip kar rahe hain.
// Agar ye token expire ho jaye (401/invalid token error aaye), to apne admin
// panel mein dobara login karke naya token nikaal lena aur yahan paste kar dena.
const STATIC_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.YWRtaW5AZ21haWwuY29tYWRtaW4.aF4NXsibZIaTI9twpE-cVftCw9iv4ah7AE09ZP4eLAU";

// Add product ka route
const ADD_PRODUCT_ROUTE = "/api/product/add";

// Delay between each product upload (ms) -- server ko overload na karne ke liye
const DELAY_MS = 400;

// ============================================================
// PRODUCT DATA (assets.js se nikala gaya, image imports ki jagah
// sirf filename strings use ki gayi hain taake disk se file uthayi ja sake)
// ============================================================

const products = [
  { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 100, images: ["p_img1.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L"], bestseller: true },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, images: ["p_img2_1.png", "p_img2_2.png", "p_img2_3.png", "p_img2_4.png"], category: "Men", subCategory: "Topwear", sizes: ["M", "L", "XL"], bestseller: true },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, images: ["p_img3.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "L", "XL"], bestseller: true },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 110, images: ["p_img4.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "XXL"], bestseller: true },
  { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 130, images: ["p_img5.png"], category: "Women", subCategory: "Topwear", sizes: ["M", "L", "XL"], bestseller: true },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, images: ["p_img6.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "L", "XL"], bestseller: true },
  { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, images: ["p_img7.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "L", "XL"], bestseller: false },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, images: ["p_img8.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 100, images: ["p_img9.png"], category: "Kids", subCategory: "Topwear", sizes: ["M", "L", "XL"], bestseller: false },
  { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 110, images: ["p_img10.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "L", "XL"], bestseller: false },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 120, images: ["p_img11.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L"], bestseller: false },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 150, images: ["p_img12.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 130, images: ["p_img13.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 160, images: ["p_img14.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, images: ["p_img15.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 170, images: ["p_img16.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 150, images: ["p_img17.png"], category: "Men", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 180, images: ["p_img18.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 160, images: ["p_img19.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Palazzo Pants with Waist Belt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, images: ["p_img20.png"], category: "Women", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 170, images: ["p_img21.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Palazzo Pants with Waist Belt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, images: ["p_img22.png"], category: "Women", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 180, images: ["p_img23.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 210, images: ["p_img24.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, images: ["p_img25.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, images: ["p_img26.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, images: ["p_img27.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 230, images: ["p_img28.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 210, images: ["p_img29.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 240, images: ["p_img30.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, images: ["p_img31.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 250, images: ["p_img32.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 230, images: ["p_img33.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 260, images: ["p_img34.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 240, images: ["p_img35.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 270, images: ["p_img36.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 250, images: ["p_img37.png"], category: "Women", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 280, images: ["p_img38.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Printed Plain Cotton Shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 260, images: ["p_img39.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 290, images: ["p_img40.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 270, images: ["p_img41.png"], category: "Men", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 300, images: ["p_img42.png"], category: "Kids", subCategory: "Topwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 280, images: ["p_img43.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 310, images: ["p_img44.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 290, images: ["p_img45.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 320, images: ["p_img46.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 300, images: ["p_img47.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 330, images: ["p_img48.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 310, images: ["p_img49.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 340, images: ["p_img50.png"], category: "Kids", subCategory: "Bottomwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 320, images: ["p_img51.png"], category: "Women", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
  { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 350, images: ["p_img52.png"], category: "Men", subCategory: "Winterwear", sizes: ["S", "M", "L", "XL"], bestseller: false },
];

// ============================================================
// SCRIPT LOGIC -- isay change karne ki zaroorat nahi
// ============================================================

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function addProduct(product, token, index, total) {
  const form = new FormData();
  form.append("name", product.name);
  form.append("description", product.description);
  form.append("price", product.price);
  form.append("category", product.category);
  form.append("subCategory", product.subCategory);
  form.append("sizes", JSON.stringify(product.sizes));
  form.append("bestseller", String(product.bestseller));

  // Attach images as image1, image2, image3, image4
  product.images.forEach((filename, i) => {
    const filePath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`   ⚠️  Image file nahi mili: ${filePath}`);
      return;
    }
    form.append(`image${i + 1}`, fs.createReadStream(filePath));
  });

  try {
    const res = await axios.post(`${BASE_URL}${ADD_PRODUCT_ROUTE}`, form, {
      headers: {
        ...form.getHeaders(),
        token: token, // GreatStack tutorial mein header ka naam "token" hota hai
      },
    });
    if (res.data.success === false) {
      console.log(
        `[${index}/${total}] ❌ ${product.name} -> ${res.data.message}`
      );
    } else {
      console.log(`[${index}/${total}] ✅ ${product.name} added.`);
    }
  } catch (err) {
    console.log(
      `[${index}/${total}] ❌ ${product.name} -> ${
        err.response?.data?.message || err.message
      }`
    );
  }
}

async function run() {
  console.log(`Total ${products.length} products import honge.\n`);
  const token = STATIC_TOKEN;

  for (let i = 0; i < products.length; i++) {
    await addProduct(products[i], token, i + 1, products.length);
    await sleep(DELAY_MS);
  }

  console.log("\n🎉 Import process complete!");
}

run();
