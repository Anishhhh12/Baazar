// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";


const ProductDetails = () => {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const API_ROOT = import.meta.env.VITE_API_URL || '';
        const res = await axios.get(`${API_ROOT}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Product fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);


  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      image: product.image,
      price: product.price ?? product.priceDisplay,
    });

    setAddedMsg(true);
    setTimeout(() => navigate("/cart"), 800);
  };

  // BUY NOW: add THIS item to cart (do NOT clear existing cart),
  // then go directly to address step (cart page reads ?buynow=true)
  const handleBuyNow = () => {
    if (!user) {
      navigate("/login", {
        state: { redirectTo: "/cart?buynow=true" }
      });
      return;
    }

    addToCart({
      id: product._id,
      name: product.name,
      image: product.image,
      price: product.price ?? product.priceDisplay,
    });

    navigate("/cart?buynow=true");
  };


  if (loading) return <div className="text-center py-20 text-xl text-gray-600">Loading product...</div>;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">Product Not Found</h2>
        <Link to="/" className="text-orange-600 underline mt-3 inline-block">Go Back Home</Link>
      </div>
    );
  }




  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6 md:px-12">
      {addedMsg && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-pulse z-50">
          ✓ Added to Cart
        </div>
      )}

      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-1">/</span>
        <Link to={`/category/${product.category}`} className="hover:underline capitalize">
          {product.category}
        </Link>
        <span className="mx-1">/</span>
        <span className="font-semibold">{product.name}</span>
      </nav>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md h-auto object-cover rounded-lg shadow"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-gray-600 ml-2 text-sm">
              {product.rating?.toFixed?.(1) || "0.0"}
            </span>
          </div>

          <p className="text-2xl font-semibold text-orange-600 mb-4">
            {product.priceDisplay}
          </p>

          {product.shortDesc && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDesc}</p>
          )}

          {product.longDesc && (
            <p className="text-gray-700 mb-6 whitespace-pre-line">{product.longDesc}</p>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-gray-500 mt-12">
        © 2025 Baazar. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductDetails;
