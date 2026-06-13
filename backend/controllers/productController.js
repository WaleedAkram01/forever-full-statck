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

    console.log(
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    );
    console.log(image1, image2, image3, image4);

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
