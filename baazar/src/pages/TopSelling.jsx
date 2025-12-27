// src/pages/TopSelling.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import axios from "axios";

const TopSelling = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top selling products from backend
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/category/top-selling"
        );
        setTopProducts(res.data);
      } catch (err) {
        console.error("Error fetching top-selling products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSelling();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Loading top selling products...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-snug bg-gradient-to-r from-amber-600 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
          🔥 Top Selling Products
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base leading-normal">
          See what’s trending among shoppers this week!
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-10">
        {topProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-44 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
            />

            <div className="p-4">
              <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                {product.shortDesc}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">
                  {(product.rating || 0).toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-lg md:text-xl font-semibold text-orange-600">
                  {product.priceDisplay}
                </p>

                <Link
                  to={`/product/${product._id}`}
                  className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-400 text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-medium hover:scale-105 transition-transform duration-200 shadow-md"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-10 text-gray-500 text-sm md:text-base">
        <p>
          ✨ Updated daily — only at{" "}
          <span className="font-semibold text-orange-600">MyBaazar</span>
        </p>
      </div>
    </div>
  );
};

export default TopSelling;
