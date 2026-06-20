// This middleWare will check if the user is authenticated or not.
// We will authenticate whenEver user will add product to cart, get user cart data and update user cart data.

import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // We will send token from headers and verify it. If token is valid then we will allow user to access the route otherwise we will send unauthorized error.
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Remeber,
    // Jb hmm nyy token banaya tha tou usme hm nyy user id daali thi.
    //    And outpt of decoded token includes object that contain user id,expiresIn and iat.
    // Now we will add that Id in req.body
    req.body.userId = token_decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authUser;
