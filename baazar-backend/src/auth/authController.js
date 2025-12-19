// src/auth/authController.js
import dotenv from 'dotenv';
dotenv.config();
import crypto from "crypto"; // make sure this import exists at top
import bcrypt from "bcryptjs";



import User from './User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import sendEmail from './email.js';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'token';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;


// Add this export
export function signToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Create a helper function for cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: '/',
});

// Update setTokenCookie function
function setTokenCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
}



export const signup = async (req, res) => {
  console.log("SIGNUP BODY:", req.body);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ name, email, password });
    const token = user.generateVerificationToken();
    await user.save();

    // Log verify link (useful when SMTP not configured)
    const verifyLink = `${BACKEND_URL}/api/auth/verify/${token}`;
    console.log('Verify link:', verifyLink);

    // send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Hi ${user.name},</p>
             <p>Please verify your email by clicking <a href="${verifyLink}">this link</a></p>`
      });
    } catch (mailErr) {
      console.warn('Warning: sending email failed:', mailErr.message);
    }

    return res.json({ message: 'Signup successful — check email to verify' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const verifyEmail = async (req, res) => {
  try {
    const rawToken = req.params.token;

    // 🔑 HASH THE TOKEN AGAIN
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired verification link");
    }

    // ✅ VERIFY USER
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    // optional: auto login after verify
    const jwtToken = signToken(user);
    setTokenCookie(res, jwtToken);

    // redirect to frontend success page
    return res.send(`
      <html>
        <head>
          <title>Email Verified</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            body {
              font-family: Arial;
              display: flex;
              height: 100vh;
              justify-content: center;
              align-items: center;
              background: #f4f4f4;
            }
            .card {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 10px 25px rgba(0,0,0,.1);
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>✅ Email Verified</h2>
            <p>Your email has been successfully verified.</p>
            <p>You can now return to the app.</p>
          </div>
        </body>
      </html>
    `);

  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).send("Server error");
  }
};






// src/auth/authController.js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user registered via Google (has googleId but no password)
    if (user.googleId && !user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please use 'Login with Google' instead.",
        useGoogle: true, // Flag for frontend to show Google button
      });
    }

    // Regular password check for non-Google users
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = signToken(user);
    setTokenCookie(res, token);

    // Send user info (without password)
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ 
      user: userResponse,
      message: "Login successful" 
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// src/auth/authController.js
export const linkGoogleAccount = async (req, res) => {
  try {
    const userId = req.userId; // From JWT middleware
    const { googleToken } = req.body;

    // Verify Google token on backend
    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`
    );
    const googleData = await googleResponse.json();

    if (!googleData.email_verified) {
      return res.status(400).json({ message: "Google email not verified" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if Google account already linked to another user
    const existingGoogleUser = await User.findOne({ 
      googleId: googleData.sub 
    });
    
    if (existingGoogleUser && existingGoogleUser._id.toString() !== userId) {
      return res.status(400).json({ 
        message: "Google account already linked to another user" 
      });
    }

    // Link Google account
    user.googleId = googleData.sub;
    user.isVerified = true;
    await user.save();

    res.json({ 
      message: "Google account linked successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId
      }
    });

  } catch (err) {
    console.error("Link Google error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Add this new function for Google callback
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google`
      );
    }

    // ✅ CREATE NORMAL JWT (same as normal login)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ SET COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true only in prod HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // ✅ REDIRECT TO LANDING PAGE
    return res.redirect(process.env.FRONTEND_URL); // http://localhost:5173
  } catch (err) {
    console.error("Google callback error:", err);
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=google`
    );
  }
};


export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Not authenticated' });
    return res.json({ user: user.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // For privacy, always respond success
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent' });

    const token = user.generatePasswordReset();
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset/${token}`;
    console.log('Reset link:', resetLink);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password reset',
        html: `<p>Hi ${user.name},</p>
               <p>You can reset your password by clicking <a href="${resetLink}">this link</a>. This link expires in 1 hour.</p>`
      });
    } catch (mailErr) {
      console.warn('Warning: sending reset email failed:', mailErr.message);
    }

    return res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    const jwtToken = signToken(user);
    setTokenCookie(res, jwtToken);

    return res.json({ message: 'Password has been reset' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const logout = async (req, res) => {
  try {
    // Clear all auth cookies
    const cookiesToClear = ['token', 'login_method'];
    
    cookiesToClear.forEach(cookieName => {
      res.clearCookie(cookieName, {
        path: '/',
        httpOnly: cookieName === 'token',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
    });

    // If user was logged in, update last login method
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        $unset: { lastLoginMethod: 1 }
      });
    }

    // Send response with logout info
    res.json({ 
      message: 'Logged out successfully',
      logoutType: 'local' // 'local' means only from our app
    });
    
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
