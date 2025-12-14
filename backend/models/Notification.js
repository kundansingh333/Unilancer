// backend/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  // ========== RECIPIENT ==========
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // ========== NOTIFICATION TYPE ==========
  type: {
    type: String,
    enum: [
      // Job related
      "job_posted",
      "job_application",
      "application_status",
      "job_deadline_soon",

      // Event related
      "event_created",
      "event_registration",
      "event_reminder",
      "event_cancelled",
      "event_updated",

      // Gig related
      "gig_approved",
      "gig_rejected",
      "new_review",
      "review_helpful",

      // Order related
      "new_order",
      "order_accepted",
      "order_delivered",
      "order_completed",
      "order_cancelled",
      "revision_requested",
      "payment_received",

      // Message related
      "new_message",
      "message_reaction",

      // System
      "account_approved",
      "account_rejected",
      "profile_updated",
      "password_changed",
      "referral_bonus",
      "achievement_unlocked",
      "system_announcement",

      // Admin
      "content_pending_approval",
      "dispute_raised",
      "report_submitted",
    ],
    required: true,
  },

  // ========== NOTIFICATION CONTENT ==========
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },

  // Rich content (optional)
  richContent: {
    subtitle: String,
    imageUrl: String,
    actionButtons: [
      {
        label: String,
        action: String, // 'view', 'accept', 'reject', etc.
        url: String,
      },
    ],
  },

  // ========== RELATED ENTITY ==========
  relatedTo: {
    model: {
      type: String,
      enum: ["Job", "Event", "Gig", "Order", "Message", "User"],
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedTo.model",
    },
  },

  // ========== ACTOR (Who triggered this notification) ==========
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // ========== STATUS ==========
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },

  readAt: {
    type: Date,
  },

  // ========== ACTION ==========
  actionUrl: {
    type: String,
    trim: true,
  },

  actionTaken: {
    type: Boolean,
    default: false,
  },

  actionTakenAt: {
    type: Date,
  },

  // ========== DELIVERY CHANNELS ==========
  channels: {
    inApp: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: false,
    },
    push: {
      type: Boolean,
      default: false,
    },
  },

  // ========== DELIVERY STATUS ==========
  deliveryStatus: {
    inApp: {
      type: String,
      enum: ["pending", "delivered", "failed"],
      default: "delivered",
    },
    email: {
      type: String,
      enum: ["pending", "sent", "failed", "not_required"],
      default: "not_required",
    },
    push: {
      type: String,
      enum: ["pending", "sent", "failed", "not_required"],
      default: "not_required",
    },
  },

  // Email specific
  emailSentAt: {
    type: Date,
  },

  // Push specific
  pushSentAt: {
    type: Date,
  },

  // ========== PRIORITY ==========
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },

  // ========== GROUPING (for similar notifications) ==========
  groupKey: {
    type: String,
    index: true,
  },

  groupCount: {
    type: Number,
    default: 1,
  },

  // ========== EXPIRY ==========
  expiresAt: {
    type: Date,
    index: true,
  },

  // ========== METADATA ==========
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },

  // ========== TIMESTAMPS ==========
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ========== INDEXES ==========
// Compound indexes for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ userId: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ groupKey: 1 });

// TTL index for auto-deletion of old read notifications (after 90 days)
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7776000, partialFilterExpression: { isRead: true } }
);

// ========== MIDDLEWARE ==========

// Update 'updatedAt' before saving
notificationSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// ========== METHODS ==========

// Mark as read
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = Date.now();
  return this.save();
};

// Mark action as taken
notificationSchema.methods.markActionTaken = function () {
  this.actionTaken = true;
  this.actionTakenAt = Date.now();
  return this.save();
};

// Check if expired
notificationSchema.methods.isExpired = function () {
  return this.expiresAt && this.expiresAt < Date.now();
};

