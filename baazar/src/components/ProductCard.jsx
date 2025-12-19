// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="cursor-pointer block">
      <div className="bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col h-full">

        {/* Image */}
        <div className="w-full h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card Body (equal height layout) */}
        <div className="p-4 flex flex-col flex-grow">

          {/* Title */}
          <h2 className="font-semibold text-gray-800 text-lg line-clamp-1">
            {product.name}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.shortDesc}
          </p>

          {/* Price */}
          <p className="text-blue-600 font-bold mt-2">
            {product.priceDisplay}
          </p>

          {/* Push button to bottom */}
          <div className="mt-auto">
            <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
