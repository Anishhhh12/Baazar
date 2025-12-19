// models/User.js
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // Password is NOT required for Google users
      // But required for regular signup
      required: function() {
        return !this.googleId;
      },
    },

    googleId: {
      type: String,
      sparse: true, // Allows null values but still unique
      unique: true,
      default: null,
    },

    isSeller: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // NEW: Track if user has completed onboarding (for Google users)
    onboardingComplete: {
      type: Boolean,
      default: function() {
        // Regular signup users complete onboarding immediately
        // Google users need to complete setup
        return !this.googleId;
      }
    },

    // NEW: Track if Google user needs to set password
    requiresPasswordSetup: {
      type: Boolean,
      default: function() {
        // Google users might want to set password for app login
        return !!this.googleId;
      }
    },

    // 🔑 Email verification
    verificationToken: String,
    verificationTokenExpiry: Date,

    // 🔑 Password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date, // Fixed: Changed from Expiry to Expires
  },
  {
    timestamps: true,
  }
);

/* =======================
   PASSWORD HASHING
======================= */
userSchema.pre("save", async function (next) {
  // Only hash password if:
  // 1. It's a password field (not Google user)
  // 2. Password is actually modified
  // 3. User is not a Google-only user
  if (!this.password || this.googleId || !this.isModified("password")) {
    return next();
  }
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

/* =======================
   COMPARE PASSWORD
======================= */
userSchema.methods.comparePassword = async function (enteredPassword) {
  // If user doesn't have a password (Google-only user)
  if (!this.password) {
    return false;
  }
  
  return await bcrypt.compare(enteredPassword, this.password);
};

/* =======================
   EMAIL VERIFICATION TOKEN
======================= */
userSchema.methods.generateVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return rawToken;
};

/* =======================
   PASSWORD RESET TOKEN
======================= */
userSchema.methods.generateResetPasswordToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  return rawToken;
};

/* =======================
   HELPER METHODS
======================= */

// Check if user can login with password
userSchema.methods.canLoginWithPassword = function() {
  return !this.googleId && this.password;
};

// Check if user can login with Google
userSchema.methods.canLoginWithGoogle = function() {
  return !!this.googleId;
};

// Get safe user object for response (remove sensitive data)
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.verificationTokenExpiry;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  
  return userObject;
};

// Complete onboarding for Google users
userSchema.methods.completeOnboarding = async function(password = null) {
  if (password) {
    this.password = password;
    this.requiresPasswordSetup = false;
  }
  
  this.onboardingComplete = true;
  return await this.save();
};

const User = mongoose.model("User", userSchema);
export default User;