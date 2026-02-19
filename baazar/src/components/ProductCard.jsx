// src/components/ProductCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";


// later we will import useWishlist from context

const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { user } = useUser();
  const { addToCart } = useCart();
  const cart = useCart();

  const navigate = useNavigate();

  const isWishlisted = wishlist.some(
    (item) => item._id === product._id
  );

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    toggleWishlist(product._id);
  };

  const handleAddToCart = (e) => {
  e.stopPropagation();

  addToCart({
    id: product._id,
    name: product.name,
    image: product.image,
    price: product.price ?? product.priceDisplay,
  });

  navigate("/cart"); // 👈 THIS WAS MISSING
};


  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col h-full">

      {/* Clickable part */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative">
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow"
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>

          <div className="w-full h-48 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="p-4">
          <h2 className="font-semibold text-gray-800 text-lg line-clamp-1">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.shortDesc}
          </p>
          <p className="text-blue-600 font-bold mt-2">
            {product.priceDisplay}
          </p>
        </div>
      </Link>

      {/* NOT inside Link */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};


export default ProductCard;
