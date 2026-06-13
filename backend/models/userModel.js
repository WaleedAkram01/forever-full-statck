import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // WhenEver the user would be created the cart would be an empty object.
    cart: {
      type: Object,
      default: {},
    },
  },
  // minimize: Hm nyy yeh iss liay likhaa hai bcz upar joo cart mai bydefault mpty object hai mongoose yeh allow nhii krta hai bydefault, toh minimize: false krne se mongoose ko yeh pata chal jata hai ki cart field mai empty object bhi allow hai.
  { minimize: false },
);

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);
