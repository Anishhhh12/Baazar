// controllers/orderController.js
import Order from "../src/auth/order.js";
import Product from "../models/product.js";

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { items, total } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "No items" });
    const orderItems = await Promise.all(items.map(async (it) => {
      // try to fetch latest price if product id supplied
      if (it.product) {
        const p = await Product.findById(it.product);
        return {
          product: p ? p._id : null,
          name: it.name || (p ? p.name : ""),
          qty: it.qty || 1,
          price: it.price || (p ? p.price : 0),
          image: it.image || (p ? p.image : "")
        };
      } else {
        return { ...it };
      }
    }));

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      total
    });

    res.status(201).json(order);
  } catch (err) { next(err); }
};

// GET /api/orders/myorders (protected)
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("items.product");
    res.json(orders);
  } catch (err) { next(err); }
};
