// backend/controllers/messageController.js
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

// ========== 1. GET ALL CONVERSATIONS ==========
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all conversations using Message model
    const conversations = await Message.getConversations(userId);

    res.json({
      success: true,
      conversations,
      total: conversations.length,
    });
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversations",
    });
  }
};

// ========== 2. GET CONVERSATION WITH USER ==========
exports.getConversationWithUser = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Verify other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get messages
    const messages = await Message.getConversation(
      req.userId,
      otherUserId,
      Number(limit),
      Number(skip)
    );

    // Mark messages as read
    await Message.markAllAsRead(otherUserId, req.userId);

    res.json({
      success: true,
      messages: messages.reverse(), // Oldest first for chat UI
      otherUser: {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        profilePicture: otherUser.profilePicture,
        role: otherUser.role,
      },
      hasMore: messages.length === Number(limit),
    });
  } catch (err) {
    console.error("Get conversation error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversation",
    });
  }
};

// ========== 3. SEND MESSAGE ==========
exports.sendMessage = async (req, res) => {
  try {
    const {
      receiverId,
      content,
      messageType = "text",
      attachments = [],
      relatedTo,
      replyTo,
    } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: "Receiver not found",
      });
    }

    // Can't send message to yourself
    if (receiverId === req.userId) {
      return res.status(400).json({
        success: false,
        error: "Cannot send message to yourself",
      });
    }

    // Create message
    const message = new Message({
      senderId: req.userId,
      receiverId: receiverId,
      content: content.trim(),
      messageType,
      attachments,
      relatedTo,
      replyTo,
      deliveryStatus: "delivered",
    });

    await message.save();

    // Populate sender info
    await message.populate("senderId", "name profilePicture");
    await message.populate("receiverId", "name profilePicture");

    // Find or create conversation
    const conversation = await Conversation.findOrCreate(
      req.userId,
      receiverId
    );
    await conversation.updateLastMessage(message._id);

    // 🔥 Send real-time message via Socket.io
    if (global.io) {
      global.io.to(receiverId).emit("new-message", message);
      console.log(`💬 Real-time message sent to user ${receiverId}`);
    }

    // Send notification (if receiver is offline)
    await notificationService.notifyNewMessage(
      message._id,
      receiverId,
      req.userId
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
};

// ========== 4. MARK MESSAGE AS READ ==========
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Only receiver can mark as read
    if (message.receiverId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to mark message as read",
    });
  }
};

// ========== 5. MARK ALL AS READ ==========
exports.markAllAsRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    await Message.markAllAsRead(otherUserId, req.userId);

    res.json({
      success: true,
      message: "All messages marked as read",
    });
  } catch (err) {
    console.error("Mark all as read error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to mark messages as read",
    });
  }
};

// ========== 6. EDIT MESSAGE ==========
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Content is required",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Only sender can edit
    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to edit this message",
      });
    }

    // Can't edit after 15 minutes
    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - message.createdAt > fifteenMinutes) {
      return res.status(400).json({
        success: false,
        error: "Cannot edit message after 15 minutes",
      });
    }

    await message.editContent(content.trim());

    res.json({
      success: true,
      message: "Message edited successfully",
      data: message,
    });
  } catch (err) {
    console.error("Edit message error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to edit message",
    });
  }
};

// ========== 7. DELETE MESSAGE ==========
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone = false } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Check authorization
    const isSender = message.senderId.toString() === req.userId;
    const isReceiver = message.receiverId.toString() === req.userId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    if (deleteForEveryone) {
      // Only sender can delete for everyone
      if (!isSender) {
        return res.status(403).json({
          success: false,
          error: "Only sender can delete for everyone",
        });
      }

      // Can only delete for everyone within 1 hour
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - message.createdAt > oneHour) {
        return res.status(400).json({
          success: false,
          error: "Can only delete for everyone within 1 hour",
        });
      }

      // Hard delete
      await Message.findByIdAndDelete(messageId);
    } else {
      // Delete for self only
      await message.deleteForUser(req.userId);
    }

    res.json({
      success: true,
      message: deleteForEveryone
        ? "Message deleted for everyone"
        : "Message deleted for you",
    });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete message",
    });
  }
};

// ========== 8. ADD REACTION ==========
exports.addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        error: "Emoji is required",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Check if user is part of conversation
    const isParticipant =
      message.senderId.toString() === req.userId ||
      message.receiverId.toString() === req.userId;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    await message.addReaction(req.userId, emoji);

    res.json({
      success: true,
      message: "Reaction added",
      reactions: message.reactions,
    });
  } catch (err) {
    console.error("Add reaction error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to add reaction",
    });
  }
};

// ========== 9. REMOVE REACTION ==========
exports.removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    await message.removeReaction(req.userId);

    res.json({
      success: true,
      message: "Reaction removed",
      reactions: message.reactions,
    });
  } catch (err) {
    console.error("Remove reaction error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to remove reaction",
    });
  }
};

// ========== 10. SEARCH MESSAGES ==========
exports.searchMessages = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const messages = await Message.searchMessages(req.userId, query.trim());

    res.json({
      success: true,
      messages,
      total: messages.length,
    });
  } catch (err) {
    console.error("Search messages error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to search messages",
    });
  }
};

// ========== 11. GET UNREAD COUNT ==========
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.userId);

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

// ========== 12. MUTE CONVERSATION ==========
exports.muteConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const { duration = 86400000 } = req.body; // Default 24 hours

    const conversation = await Conversation.findOrCreate(
      req.userId,
      otherUserId
    );
    await conversation.muteForUser(req.userId, duration);

    res.json({
      success: true,
      message: "Conversation muted",
    });
  } catch (err) {
    console.error("Mute conversation error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to mute conversation",
    });
  }
};

// ========== 13. UNMUTE CONVERSATION ==========
exports.unmuteConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const conversation = await Conversation.findOrCreate(
      req.userId,
      otherUserId
    );
    await conversation.unmuteForUser(req.userId);

    res.json({
      success: true,
      message: "Conversation unmuted",
    });
  } catch (err) {
    console.error("Unmute conversation error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to unmute conversation",
    });
  }
};

// ========== 14. ARCHIVE CONVERSATION ==========
exports.archiveConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const conversation = await Conversation.findOrCreate(
      req.userId,
      otherUserId
    );
    await conversation.archiveForUser(req.userId);

    res.json({
      success: true,
      message: "Conversation archived",
    });
  } catch (err) {
    console.error("Archive conversation error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to archive conversation",
    });
  }
};

// ========== 15. PIN CONVERSATION ==========
exports.pinConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const conversation = await Conversation.findOrCreate(
      req.userId,
      otherUserId
    );
    await conversation.pinForUser(req.userId);

    res.json({
      success: true,
      message: "Conversation pinned",
    });
  } catch (err) {
    console.error("Pin conversation error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to pin conversation",
    });
  }
};

// ========== 16. SET TYPING INDICATOR ==========
exports.setTyping = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const { isTyping } = req.body;

    const conversation = await Conversation.findOrCreate(
      req.userId,
      otherUserId
    );
    await conversation.setTyping(req.userId, isTyping);

    // 🔥 Emit typing event via Socket.io
    if (global.io) {
      global.io.to(otherUserId).emit("typing", {
        userId: req.userId,
        isTyping,
      });
    }

    res.json({
      success: true,
      message: "Typing status updated",
    });
  } catch (err) {
    console.error("Set typing error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update typing status",
    });
  }
};

module.exports = exports;
