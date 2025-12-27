// src/pages/CategoryPage.jsx
import React, { useMemo, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const toTitle = (s = "") =>
  s
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

const CategoryPage = () => {
  const { slug } = useParams();

  // state for fetched items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch category products from backend on slug change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_ROOT = import.meta.env.VITE_API_URL || '';
        const res = await axios.get(
          `${API_ROOT}/api/products/category/${slug}`
        );
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="category-page bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* Breadcrumb / Title */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold">{toTitle(slug)}</span>
          </nav>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{toTitle(slug)}</h1>
            <div className="text-sm text-gray-600">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-700">
            {items.length > 0
              ? items[0].shortDesc || ""
              : "Browse items in this category."}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 hidden sm:inline">
              Sort by:
            </label>
            <select
              className="px-3 py-1 rounded-md border text-sm"
              defaultValue="featured"
              onChange={() => {}}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-600">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="max-w-md mx-auto">
                We couldn't find any products in this category. You can return
                to{" "}
                <Link to="/" className="text-orange-600 hover:underline">
                  home
                </Link>{" "}
                or try another category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
