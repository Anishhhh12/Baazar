// controllers/productController.js
import Product from "../models/product.js";

// GET /api/products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { next(err); }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ $or: [{ _id: id }, { idString: id }] });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) { next(err); }
};

// GET /api/products/category/:slug
export const getProductsByCategory = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    // match either category or slug field
    const items = await Product.find({
      $or: [{ category: slug }, { slug: slug }]
    }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const p = new Product({
      name: data.name || "Untitled",
      idString: data.id || data.idString || undefined,
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, "-") : ""),
      category: data.category || "uncategorized",
      shortDesc: data.shortDesc || "",
      longDesc: data.longDesc || "",
      price: data.price || null,
      priceDisplay: data.priceDisplay || data.price ? `₹${data.price}` : "",
      image: data.image || "",
      rating: data.rating || 0,
      seller: req.user ? req.user._id : null
    });
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ $or: [{ _id: id }, { idString: id }] });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // optional: restrict update to seller who created it
    if (product.seller && req.user && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ $or: [{ _id: id }, { idString: id }] });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // optional owner check
    if (product.seller && req.user && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await product.remove();
    res.json({ message: "Product removed" });
  } catch (err) { next(err); }
};
