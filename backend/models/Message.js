// backend/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // ========== CONVERSATION PARTICIPANTS ==========
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // ========== MESSAGE CONTENT ==========
  content: {
    type: String,
    required: [true, "Message content is required"],
    trim: true,
    maxlength: [5000, "Message cannot exceed 5000 characters"],
  },

  messageType: {
    type: String,
    enum: ["text", "image", "file", "link", "system"],
    default: "text",
  },

  // ========== ATTACHMENTS ==========
  attachments: [
    {
      type: {
        type: String,
        enum: ["image", "file", "video", "audio"],
      },
      name: String,
      url: String,
      size: Number, // in bytes
      mimeType: String,
    },
  ],

  // ========== CONTEXT (Optional) ==========
  // If message is related to a job, gig, event, or order
  relatedTo: {
    model: {
      type: String,
      enum: ["Job", "Gig", "Event", "Order"],
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedTo.model",
    },
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

  isDeleted: {
    type: Boolean,
    default: false,
  },

  deletedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // ========== REPLY TO (Threading) ==========
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },

  // ========== REACTIONS (Optional) ==========
  reactions: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      emoji: String,
      reactedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // ========== DELIVERY STATUS ==========
  deliveryStatus: {
    type: String,
    enum: ["sent", "delivered", "read", "failed"],
    default: "sent",
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

  // ========== EDITED ==========
  isEdited: {
    type: Boolean,
    default: false,
  },

  editedAt: {
    type: Date,
  },
});

// ========== COMPOUND INDEXES ==========
// For efficient conversation queries
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

// For unread messages
messageSchema.index({ receiverId: 1, isRead: 1 });

// For searching messages
messageSchema.index({ content: "text" });

// ========== MIDDLEWARE ==========

// Update 'updatedAt' before saving
messageSchema.pre("save", function () {
  this.updatedAt = Date.now();
  // next();
});

// Update delivery status based on isRead
messageSchema.pre("save", function () {
  if (this.isRead && this.deliveryStatus !== "read") {
    this.deliveryStatus = "read";
    this.readAt = Date.now();
  }
});

// ========== METHODS ==========

// Mark message as read
messageSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = Date.now();
  this.deliveryStatus = "read";
  return this.save();
};

// Edit message
messageSchema.methods.editContent = function (newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = Date.now();
  return this.save();
};

// Delete for user
messageSchema.methods.deleteForUser = function (userId) {
  if (!this.deletedBy.includes(userId)) {
    this.deletedBy.push(userId);
  }

  // If both users deleted, mark as deleted
  if (this.deletedBy.length === 2) {
    this.isDeleted = true;
  }

  return this.save();
};

// Add reaction
messageSchema.methods.addReaction = function (userId, emoji) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(
    (r) => r.userId.toString() !== userId.toString()
  );

  // Add new reaction
  this.reactions.push({
    userId,
    emoji,
    reactedAt: Date.now(),
  });

  return this.save();
};

// Remove reaction
messageSchema.methods.removeReaction = function (userId) {
  this.reactions = this.reactions.filter(
    (r) => r.userId.toString() !== userId.toString()
  );

  return this.save();
};

// Check if message is visible to user
messageSchema.methods.isVisibleTo = function (userId) {
  return !this.deletedBy.includes(userId);
};

// ========== VIRTUALS ==========

// Time ago (human readable)
messageSchema.virtual("timeAgo").get(function () {
  const diff = Date.now() - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
});

// Enable virtuals in JSON
messageSchema.set("toJSON", { virtuals: true });
messageSchema.set("toObject", { virtuals: true });

// ========== STATIC METHODS ==========

// Get conversation between two users
messageSchema.statics.getConversation = function (
  userId1,
  userId2,
  limit = 50,
  skip = 0
) {
  return this.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
    deletedBy: { $nin: [userId1] },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("senderId", "name profilePicture")
    .populate("receiverId", "name profilePicture")
    .populate("replyTo", "content senderId");
};

// Get all conversations for a user
// Get all conversations for a user
messageSchema.statics.getConversations = async function (userId) {
  // Convert string userId to ObjectId with 'new' keyword
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Get unique conversation partners
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
        deletedBy: { $nin: [userObjectId] },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$senderId", userObjectId] },
            "$receiverId",
            "$senderId",
          ],
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", userObjectId] },
                  { $eq: ["$isRead", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: { "lastMessage.createdAt": -1 },
    },
  ]);

  // Populate user details
  await this.populate(conversations, {
    path: "_id",
    select: "name email profilePicture role",
  });

  await this.populate(conversations, {
    path: "lastMessage.senderId lastMessage.receiverId",
    select: "name profilePicture",
  });

  return conversations;
};

// Mark all messages as read
messageSchema.statics.markAllAsRead = function (senderId, receiverId) {
  return this.updateMany(
    {
      senderId: senderId,
      receiverId: receiverId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: Date.now(),
        deliveryStatus: "read",
      },
    }
  );
};

// Get unread count
messageSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    receiverId: userId,
    isRead: false,
    deletedBy: { $nin: [userId] },
  });
};

// Search messages
messageSchema.statics.searchMessages = function (userId, searchQuery) {
  return this.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
    $text: { $search: searchQuery },
    deletedBy: { $nin: [userId] },
  })
    .populate("senderId receiverId", "name profilePicture")
    .sort({ createdAt: -1 })
    .limit(50);
};

// Delete old messages (cleanup)
messageSchema.statics.deleteOldMessages = function (daysOld = 365) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isDeleted: true,
  });
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
