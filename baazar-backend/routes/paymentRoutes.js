// backend: routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config(); // MUST BE FIRST!!!

const router = express.Router();

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// create order (frontend will POST { amount: <rupees number> })
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees (e.g. 79999)
    if (!amount || isNaN(amount)) return res.status(400).json({ message: "Invalid amount" });

    const amountPaise = Math.round(Number(amount) * 100); // paise
    const options = {
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razor.orders.create(options);
    // order.amount is in paise
    res.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("create-order error", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// verify payment (frontend will POST the razorpay response object)
router.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.error("verify-payment error", err);
    res.status(500).json({ success: false });
  }
});

export default router;
