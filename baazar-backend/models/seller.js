// models/Seller.js
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    sellerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    businessName: { type: String },
    pan: { type: String },
    gstin: { type: String },
    entityType: { type: String },
    aadhaarPath: { type: String },
    addressProofPath: { type: String },
    bankAccount: { type: String },
    ifsc: { type: String },
    chequePath: { type: String },
    status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
