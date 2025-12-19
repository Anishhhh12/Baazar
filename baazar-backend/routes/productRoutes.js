// routes/productRoutes.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/category/:slug", getProductsByCategory);
router.get("/:id", getProductById);

// protected create/update/delete
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
