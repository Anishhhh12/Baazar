// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // existing fields (unchanged)
  name: { type: String, required: true },

  idString: { type: String }, // optional string id from frontend data

  slug: { type: String, index: true },

  category: { type: String, index: true },

  shortDesc: String,

  longDesc: String,

  price: { type: Number, default: null },

  priceDisplay: { type: String, default: "" },

  image: { type: String, default: "" },

  rating: { type: Number, default: 0 },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // 🔴 NEW FIELDS (FOR VISUAL SEARCH)

  // what kind of product it is (shirt, jeans, shoes)
  type: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },

  // primary color of the product
  color: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },

  // optional style-related keywords
  tags: [
    {
      type: String,
      lowercase: true
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
