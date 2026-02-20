// src/pages/ContactSupport.jsx
import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MessageCircle } from "lucide-react";

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/api/support", formData);

      alert("Your message has been sent successfully!");

      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 flex items-center gap-2">
        <MessageCircle className="w-7 h-7" /> Contact & Support
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Get in Touch
          </h3>
          <p className="text-gray-600">We're here to help you 24/7!</p>
          <p className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5 text-indigo-600" /> support@shopmate.com
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <Phone className="w-5 h-5 text-indigo-600" /> +91 98765 43210
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
        >
          <label className="block mb-3">
            <span className="text-gray-700 font-medium">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 h-24"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-transform ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSupport;

