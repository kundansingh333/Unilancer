// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// ========== ALL ROUTES REQUIRE AUTHENTICATION ==========

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications
 * @access  Private
 * @query   page, limit, unreadOnly, type, priority
 */
router.get("/", auth, notificationController.getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notifications count
 * @access  Private
 * @query   type (optional)
 */
router.get("/unread-count", auth, notificationController.getUnreadCount);

/**
 * @route   GET /api/notifications/stats
 * @desc    Get notification statistics
 * @access  Private
 */
router.get("/stats", auth, notificationController.getStats);

/**
 * @route   GET /api/notifications/urgent
 * @desc    Get urgent unread notifications
 * @access  Private
 */
router.get("/urgent", auth, notificationController.getUrgentNotifications);

/**
 * @route   GET /api/notifications/preferences
 * @desc    Get notification preferences
 * @access  Private
 */
router.get("/preferences", auth, notificationController.getPreferences);

/**
 * @route   PUT /api/notifications/preferences
 * @desc    Update notification preferences
 * @access  Private
 * @body    { preferences: {...} }
 */
router.put("/preferences", auth, notificationController.updatePreferences);

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 * @query   type (optional)
 */
router.put("/mark-all-read", auth, notificationController.markAllAsRead);

/**
 * @route   DELETE /api/notifications/read
 * @desc    Delete all read notifications
 * @access  Private
 */
router.delete("/read", auth, notificationController.deleteAllRead);

/**
 * @route   GET /api/notifications/type/:type
 * @desc    Get notifications by type
 * @access  Private
 * @query   page, limit
 */
router.get("/type/:type", auth, notificationController.getNotificationsByType);

/**
 * @route   GET /api/notifications/group/:groupKey
 * @desc    Get grouped notifications
 * @access  Private
 */
router.get(
  "/group/:groupKey",
  auth,
  notificationController.getGroupedNotifications
);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get single notification (implicit in frontend)
 * @access  Private
 */
// Not needed as notifications are fetched in bulk

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put("/:id/read", auth, notificationController.markAsRead);

/**
 * @route   PUT /api/notifications/:id/action
 * @desc    Mark action as taken
 * @access  Private
 */
router.put("/:id/action", auth, notificationController.markActionTaken);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete("/:id", auth, notificationController.deleteNotification);

/**
 * @route   POST /api/notifications/test
 * @desc    Send test notification (development only)
 * @access  Private
 * @body    { type, title, message }
 */
router.post("/test", auth, notificationController.sendTestNotification);

module.exports = router;
