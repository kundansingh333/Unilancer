const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  // ========== PARTICIPANTS ==========
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  // ========== CONVERSATION TYPE ==========
  type: {
    type: String,
    enum: ["direct", "group"],
    default: "direct",
  },

  // ========== GROUP INFO ==========
  groupName: {
    type: String,
    trim: true,
  },

  groupImage: {
    type: String,
  },

  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // ========== LAST MESSAGE ==========
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },

  lastMessageAt: {
    type: Date,
    default: Date.now,
    index: true,
  },

  // ========== CONTEXT ==========
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

  // ========== SETTINGS ==========
  settings: {
    muted: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        mutedUntil: Date,
      },
    ],

    archived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    pinned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  // ========== TYPING ==========
  typing: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      startedAt: Date,
    },
  ],

  // ========== TIMESTAMPS ==========
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ========== INDEXES ==========
// conversationSchema.index({ participants: 1 });
// conversationSchema.index({ lastMessageAt: -1 });

// ✅ UNIQUE DIRECT CONVERSATION INDEX
// conversationSchema.index(
//   { participants: 1, type: 1 },
//   { unique: true, partialFilterExpression: { type: "direct" } }
// );

// ========== MIDDLEWARE ==========
conversationSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// ========== METHODS ==========

conversationSchema.methods.updateLastMessage = function (messageId) {
  this.lastMessage = messageId;
  this.lastMessageAt = Date.now();
  return this.save();
};

conversationSchema.methods.muteForUser = function (
  userId,
  duration = 86400000
) {
  this.settings.muted = this.settings.muted.filter(
    (m) => m.userId.toString() !== userId.toString()
  );

  this.settings.muted.push({
    userId,
    mutedUntil: new Date(Date.now() + duration),
  });

  return this.save();
};

conversationSchema.methods.unmuteForUser = function (userId) {
  this.settings.muted = this.settings.muted.filter(
    (m) => m.userId.toString() !== userId.toString()
  );
  return this.save();
};

conversationSchema.methods.archiveForUser = function (userId) {
  if (!this.settings.archived.includes(userId)) {
    this.settings.archived.push(userId);
  }
  return this.save();
};

conversationSchema.methods.unarchiveForUser = function (userId) {
  this.settings.archived = this.settings.archived.filter(
    (id) => id.toString() !== userId.toString()
  );
  return this.save();
};

conversationSchema.methods.pinForUser = function (userId) {
  if (!this.settings.pinned.includes(userId)) {
    this.settings.pinned.push(userId);
  }
  return this.save();
};

conversationSchema.methods.unpinForUser = function (userId) {
  this.settings.pinned = this.settings.pinned.filter(
    (id) => id.toString() !== userId.toString()
  );
  return this.save();
};

conversationSchema.methods.setTyping = function (userId, isTyping) {
  if (isTyping) {
    this.typing = this.typing.filter(
      (t) => t.userId.toString() !== userId.toString()
    );
    this.typing.push({
      userId,
      startedAt: Date.now(),
    });
  } else {
    this.typing = this.typing.filter(
      (t) => t.userId.toString() !== userId.toString()
    );
  }
  return this.save();
};

conversationSchema.methods.getOtherParticipant = function (userId) {
  return this.participants.find((id) => id.toString() !== userId.toString());
};

conversationSchema.methods.hasParticipant = function (userId) {
  return this.participants.some((id) => id.toString() === userId.toString());
};

// ========== STATIC METHODS ==========

// ✅ FIXED: Find or create conversation (NO DUPLICATES)
conversationSchema.statics.findOrCreate = async function (user1Id, user2Id) {
  // 🔥 CRITICAL FIX: deterministic order + exact match with index
  const participants = [user1Id, user2Id]
    .map(String)
    .sort()
    .map((id) => new mongoose.Types.ObjectId(id));

  let conversation = await this.findOne({
    type: "direct",
    participants,
  });

  if (!conversation) {
    conversation = await this.create({
      type: "direct",
      participants,
    });
  }

  return conversation;
};

conversationSchema.statics.getForUser = function (userId) {
  return this.find({ participants: userId })
    .populate("participants", "name email profilePicture role")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });
};

conversationSchema.statics.getPinned = function (userId) {
  return this.find({
    participants: userId,
    "settings.pinned": userId,
  })
    .populate("participants", "name email profilePicture")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });
};

conversationSchema.statics.getArchived = function (userId) {
  return this.find({
    participants: userId,
    "settings.archived": userId,
  })
    .populate("participants", "name email profilePicture")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });
};

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
