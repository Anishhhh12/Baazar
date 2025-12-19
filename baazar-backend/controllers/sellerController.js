// controllers/sellerController.js
import Seller from "../models/seller.js";

/**
 * POST /api/sellers/register
 * Accepts multipart/form-data:
 *  - fields: name, email, phone, businessName, pan, gstin, entityType, bankAccount, ifsc, sellerId (optional)
 *  - files: aadhaar, addressProof, cheque
 */
export const registerSeller = async (req, res) => {
  try {
    const {
      name, email, phone, businessName, pan, gstin,
      entityType, bankAccount, ifsc, sellerId: providedId
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // unique email check
    const existing = await Seller.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // generate sellerId if not provided
    const sellerId = providedId || `BAZ-${Date.now().toString().slice(-8)}`;

    const newSeller = new Seller({
      sellerId,
      name,
      email,
      phone,
      businessName,
      pan,
      gstin,
      entityType,
      bankAccount,
      ifsc,
    });

    // Attach uploaded file paths (multer stores files in req.files)
    if (req.files) {
      if (req.files.aadhaar && req.files.aadhaar[0]) {
        newSeller.aadhaarPath = req.files.aadhaar[0].path;
      }
      if (req.files.addressProof && req.files.addressProof[0]) {
        newSeller.addressProofPath = req.files.addressProof[0].path;
      }
      if (req.files.cheque && req.files.cheque[0]) {
        newSeller.chequePath = req.files.cheque[0].path;
      }
    }

    await newSeller.save();

    return res.status(201).json({
      message: "Seller registered",
      sellerId: newSeller.sellerId,
      seller: {
        id: newSeller._id,
        sellerId: newSeller.sellerId,
        name: newSeller.name,
        email: newSeller.email,
        status: newSeller.status,
      },
    });
  } catch (err) {
    console.error("registerSeller error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /api/sellers/:sellerId
 * returns seller profile by sellerId
 */
export const getSellerById = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await Seller.findOne({ sellerId }).select("-__v");
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (err) {
    console.error("getSellerById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
