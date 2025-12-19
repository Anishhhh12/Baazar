// src/hooks/useProducts.js
import products from "../data/products";

export const getProductsByCategory = (categorySlug) => {
  return products.filter(
    (p) => (p.category || "").toLowerCase() === (categorySlug || "").toLowerCase()
  );
};

export const getProductById = (idOrSlug) => {
  return products.find(
    (p) => String(p.id) === String(idOrSlug) || (p.slug && p.slug === idOrSlug)
  );
};

export default {
  getProductsByCategory,
  getProductById,
};
