// seed/seedProducts.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import products from "./product_source.js";
import Product from "../models/product.js";

const seed = async () => {
  try {
    await connectDB();

    console.log("Deleting old products...");
    await Product.deleteMany({});

    console.log("Inserting new products...");

    const formatted = products.map(p => ({
      name: p.name,
      idString: p.id,
      slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
      category: p.category,
      shortDesc: p.shortDesc,
      longDesc: p.longDesc,
      price: p.price || null,
      priceDisplay: p.priceDisplay || "",
      image: p.image,
      rating: p.rating || 0,

      // 🔴 REQUIRED FIELDS (FIX)
      type: p.type || "random",
      color: p.color || "random",
      tags: p.tags || []
    }));

    await Product.insertMany(formatted);

    console.log("Seed successful. Inserted:", formatted.length);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
