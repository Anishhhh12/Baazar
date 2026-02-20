// src/auth/routes.js
import express from 'express';
import { body } from 'express-validator';
import * as controller from './authController.js';
import { requireAuth } from './authMiddleware.js';
import passport from 'passport';
import './Passport.js'; // initialize passport strategy
import { googleCallback } from "./authController.js";


const router = express.Router();

// Signup
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  controller.signup
);

// Email verification
router.get('/verify/:token', controller.verifyEmail);

// Login
// src/auth/routes.js
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], controller.login);

router.post('/link-google', requireAuth, controller.linkGoogleAccount);

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account' // 🔥 FORCE ACCOUNT SELECTION
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`,
    session: false // Important: disable sessions
  }),
  controller.googleCallback // Use the controller function
);

// Me
router.get('/me', requireAuth, controller.me);

// Forgot password
router.post('/forgot', [body('email').isEmail().withMessage('Invalid email')], controller.forgotPassword);

// Reset password
router.post('/reset/:token', [body('password').isLength({ min: 6 })], controller.resetPassword);







// Logout
router.post('/logout', controller.logout);

export default router;
