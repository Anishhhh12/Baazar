import Razorpay from "razorpay";
import crypto from "crypto";

// -----------------------------
// CREATE ORDER
// -----------------------------
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Razorpay Order Options
    const options = {
      amount: Math.round(amount * 100), // convert rupees → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {
    console.error("🔥 Razorpay Order Error:", error);
    return res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};

// -----------------------------
// VERIFY PAYMENT
// -----------------------------
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error("🔥 Payment Verification Error:", error);
    return res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};
