// controllers/userController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/users/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, isSeller } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash, isSeller: !!isSeller });
    const token = generateToken(user);
    res.status(201).json({ id: user._id, name: user.name, email: user.email, isSeller: user.isSeller, token });
  } catch (err) { next(err); }
};

// POST /api/users/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ id: user._id, name: user.name, email: user.email, isSeller: user.isSeller, token });
  } catch (err) { next(err); }
};

// GET /api/users/profile (protected)
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ id: user._id, name: user.name, email: user.email, isSeller: user.isSeller });
  } catch (err) { next(err); }
};
