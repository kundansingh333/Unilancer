// // // backend/routes/auth.js
// // const express = require("express");
// // const router = express.Router();
// // const authController = require("../controllers/authController");
// // const auth = require("../middleware/auth");

// // // ========== PUBLIC ROUTES (No authentication required) ==========

// // /**
// //  * @route   POST /api/auth/register
// //  * @desc    Register a new user
// //  * @access  Public
// //  * @body    { email, password, name, role, college, ...role-specific fields }
// //  */
// // router.post("/register", authController.register);

// // /**
// //  * @route   POST /api/auth/login
// //  * @desc    Login user
// //  * @access  Public
// //  * @body    { email, password }
// //  * @returns { token, user }
// //  */
// // router.post("/login", authController.login);

// // /**
// //  * @route   POST /api/auth/verify-email
// //  * @desc    Verify user email with token
// //  * @access  Public
// //  * @body    { token }
// //  */
// // router.post("/verify-email", authController.verifyEmail);

// // /**
// //  * @route   POST /api/auth/forgot-password
// //  * @desc    Request password reset email
// //  * @access  Public
// //  * @body    { email }
// //  */
// // router.post("/forgot-password", authController.forgotPassword);

// // /**
// //  * @route   POST /api/auth/reset-password
// //  * @desc    Reset password with token
// //  * @access  Public
// //  * @body    { token, newPassword }
// //  */
// // router.post("/reset-password", authController.resetPassword);

// // /**
// //  * @route   POST /api/auth/resend-verification
// //  * @desc    Resend email verification link
// //  * @access  Public
// //  * @body    { email }
// //  */
// // router.post("/resend-verification", authController.resendVerification);

// // // ========== PROTECTED ROUTES (Authentication required) ==========

// // /**
// //  * @route   GET /api/auth/me
// //  * @desc    Get current logged-in user
// //  * @access  Private
// //  * @returns { user }
// //  */
// // router.get("/me", auth, authController.getCurrentUser);

// // /**
// //  * @route   POST /api/auth/logout
// //  * @desc    Logout user (handled on frontend, but can log event)
// //  * @access  Private
// //  */
// // router.post("/logout", auth, authController.logout);

// // module.exports = router;

// // backend/routes/auth.js
// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/authController");
// const auth = require("../middleware/auth");

// // ========== PUBLIC ROUTES (No authentication required) ==========

// /**
//  * @route   POST /api/auth/register
//  * @desc    Register a new user
//  * @access  Public
//  * @body    { email, password, name, role, college, ...role-specific fields }
//  */
// router.post("/register", authController.register);

// /**
//  * @route   POST /api/auth/login
//  * @desc    Login user
//  * @access  Public
//  * @body    { email, password }
//  * @returns { token, user }
//  */
// router.post("/login", authController.login);

// /**
//  * @route   POST /api/auth/verify-email
//  * @desc    Verify user email with token
//  * @access  Public
//  * @body    { token }
//  */
// router.post("/verify-email", authController.verifyEmail);

// /**
//  * ✅ NEW
//  * @route   POST /api/auth/verify-otp
//  * @desc    Verify user email using OTP code
//  * @access  Public
//  * @body    { email, otp }
//  */
// router.post("/verify-otp", authController.verifyOtp);

// /**
//  * @route   POST /api/auth/forgot-password
//  * @desc    Request password reset email
//  * @access  Public
//  * @body    { email }
//  */
// router.post("/forgot-password", authController.forgotPassword);

// /**
//  * @route   POST /api/auth/reset-password
//  * @desc    Reset password with token
//  * @access  Public
//  * @body    { token, newPassword }
//  */
// router.post("/reset-password", authController.resetPassword);

// /**
//  * @route   POST /api/auth/resend-verification
//  * @desc    Resend email verification link
//  * @access  Public
//  * @body    { email }
//  */
// router.post("/resend-verification", authController.resendVerification);

// // ========== PROTECTED ROUTES (Authentication required) ==========

// /**
//  * @route   GET /api/auth/me
//  * @desc    Get current logged-in user
//  * @access  Private
//  * @returns { user }
//  */
// router.get("/me", auth, authController.getCurrentUser);

// /**
//  * @route   POST /api/auth/logout
//  * @desc    Logout user (handled on frontend, but can log event)
//  * @access  Private
//  */
// router.post("/logout", auth, authController.logout);

// module.exports = router;

// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// ========== PUBLIC ROUTES (No authentication required) ==========

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { email, password, name, role, college, ...role-specific fields }
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    { email, password }
 * @returns { token, user }
 */
router.post("/login", authController.login);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email with token (link-based)
 * @access  Public
 * @body    { token }
 */
router.post("/verify-email", authController.verifyEmail);

/**
 * ✅ NEW OTP ROUTE
 * @route   POST /api/auth/verify-email-otp
 * @desc    Verify user email using OTP code
 * @access  Public
 * @body    { email, otp }
 */
router.post("/verify-email-otp", authController.verifyOtp);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 * @body    { email }
 */
router.post("/resend-verification-otp", authController.resendEmailOtp);
router.post("/forgot-password", authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 * @body    { token, newPassword }
 */
router.post("/reset-password", authController.resetPassword);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification link
 * @access  Public
 * @body    { email }
 */
router.post("/resend-verification", authController.resendVerification);

// ✅ NEW: FORGOT PASSWORD via OTP
/**
 * @route   POST /api/auth/forgot-password-otp
 * @desc    Send password reset OTP to email
 * @access  Public
 * @body    { email }
 */
router.post("/forgot-password-otp", authController.forgotPasswordOtp);

// ✅ NEW: RESET PASSWORD via OTP
/**
 * @route   POST /api/auth/reset-password-otp
 * @desc    Reset password using email + OTP
 * @access  Public
 * @body    { email, otp, newPassword }
 */
router.post("/reset-password-otp", authController.resetPasswordOtp);

// ========== PROTECTED ROUTES (Authentication required) ==========

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 * @returns { user }
 */
router.get("/me", auth, authController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (handled on frontend, but can log event)
 * @access  Private
 */
router.post("/logout", auth, authController.logout);

module.exports = router;
