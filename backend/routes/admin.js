const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

// All admin routes require authentication and admin role
const adminAuth = [auth, roleAuth("admin")];

// ========== DASHBOARD & ANALYTICS ==========

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get("/stats", adminAuth, adminController.getDashboardStats);

/**
 * @route   GET /api/admin/user-growth
 * @desc    Get user growth analytics
 * @access  Admin
 * @query   period (days, default: 30)
 */
router.get("/user-growth", adminAuth, adminController.getUserGrowth);

/**
 * @route   GET /api/admin/revenue
 * @desc    Get revenue analytics
 * @access  Admin
 * @query   period (days, default: 30)
 */
router.get("/revenue", adminAuth, adminController.getRevenueAnalytics);

// ========== USER MANAGEMENT ==========

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filters
 * @access  Admin
 * @query   page, limit, role, isApproved, isBlocked, search
 */
router.get("/users", adminAuth, adminController.getAllUsers);

/**
 * @route   GET /api/admin/users/pending
 * @desc    Get users pending approval
 * @access  Admin
 */
router.get("/users/pending", adminAuth, adminController.getPendingApprovals);

/**
 * @route   PUT /api/admin/users/:id/approve
 * @desc    Approve a user
 * @access  Admin
 */
router.put("/users/:id/approve", adminAuth, adminController.approveUser);

/**
 * @route   PUT /api/admin/users/:id/reject
 * @desc    Reject a user
 * @access  Admin
 * @body    { reason }
 */
router.put("/users/:id/reject", adminAuth, adminController.rejectUser);

/**
 * @route   PUT /api/admin/users/:id/block
 * @desc    Block/Unblock a user
 * @access  Admin
 */
router.put("/users/:id/block", adminAuth, adminController.toggleBlockUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Admin
 */
router.delete("/users/:id", adminAuth, adminController.deleteUser);

// ========== CONTENT MODERATION ==========

/**
 * @route   GET /api/admin/jobs/pending
 * @desc    Get jobs pending approval
 * @access  Admin
 */
router.get("/jobs/pending", adminAuth, adminController.getPendingJobs);

/**
 * @route   PUT /api/admin/jobs/:id/approve
 * @desc    Approve a job
 * @access  Admin
 */
router.put("/jobs/:id/approve", adminAuth, adminController.approveJob);

/**
 * @route   PUT /api/admin/jobs/:id/reject
 * @desc    Reject a job
 * @access  Admin
 * @body    { reason }
 */
router.put("/jobs/:id/reject", adminAuth, adminController.rejectJob);

/**
 * @route   GET /api/admin/events/pending
 * @desc    Get events pending approval
 * @access  Admin
 */
router.get("/events/pending", adminAuth, adminController.getPendingEvents);

/**
 * @route   PUT /api/admin/events/:id/approve
 * @desc    Approve an event
 * @access  Admin
 */
router.put("/events/:id/approve", adminAuth, adminController.approveEvent);

/**
 * @route   GET /api/admin/gigs/pending
 * @desc    Get gigs pending approval
 * @access  Admin
 */
router.get("/gigs/pending", adminAuth, adminController.getPendingGigs);

/**
 * @route   PUT /api/admin/gigs/:id/approve
 * @desc    Approve a gig
 * @access  Admin
 */
router.put("/gigs/:id/approve", adminAuth, adminController.approveGig);

// ========== FEATURED CONTENT ==========

/**
 * @route   PUT /api/admin/gigs/:id/feature
 * @desc    Feature/Unfeature a gig
 * @access  Admin
 * @body    { isFeatured: true/false }
 */
router.put("/gigs/:id/feature", adminAuth, adminController.featureGig);

/**
 * @route   PUT /api/admin/events/:id/feature
 * @desc    Feature/Unfeature an event
 * @access  Admin
 * @body    { isFeatured: true/false }
 */
router.put("/events/:id/feature", adminAuth, adminController.featureEvent);

// ========== SYSTEM MANAGEMENT ==========

/**
 * @route   POST /api/admin/announcement
 * @desc    Send system announcement
 * @access  Admin
 * @body    { title, message, targetRoles[], priority }
 */
router.post("/announcement", adminAuth, adminController.sendAnnouncement);

module.exports = router;
