// routes/sellerRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import { registerSeller, getSellerById } from "../controllers/sellerController.js";

const router = express.Router();

// use fields: support multiple named files
const cpUpload = upload.fields([
  { name: "aadhaar", maxCount: 1 },
  { name: "addressProof", maxCount: 1 },
  { name: "cheque", maxCount: 1 },
]);

router.post("/register", cpUpload, registerSeller);
router.get("/:sellerId", getSellerById);

export default router;
