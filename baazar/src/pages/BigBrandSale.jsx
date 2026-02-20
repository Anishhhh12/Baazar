import React, { useEffect, useState } from "react";
import { Tag, ShoppingBag, Percent } from "lucide-react";
import axios from "axios";

const BigBrandSale = () => {
  const [bigBrandItems, setBigBrandItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from backend instead of static products.js
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(
  "/api/products/category/big-brand-sale"
);
        setBigBrandItems(res.data);
      } catch (err) {
        console.error("Error fetching Big Brand Sale items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading offers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      {/* Banner Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-pink-700 flex justify-center items-center gap-2">
          <Tag className="text-pink-600" /> Big Brand Sale
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          🎉 Enjoy Up to{" "}
          <span className="font-semibold text-pink-700">70% OFF</span> on your
          favorite brands!
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {bigBrandItems.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 p-4"
          >
            <img
              src={offer.image}
              alt={offer.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {offer.name}
            </h2>

            <p className="text-gray-600 text-sm mb-3">
              {offer.shortDesc || "Top brand product offer!"}
            </p>

            <span className="inline-block bg-pink-100 text-pink-700 text-sm font-semibold px-3 py-1 rounded-full">
              {offer.priceDisplay}
            </span>

            <button className="mt-4 w-full bg-pink-600 text-white py-2 rounded-xl flex justify-center items-center gap-2 hover:bg-pink-700 transition">
              <ShoppingBag size={18} /> Grab Now
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-600 text-sm">
        <Percent className="inline mr-1" size={16} />
        Limited Time Offer – Hurry Before It’s Gone!
      </div>
    </div>
  );
};

export default BigBrandSale;

