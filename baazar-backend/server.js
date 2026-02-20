// server.js (ESM) — FIXED & COMPLETE
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import passport from "passport";
import "./src/auth/Passport.js"; // ensure passport strategies are loaded 

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// =======================
// ROUTES IMPORT
// =======================
import authRoutes from "./src/auth/Routes.js";     // ✅ AUTH (MISSING BEFORE)
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import visualSearchRoutes from "./routes/visualSearchRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";





console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

// =======================
// APP SETUP
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// CORS CONFIG
// =======================
const rawFrontends = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "";
const whitelist = rawFrontends
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// fallback for dev
if (whitelist.length === 0) {
  whitelist.push("http://localhost:5173", "http://localhost:3000");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);
  next();
});

// =======================
// BODY + COOKIES
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(passport.initialize());


// =======================
// STATIC FILES
// =======================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// =======================
// START SERVER AFTER DB
// =======================
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }

  // =======================
  // ROUTES MOUNT
  // =======================
  app.use("/api/auth", authRoutes);          // ✅ FIXED
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/support", supportRoutes);
  app.use("/api/sellers", sellerRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/visual-search", visualSearchRoutes);
  app.use("/api/search", searchRoutes);


  // =======================
  // TEST / HEALTH
  // =======================
  app.get("/", (req, res) => res.send("Baazar Backend OK"));
  app.get("/api/ping", (req, res) =>
    res.json({ ok: true, message: "Backend is running" })
  );

  // =======================
  // LISTEN
  // =======================
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})();
