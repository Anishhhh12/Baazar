// routes/supportRoutes.js
import express from "express";
import { submitSupportMessage } from "../controllers/supportController.js";

const router = express.Router();

// POST → /api/support
router.post("/", submitSupportMessage);

export default router;