// Update delivery status
notificationSchema.methods.updateDeliveryStatus = function (channel, status) {
  this.deliveryStatus[channel] = status;

  if (channel === "email" && status === "sent") {
    this.emailSentAt = Date.now();
  }

  if (channel === "push" && status === "sent") {
    this.pushSentAt = Date.now();
  }

  return this.save();
};

// Increment group count
notificationSchema.methods.incrementGroupCount = function () {
  this.groupCount += 1;
  return this.save();
};

// ========== VIRTUALS ==========

// Time ago (human readable)
notificationSchema.virtual("timeAgo").get(function () {
  const diff = Date.now() - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
});

// Enable virtuals in JSON
notificationSchema.set("toJSON", { virtuals: true });
notificationSchema.set("toObject", { virtuals: true });

// ========== STATIC METHODS ==========

// Get notifications for user
notificationSchema.statics.getForUser = function (userId, options = {}) {
  const {
    limit = 20,
    skip = 0,
    unreadOnly = false,
    type = null,
    priority = null,
  } = options;

  const query = { userId };

  if (unreadOnly) {
    query.isRead = false;
  }

  if (type) {
    query.type = type;
  }

  if (priority) {
    query.priority = priority;
  }

  return this.find(query)
    .populate("actor", "name profilePicture")
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Get unread count
notificationSchema.statics.getUnreadCount = function (userId, type = null) {
  const query = { userId, isRead: false };

  if (type) {
    query.type = type;
  }

  return this.countDocuments(query);
};

// Mark all as read
notificationSchema.statics.markAllAsRead = function (userId, type = null) {
  const query = { userId, isRead: false };

  if (type) {
    query.type = type;
  }

  return this.updateMany(query, {
    $set: {
      isRead: true,
      readAt: Date.now(),
    },
  });
};

// Delete old read notifications
notificationSchema.statics.deleteOldRead = function (daysOld = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return this.deleteMany({
    isRead: true,
    createdAt: { $lt: cutoffDate },
  });
};

// Find or update grouped notification
notificationSchema.statics.findOrCreateGrouped = async function (
  notificationData
) {
  if (!notificationData.groupKey) {
    // Not a grouped notification, create new
    return this.create(notificationData);
  }

  // Check if similar notification exists (within last hour)
  const oneHourAgo = new Date(Date.now() - 3600000);

  const existing = await this.findOne({
    userId: notificationData.userId,
    groupKey: notificationData.groupKey,
    isRead: false,
    createdAt: { $gte: oneHourAgo },
  });

  if (existing) {
    // Update existing grouped notification
    await existing.incrementGroupCount();
    existing.message = notificationData.message;
    existing.updatedAt = Date.now();
    await existing.save();
    return existing;
  } else {
    // Create new grouped notification
    return this.create(notificationData);
  }
};

// Get notification statistics
notificationSchema.statics.getStats = async function (userId) {
  const [unread, total, byType] = await Promise.all([
    this.countDocuments({ userId, isRead: false }),
    this.countDocuments({ userId }),
    this.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
  ]);

  return {
    unreadCount: unread,
    totalCount: total,
    byType: byType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
};

// Create notification helper
notificationSchema.statics.createNotification = async function (data) {
  const {
    userId,
    type,
    title,
    message,
    actor,
    relatedTo,
    actionUrl,
    priority = "normal",
    channels = { inApp: true, email: false, push: false },
    groupKey = null,
    expiresAt = null,
    metadata = {},
  } = data;

  const notification = {
    userId,
    type,
    title,
    message,
    actor,
    relatedTo,
    actionUrl,
    priority,
    channels,
    groupKey,
    expiresAt,
    metadata: new Map(Object.entries(metadata)),
  };

  // Set delivery status based on channels
  notification.deliveryStatus = {
    inApp: channels.inApp ? "delivered" : "not_required",
    email: channels.email ? "pending" : "not_required",
    push: channels.push ? "pending" : "not_required",
  };

  // Handle grouped notifications
  if (groupKey) {
    return this.findOrCreateGrouped(notification);
  }

  return this.create(notification);
};

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
