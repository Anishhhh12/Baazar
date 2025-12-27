import React, { useState } from "react";
import apiFetch from "../services/api";

const API_ROOT = import.meta.env.VITE_API_URL || "";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: form,
      });
      setMsg(res.message || "Signup successful — check email to verify");
    } catch (error) {
      const message =
        error?.message ||
        (Array.isArray(error?.errors)
          ? error.errors.map((x) => x.msg).join(", ")
          : "Signup failed");
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create your account
        </h2>

        {msg && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
            {msg}
          </div>
        )}

        {err && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="my-6 text-center text-sm text-gray-500">OR</div>

        <a href={`${API_ROOT}/api/auth/google`}>
          <button
            type="button"
            className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
          >
            Continue with Google
          </button>
        </a>
      </div>
    </div>
  );
}
