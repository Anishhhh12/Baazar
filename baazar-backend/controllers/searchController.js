import Product from "../models/product.js";

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const regex = new RegExp(q, "i");

    const products = await Product.find({
      $or: [
        { name: regex },
        { category: regex },
        { type: regex },
        { color: regex },
        { tags: regex },
        { shortDesc: regex }
      ]
    }).limit(20);

    res.json(products);

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};
