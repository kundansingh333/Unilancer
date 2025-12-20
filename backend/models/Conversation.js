// // backend/models/Conversation.js
// const mongoose = require("mongoose");

// const conversationSchema = new mongoose.Schema({
//   // ========== PARTICIPANTS ==========
//   participants: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   ],

//   // ========== CONVERSATION TYPE ==========
//   type: {
//     type: String,
//     enum: ["direct", "group"], // For future group chat support
//     default: "direct",
//   },

//   // ========== GROUP INFO (if type is group) ==========
//   groupName: {
//     type: String,
//     trim: true,
//   },

//   groupImage: {
//     type: String,
//   },

//   groupAdmin: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },

//   // ========== LAST MESSAGE INFO ==========
//   lastMessage: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Message",
//   },

//   lastMessageAt: {
//     type: Date,
//     default: Date.now,
//     index: true,
//   },

//   // ========== CONTEXT ==========
//   // If conversation is about a specific job/gig/event
//   relatedTo: {
//     model: {
//       type: String,
//       enum: ["Job", "Gig", "Event", "Order"],
//     },
//     id: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "relatedTo.model",
//     },
//   },

//   // ========== CONVERSATION SETTINGS ==========
//   settings: {
//     // Per-user settings
//     muted: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         mutedUntil: Date,
//       },
//     ],

//     archived: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     pinned: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },

//   // ========== TYPING INDICATORS ==========
//   typing: [
//     {
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//       startedAt: Date,
//     },
//   ],

//   // ========== TIMESTAMPS ==========
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },

//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // ========== INDEXES ==========
// conversationSchema.index({ participants: 1 });
// conversationSchema.index({ lastMessageAt: -1 });

// // Compound index for direct conversations
// conversationSchema.index(
//   { participants: 1, type: 1 },
//   { unique: true, partialFilterExpression: { type: "direct" } }
// );

// // ========== MIDDLEWARE ==========

// // Update 'updatedAt' and 'lastMessageAt'
// conversationSchema.pre("save", function () {
//   this.updatedAt = Date.now();

// });

// // ========== METHODS ==========

// // Update last message
// conversationSchema.methods.updateLastMessage = function (messageId) {
//   this.lastMessage = messageId;
//   this.lastMessageAt = Date.now();
//   return this.save();
// };

// // Mute conversation for user
// conversationSchema.methods.muteForUser = function (
//   userId,
//   duration = 86400000
// ) {
//   // Remove existing mute
//   this.settings.muted = this.settings.muted.filter(
//     (m) => m.userId.toString() !== userId.toString()
//   );

//   // Add new mute
//   this.settings.muted.push({
//     userId,
//     mutedUntil: new Date(Date.now() + duration),
//   });

//   return this.save();
// };

// // Unmute conversation for user
// conversationSchema.methods.unmuteForUser = function (userId) {
//   this.settings.muted = this.settings.muted.filter(
//     (m) => m.userId.toString() !== userId.toString()
//   );

//   return this.save();
// };

// // Archive conversation for user
// conversationSchema.methods.archiveForUser = function (userId) {
//   if (!this.settings.archived.includes(userId)) {
//     this.settings.archived.push(userId);
//   }
//   return this.save();
// };

// // Unarchive conversation for user
// conversationSchema.methods.unarchiveForUser = function (userId) {
//   this.settings.archived = this.settings.archived.filter(
//     (id) => id.toString() !== userId.toString()
//   );
//   return this.save();
// };

// // Pin conversation for user
// conversationSchema.methods.pinForUser = function (userId) {
//   if (!this.settings.pinned.includes(userId)) {
//     this.settings.pinned.push(userId);
//   }
//   return this.save();
// };

// // Unpin conversation for user
// conversationSchema.methods.unpinForUser = function (userId) {
//   this.settings.pinned = this.settings.pinned.filter(
//     (id) => id.toString() !== userId.toString()
//   );
//   return this.save();
// };

// // Set typing indicator
// conversationSchema.methods.setTyping = function (userId, isTyping) {
//   if (isTyping) {
//     // Remove existing typing indicator
//     this.typing = this.typing.filter(
//       (t) => t.userId.toString() !== userId.toString()
//     );

//     // Add new typing indicator
//     this.typing.push({
//       userId,
//       startedAt: Date.now(),
//     });
//   } else {
//     // Remove typing indicator
//     this.typing = this.typing.filter(
//       (t) => t.userId.toString() !== userId.toString()
//     );
//   }

//   return this.save();
// };

// // Get other participant (for direct conversations)
// conversationSchema.methods.getOtherParticipant = function (userId) {
//   return this.participants.find((id) => id.toString() !== userId.toString());
// };

// // Check if user is participant
// conversationSchema.methods.hasParticipant = function (userId) {
//   return this.participants.some((id) => id.toString() === userId.toString());
// };

// // Check if muted for user
// conversationSchema.methods.isMutedForUser = function (userId) {
//   const mute = this.settings.muted.find(
//     (m) => m.userId.toString() === userId.toString()
//   );

//   if (!mute) return false;

//   // Check if mute has expired
//   if (mute.mutedUntil < Date.now()) {
//     // Remove expired mute
//     this.unmuteForUser(userId);
//     return false;
//   }

//   return true;
// };

// // ========== STATIC METHODS ==========

// // Find or create conversation
// conversationSchema.statics.findOrCreate = async function (user1Id, user2Id) {
//   // Ensure consistent ordering
//   const participants = [user1Id, user2Id].sort();

//   let conversation = await this.findOne({
//     type: "direct",
//     participants: { $all: participants },
//   });

//   if (!conversation) {
//     conversation = await this.create({
//       type: "direct",
//       participants: participants,
//     });
//   }

//   return conversation;
// };

// // Get all conversations for user
// conversationSchema.statics.getForUser = function (userId) {
//   return this.find({
//     participants: userId,
//   })
//     .populate("participants", "name email profilePicture role")
//     .populate("lastMessage")
//     .sort({ lastMessageAt: -1 });
// };

// // Get pinned conversations
// conversationSchema.statics.getPinned = function (userId) {
//   return this.find({
//     participants: userId,
//     "settings.pinned": userId,
//   })
//     .populate("participants", "name email profilePicture")
//     .populate("lastMessage")
//     .sort({ lastMessageAt: -1 });
// };

// // Get archived conversations
// conversationSchema.statics.getArchived = function (userId) {
//   return this.find({
//     participants: userId,
//     "settings.archived": userId,
//   })
//     .populate("participants", "name email profilePicture")
//     .populate("lastMessage")
//     .sort({ lastMessageAt: -1 });
// };

// const Conversation = mongoose.model("Conversation", conversationSchema);

// module.exports = Conversation;

// backend/models/Conversation.js
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
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

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
