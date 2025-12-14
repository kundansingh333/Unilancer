const express = require("express");
const router2 = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// ========== PUBLIC ROUTES ==========

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile by ID
 * @access  Public
 */
router2.get("/:id", userController.getUserProfile);

/**
 * @route   GET /api/users/:id/activity
 * @desc    Get user activity timeline
 * @access  Public
 */
router2.get("/:id/activity", userController.getUserActivity);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Get user statistics
 * @access  Public
 */
router2.get("/:id/stats", userController.getUserStats);

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Public
 * @query   query, role, branch, company, skills, page, limit
 */
router2.get("/search/all", userController.searchUsers);

/**
 * @route   GET /api/users/alumni/directory
 * @desc    Get alumni directory
 * @access  Public
 * @query   company, domain, yearOfPassing, page, limit
 */
router2.get("/alumni/directory", userController.getAlumniDirectory);

/**
 * @route   GET /api/users/freelancers/top
 * @desc    Get top freelancers
 * @access  Public
 * @query   limit, category
 */
router2.get("/freelancers/top", userController.getTopFreelancers);

// ========== PROTECTED ROUTES ==========

/**
 * @route   PUT /api/users/profile
 * @desc    Update own profile
 * @access  Private
 * @body    { name, bio, skills, ... }
 */
router2.put("/profile", auth, userController.updateUserProfile);

module.exports = router2;
