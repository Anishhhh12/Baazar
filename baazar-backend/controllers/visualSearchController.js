import Product from "../models/product.js";
import { detectProductsFromImage } from "../services/visionService.js";

export const visualSearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // 🔹 AI detection (Google Vision)
    const detectedItems = await detectProductsFromImage(req.file.buffer);

    const results = {};

    for (const item of detectedItems) {
      let products = await Product.find({
        type: item.type,
        color: item.color
      }).limit(5);

      // fallback 1: type only
      if (products.length === 0) {
        products = await Product.find({
          type: item.type
        }).limit(5);
      }

      // fallback 2: tag-based
      if (products.length === 0) {
        products = await Product.find({
          tags: item.type
        }).limit(5);
      }

      results[item.type] = products;
    }

    res.json({
      detected: detectedItems,
      results
    });

  } catch (error) {
    console.error("Visual search error:", error);
    res.status(500).json({ message: "Visual search failed" });
  }
};
