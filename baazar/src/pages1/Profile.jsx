// src/pages/Profile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  // Safety: if user is not logged in
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user.name || "User"}
          </h2>

          <p className="text-sm text-gray-500">
            Welcome to your profile
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t" />

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Email:</span>
            <span className="ml-auto text-gray-600">
              {user.email}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Name:</span>
            <span className="ml-auto text-gray-600">
              {user.name || "Not provided"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Account:</span>
            <span className="ml-auto text-green-600 font-semibold">
              Active
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => alert("Edit profile coming soon")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
