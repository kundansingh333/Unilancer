const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // ================= PARTICIPANTS =================
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

  // ================= CONTENT =================
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

  attachments: [
    {
      type: {
        type: String,
        enum: ["image", "file", "video", "audio"],
      },
      name: String,
      url: String,
      size: Number,
      mimeType: String,
    },
  ],

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

  // ================= STATUS =================
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },

  readAt: Date,

  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },

  deletedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },

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

  deliveryStatus: {
    type: String,
    enum: ["sent", "delivered", "read", "failed"],
    default: "sent",
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  isEdited: {
    type: Boolean,
    default: false,
  },

  editedAt: Date,
});

/* ================= INDEXES ================= */
// messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
// messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });
// messageSchema.index({ receiverId: 1, isRead: 1 });
// messageSchema.index({ content: "text" });

/* ================= MIDDLEWARE ================= */
messageSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

messageSchema.pre("save", function () {
  if (this.isRead && this.deliveryStatus !== "read") {
    this.deliveryStatus = "read";
    this.readAt = Date.now();
  }
});

/* ================= METHODS ================= */

// ✅ Mark as read
messageSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = Date.now();
  this.deliveryStatus = "read";
  return this.save();
};

// ✅ Edit
messageSchema.methods.editContent = function (newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = Date.now();
  return this.save();
};

// ✅ Delete for me
messageSchema.methods.deleteForUser = function (userId) {
  if (!this.deletedBy.includes(userId)) {
    this.deletedBy.push(userId);
  }

  if (this.deletedBy.length >= 2) {
    this.isDeleted = true;
  }

  return this.save();
};

// ✅ Delete for everyone
messageSchema.methods.deleteForEveryone = function () {
  this.isDeleted = true;
  return this.save();
};

// ✅ Reactions
messageSchema.methods.addReaction = function (userId, emoji) {
  this.reactions = this.reactions.filter(
    (r) => r.userId.toString() !== userId.toString()
  );

  this.reactions.push({ userId, emoji, reactedAt: Date.now() });
  return this.save();
};

messageSchema.methods.removeReaction = function (userId) {
  this.reactions = this.reactions.filter(
    (r) => r.userId.toString() !== userId.toString()
  );
  return this.save();
};

// ✅ Visibility
messageSchema.methods.isVisibleTo = function (userId) {
  return !this.isDeleted && !this.deletedBy.includes(userId);
};

/* ================= VIRTUAL ================= */
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

messageSchema.set("toJSON", { virtuals: true });
messageSchema.set("toObject", { virtuals: true });

/* ================= STATICS ================= */

// ✅ Conversation messages (IMPORTANT FIX)
// messageSchema.statics.getConversation = function (
//   userId1,
//   userId2,
//   limit = 50,
//   skip = 0
// ) {
//   return this.find({
//     isDeleted: false,
//     deletedBy: { $nin: [userId1] },
//     $or: [
//       { senderId: userId1, receiverId: userId2 },
//       { senderId: userId2, receiverId: userId1 },
//     ],
//   })
//     .sort({ createdAt: 1 }) // ✅ oldest → newest (chat UI)
//     .limit(limit)
//     .skip(skip)
//     .populate("senderId", "name profilePicture")
//     .populate("receiverId", "name profilePicture")
//     .populate("replyTo", "content senderId");
// };

// ✅ Conversation messages
messageSchema.statics.getConversation = function (
  userId1,
  userId2,
  limit = 50,
  skip = 0
) {
  return (
    this.find({
      isDeleted: false,
      deletedBy: { $nin: [userId1] },
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    })
      // 🔥 FIX: Change 1 to -1 to get the LATEST messages
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("senderId", "name profilePicture")
      .populate("receiverId", "name profilePicture")
      .populate("replyTo", "content senderId")
  );
};

// ✅ Conversations list
messageSchema.statics.getConversations = async function (userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const conversations = await this.aggregate([
    {
      $match: {
        isDeleted: false,
        deletedBy: { $nin: [userObjectId] },
        $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
      },
    },
    { $sort: { createdAt: -1 } },
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
    { $sort: { "lastMessage.createdAt": -1 } },
  ]);

  await this.populate(conversations, {
    path: "_id",
    select: "name profilePicture role",
  });

  await this.populate(conversations, {
    path: "lastMessage.senderId lastMessage.receiverId",
    select: "name profilePicture",
  });

  return conversations;
};

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
