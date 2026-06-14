import { v2 as cloudinary } from "cloudinary";

// We will make 4 controler functions here
// -create product , -getAllproduct, -getSingleProduct, -remove product
// function for add product
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

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Yeh iss liay bcz  all 4 images mai syy joo upload nhii hoti thii woo undefined show krta thaa.
    //  hmm chchty hain sirf joo uplaod woo iss varbale mai aa jai.

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

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
      // As DB mai hmm number ki form proceas nuber store krwain gy
      price: Number(price),
      subCategory,
      // bestSeller boolean hai iss liay true ya false save krwain gy
      bestseller= bestseller === 'true' ? true:false,
    //   JSON.parse iss liay bcz string ki form mai data ko object ya array ki form mai convert krr sakain hmm.
      sizes:JSON.parse(sizes),
      image:imagesUrl,
      date:Date.now()
    };
    console.log(productData)
  

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
    res.json({});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// fucnction for list product
const listProducts = async (req, res) => {};

// function for removing product
const removeProduct = async (req, res) => {};

//function for single product infor
const singleProduct = async (req, res) => {};

export { addProduct, listProducts, removeProduct, singleProduct };
