// controllers/supportController.js
import SupportMessage from "../models/SupportMessage.js";

export const submitSupportMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await SupportMessage.create({ name, email, message });

    res.status(200).json({ success: true, message: "Message received" });
  } catch (err) {
    console.error("Support Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
