import User from "../models/user.js";

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// POST /api/wishlist/:productId
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (index !== -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    await user.populate("wishlist");

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Wishlist update failed" });
  }
};
