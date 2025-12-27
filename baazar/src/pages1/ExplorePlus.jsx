// src/pages/ExplorePlus.jsx
import React, { useState } from "react";
import { Star, Truck, Tag, Headphones, Wallet } from "lucide-react";

const ExplorePlus = () => {
  const [coins, setCoins] = useState(250);
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Earned", desc: "Order #1234 - Electronics", coins: +50, date: "12 Sep 2025" },
    { id: 2, type: "Spent", desc: "Redeemed Voucher", coins: -40, date: "10 Sep 2025" },
    { id: 3, type: "Earned", desc: "Order #1187 - Fashion", coins: +20, date: "08 Sep 2025" },
    { id: 4, type: "Earned", desc: "Order #1102 - Groceries", coins: +30, date: "05 Sep 2025" },
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-teal-600 text-white py-10 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Star className="text-teal-300" size={40} /> Explore{" "}
            <span className="text-teal-300">Plus</span>
          </h1>
          <p className="mt-3 text-lg text-gray-200">
            Enjoy premium shopping benefits with Baazar Plus 🚀
          </p>
          <button className="mt-5 px-6 py-3 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-500 transition">
            Join Plus for Free
          </button>
        </div>
        <img
          src="https://rukminim2.flixcart.com/flap/850/400/image/09de9b7a389c6385.jpg"
          alt="Explore Plus Banner"
          className="mt-6 md:mt-0 w-72 rounded-xl shadow-lg"
        />
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto mt-10 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Plus Membership Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition">
            <Truck className="text-purple-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold">Free & Fast Delivery</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Unlimited free deliveries on eligible products.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition">
            <Tag className="text-purple-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold">Exclusive Deals</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Get early access to sales and special offers.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition">
            <Star className="text-purple-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold">Reward Points</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Earn SuperCoins on every order and redeem exciting rewards.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition">
            <Headphones className="text-purple-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold">Priority Support</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Dedicated 24/7 support for all Plus members.
            </p>
          </div>
        </div>
      </div>

      {/* Coins Balance */}
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Wallet className="text-teal-500" size={40} />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Your SuperCoins
              </h3>
              <p className="text-gray-500 text-sm">Balance</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-teal-500">{coins}</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="max-w-6xl mx-auto mt-8 px-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Transactions
        </h2>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Coins</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b last:border-none">
                  <td className="px-6 py-3">{tx.date}</td>
                  <td className="px-6 py-3">{tx.desc}</td>
                  <td className="px-6 py-3">{tx.type}</td>
                  <td
                    className={`px-6 py-3 text-right font-semibold ${
                      tx.coins > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {tx.coins > 0 ? `+${tx.coins}` : tx.coins}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-purple-50 mt-12 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Become a Baazar Plus Member Today ✨
        </h2>
        <p className="text-gray-600 mt-2">
          Unlock free deliveries, exclusive rewards, and much more!
        </p>
        <button className="mt-5 px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition">
          Join Now
        </button>
      </div>
    </div>
  );
};

export default ExplorePlus;
