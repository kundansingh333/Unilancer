// backend/routes/messages.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");

// ========== ALL ROUTES REQUIRE AUTHENTICATION ==========

/**
 * @route   GET /api/messages
 * @desc    Get all conversations
 * @access  Private
 */
router.get("/", auth, messageController.getConversations);

/**
 * @route   GET /api/messages/unread-count
 * @desc    Get unread messages count
 * @access  Private
 */
router.get("/unread-count", auth, messageController.getUnreadCount);

/**
 * @route   GET /api/messages/search
 * @desc    Search messages
 * @access  Private
 * @query   query
 */
router.get("/search", auth, messageController.searchMessages);

/**
 * @route   GET /api/messages/:otherUserId
 * @desc    Get conversation with specific user
 * @access  Private
 * @query   limit, skip
 */
router.get("/:otherUserId", auth, messageController.getConversationWithUser);

/**
 * @route   POST /api/messages
 * @desc    Send a new message
 * @access  Private
 * @body    { receiverId, content, messageType, attachments, relatedTo, replyTo }
 */
router.post("/", auth, messageController.sendMessage);

/**
 * @route   PUT /api/messages/:messageId/read
 * @desc    Mark a message as read
 * @access  Private
 */
router.put("/:messageId/read", auth, messageController.markAsRead);

/**
 * @route   PUT /api/messages/:otherUserId/read-all
 * @desc    Mark all messages from a user as read
 * @access  Private
 */
router.put("/:otherUserId/read-all", auth, messageController.markAllAsRead);

/**
 * @route   PUT /api/messages/:messageId/edit
 * @desc    Edit a message
 * @access  Private (Sender only, within 15 minutes)
 * @body    { content }
 */
router.put("/:messageId/edit", auth, messageController.editMessage);

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a message
 * @access  Private
 * @body    { deleteForEveryone } (optional)
 */
router.delete("/:messageId", auth, messageController.deleteMessage);

/**
 * @route   POST /api/messages/:messageId/react
 * @desc    Add a reaction to a message
 * @access  Private
 * @body    { emoji }
 */
router.post("/:messageId/react", auth, messageController.addReaction);

/**
 * @route   DELETE /api/messages/:messageId/react
 * @desc    Remove reaction from a message
 * @access  Private
 */
router.delete("/:messageId/react", auth, messageController.removeReaction);

/**
 * @route   PUT /api/messages/:otherUserId/mute
 * @desc    Mute a conversation
 * @access  Private
 * @body    { duration } (optional, in milliseconds)
 */
router.put("/:otherUserId/mute", auth, messageController.muteConversation);

/**
 * @route   PUT /api/messages/:otherUserId/unmute
 * @desc    Unmute a conversation
 * @access  Private
 */
router.put("/:otherUserId/unmute", auth, messageController.unmuteConversation);

/**
 * @route   PUT /api/messages/:otherUserId/archive
 * @desc    Archive a conversation
 * @access  Private
 */
router.put(
  "/:otherUserId/archive",
  auth,
  messageController.archiveConversation
);

/**
 * @route   PUT /api/messages/:otherUserId/pin
 * @desc    Pin a conversation
 * @access  Private
 */
router.put("/:otherUserId/pin", auth, messageController.pinConversation);

/**
 * @route   POST /api/messages/:otherUserId/typing
 * @desc    Set typing indicator
 * @access  Private
 * @body    { isTyping: true/false }
 */
router.post("/:otherUserId/typing", auth, messageController.setTyping);

module.exports = router;
