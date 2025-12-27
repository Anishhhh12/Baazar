// src/pages/Help.jsx
import React from "react";
import { HelpCircle } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      q: "How can I track my order?",
      a: "You can track your order in the 'My Orders' section after logging in. We'll also send updates via email/SMS.",
    },
    {
      q: "What is the return policy?",
      a: "You can return most items within 7 days of delivery if they are unused and in original packaging.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit/debit cards, UPI, and wallets like Paytm & Google Pay.",
    },
    {
      q: "Is my payment information secure?",
      a: "Absolutely. We use SSL encryption to protect your details and do not store any card information.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 flex items-center gap-2">
        <HelpCircle className="w-7 h-7" /> Help & FAQs
      </h1>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">{faq.q}</h3>
            <p className="text-gray-600 mt-2">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
