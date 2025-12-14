// backend/controllers/notificationController.js
const Notification = require("../models/Notification");
const User = require("../models/User");

// ========== 1. GET ALL NOTIFICATIONS ==========
exports.getNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type = null,
      priority = null,
    } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await Notification.getForUser(req.userId, {
      limit: Number(limit),
      skip: skip,
      unreadOnly: unreadOnly === "true",
      type: type,
      priority: priority,
    });

    const total = await Notification.countDocuments({
      userId: req.userId,
      ...(unreadOnly === "true" && { isRead: false }),
      ...(type && { type }),
      ...(priority && { priority }),
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasMore: skip + notifications.length < total,
      },
    });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch notifications",
    });
  }
};

// ========== 2. GET UNREAD COUNT ==========
exports.getUnreadCount = async (req, res) => {
  try {
    const { type } = req.query;

    const count = await Notification.getUnreadCount(req.userId, type);

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (err) {
    console.error("Get unread count error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to get unread count",
    });
  }
};

// ========== 3. GET NOTIFICATION STATISTICS ==========
exports.getStats = async (req, res) => {
  try {
    const stats = await Notification.getStats(req.userId);

    res.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to get statistics",
    });
  }
};

// ========== 4. MARK NOTIFICATION AS READ ==========
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check authorization
    if (notification.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to mark notification as read",
    });
  }
};

// ========== 5. MARK ALL AS READ ==========
exports.markAllAsRead = async (req, res) => {
  try {
    const { type } = req.query;

    await Notification.markAllAsRead(req.userId, type);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("Mark all as read error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to mark all as read",
    });
  }
};

// ========== 6. DELETE NOTIFICATION ==========
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check authorization
    if (notification.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    await Notification.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete notification",
    });
  }
};

// ========== 7. DELETE ALL READ NOTIFICATIONS ==========
exports.deleteAllRead = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      userId: req.userId,
      isRead: true,
    });

    res.json({
      success: true,
      message: "All read notifications deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Delete all read error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete notifications",
    });
  }
};

// ========== 8. GET NOTIFICATION PREFERENCES ==========
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Default preferences if not set
    const defaultPreferences = {
      jobApplication: { inApp: true, email: true, push: false },
      eventRegistration: { inApp: true, email: true, push: false },
      newOrder: { inApp: true, email: true, push: true },
      newMessage: { inApp: true, email: false, push: true },
      orderDelivered: { inApp: true, email: true, push: true },
      systemAnnouncement: { inApp: true, email: true, push: false },
    };

    const preferences = user.notificationPreferences || defaultPreferences;

    res.json({
      success: true,
      preferences,
    });
  } catch (err) {
    console.error("Get preferences error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to get preferences",
    });
  }
};

// ========== 9. UPDATE NOTIFICATION PREFERENCES ==========
exports.updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findById(req.userId);
    user.notificationPreferences = preferences;
    await user.save();

    res.json({
      success: true,
      message: "Preferences updated successfully",
      preferences: user.notificationPreferences,
    });
  } catch (err) {
    console.error("Update preferences error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update preferences",
    });
  }
};

// ========== 10. GET NOTIFICATIONS BY TYPE ==========
exports.getNotificationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      userId: req.userId,
      type: type,
    })
      .populate("actor", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Notification.countDocuments({
      userId: req.userId,
      type: type,
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total: total,
      },
    });
  } catch (err) {
    console.error("Get notifications by type error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch notifications",
    });
  }
};

// ========== 11. TEST NOTIFICATION (Development only) ==========
exports.sendTestNotification = async (req, res) => {
  try {
    // Only in development
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        error: "Not available in production",
      });
    }

    const { type, title, message } = req.body;

    const notification = await Notification.createNotification({
      userId: req.userId,
      type: type || "system_announcement",
      title: title || "Test Notification",
      message: message || "This is a test notification",
      priority: "normal",
      channels: { inApp: true, email: false, push: false },
    });

    res.json({
      success: true,
      message: "Test notification sent",
      notification,
    });
  } catch (err) {
    console.error("Send test notification error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to send test notification",
    });
  }
};

// ========== 12. MARK ACTION AS TAKEN ==========
exports.markActionTaken = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    // Check authorization
    if (notification.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    await notification.markActionTaken();

    res.json({
      success: true,
      message: "Action marked as taken",
    });
  } catch (err) {
    console.error("Mark action taken error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to mark action as taken",
    });
  }
};

// ========== 13. GET URGENT NOTIFICATIONS ==========
exports.getUrgentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.userId,
      priority: "urgent",
      isRead: false,
    })
      .populate("actor", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      notifications,
      count: notifications.length,
    });
  } catch (err) {
    console.error("Get urgent notifications error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch urgent notifications",
    });
  }
};

// ========== 14. GET GROUPED NOTIFICATIONS ==========
exports.getGroupedNotifications = async (req, res) => {
  try {
    const { groupKey } = req.params;

    const notifications = await Notification.find({
      userId: req.userId,
      groupKey: groupKey,
    })
      .populate("actor", "name profilePicture")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
      total: notifications.length,
    });
  } catch (err) {
    console.error("Get grouped notifications error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch grouped notifications",
    });
  }
};

module.exports = exports;
