import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    shortDesc: "",
  });

  // TEMPORARY seller ID (later we will use JWT)
  const sellerId = "BAZ-SELLER-9999";

  // Load seller's products from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/mine", {
        headers: { "x-seller-id": sellerId },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add new product (POST)
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        { ...formData, sellerId },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update UI instantly
      setProducts([...products, res.data]);

      // Clear form
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: "",
        shortDesc: "",
      });
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <p className="text-lg text-gray-700 mb-4">
        Welcome! Your Seller ID:{" "}
        <span className="font-mono text-blue-600">{sellerId}</span>
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold">₹1,25,000</h2>
          <p className="text-gray-500">Total Sales</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold">₹12,500</h2>
          <p className="text-gray-500">Commission Paid</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold">₹1,12,500</h2>
          <p className="text-gray-500">Net Earnings</p>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>

        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="shortDesc"
            placeholder="Short Description"
            value={formData.shortDesc}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="border p-2">{p._id}</td>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.category}</td>
                  <td className="border p-2">₹{p.price}</td>
                  <td className="border p-2">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
