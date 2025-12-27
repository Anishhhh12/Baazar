import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiFetch from "../services/api";
import { useUser } from "../context/UserContext";

const API_ROOT = import.meta.env.VITE_API_URL || "";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Read query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error === "google") {
      setErr("Google login failed. Please try again.");
    }

    if (error === "email_required") {
      setErr("Google account must have an email address.");
    }
  }, [location.search]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: form,
    });

setUser(res.user); // ✅ TRUST LOGIN RESPONSE


      // 🔹 Support redirect from state OR query
      const params = new URLSearchParams(location.search);
      const redirectQuery = params.get("redirect");
      const redirectState = location.state?.redirectTo;

      navigate(redirectState || redirectQuery || "/");
    } catch (error) {
      setErr(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Baazar
        </h2>

        {err && (
          <div className="mb-4 rounded-md bg-red-100 text-red-700 px-4 py-2 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t" />
          <span className="mx-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t" />
        </div>

        {/* ✅ GOOGLE LOGIN — MUST BE NORMAL REDIRECT */}
        <a href={`${API_ROOT}/api/auth/google`}>
          <button
            type="button"
            className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition font-medium"
          >
            Continue with Google
          </button>
        </a>

        <div className="mt-4 text-center text-sm">
          <a href="/forgot" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
