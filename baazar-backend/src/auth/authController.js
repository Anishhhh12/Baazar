import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "./User.js";
import sendEmail from "./email.js";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL =
  process.env.BACKEND_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

/* ============================================================
   TOKEN + COOKIE HELPERS
============================================================ */

export function signToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

const getCookieOptions = () => ({
  httpOnly: true,
  secure: true,           // 🔥 REQUIRED for HTTPS (Render is HTTPS)
  sameSite: "none",       // 🔥 REQUIRED for cross-site (Vercel ↔ Render)
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

function setTokenCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
}

/* ============================================================
   SIGNUP
============================================================ */

export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const user = new User({ name, email, password });
    const token = user.generateVerificationToken();
    await user.save();

    const verifyLink = `${BACKEND_URL}/api/auth/verify/${token}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Hi ${user.name},</p>
               <p>Please verify your email by clicking 
               <a href="${verifyLink}">this link</a></p>`,
      });
    } catch (err) {
      console.warn("Email send failed:", err.message);
    }

    return res.json({
      message: "Signup successful — check email to verify",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   LOGIN
============================================================ */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.googleId && !user.password) {
      return res.status(400).json({
        message:
          "This account uses Google login. Please use 'Login with Google'.",
        useGoogle: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    setTokenCookie(res, token);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   GOOGLE CALLBACK (🔥 FIXED)
============================================================ */

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(
        `${FRONTEND_URL}/login?error=google`
      );
    }

    const token = signToken(user);

    // 🔥 CORRECT COOKIE SETTINGS FOR PRODUCTION
    setTokenCookie(res, token);

    return res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error("Google callback error:", err);
    return res.redirect(
      `${FRONTEND_URL}/login?error=google`
    );
  }
};

/* ============================================================
   ME
============================================================ */

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(401).json({ message: "Not authenticated" });

    return res.json({ user: user.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   LOGOUT
============================================================ */

export const logout = async (req, res) => {
  try {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
