// src/pages/Suggestions.jsx
import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import axios from "axios";

const Suggestions = () => {
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/support/suggestion", {
        suggestion,
      });

      setSubmitted(true);
      setSuggestion("");

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      alert("Failed to send suggestion. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-10">
      <h1 className="text-3xl font-bold text-yellow-700 mb-8 flex items-center gap-2">
        <Lightbulb className="w-7 h-7" /> Suggestions & Feedback
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto border border-gray-100"
      >
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">
            Share your ideas or feedback
          </span>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className="mt-2 w-full border border-gray-300 rounded-lg p-3 h-32"
            placeholder="We’d love to hear how we can improve!"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-transform"
        >
          Submit
        </button>

        {submitted && (
          <p className="text-green-600 font-medium mt-4">
            ✅ Thank you for your feedback!
          </p>
        )}
      </form>
    </div>
  );
};

export default Suggestions;

