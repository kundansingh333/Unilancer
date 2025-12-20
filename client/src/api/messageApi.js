// src/api/messageApi.js
import api from "./client";

/* ================= CONVERSATIONS ================= */

// GET /api/messages
export const getConversations = () => api.get("/messages");

// GET /api/messages/unread-count
export const getUnreadCount = () => api.get("/messages/unread-count");

// GET /api/messages/search?query=
export const searchMessages = (query) =>
  api.get("/messages/search", { params: { query } });

/* ================= CHAT ================= */

// GET /api/messages/:otherUserId
export const getConversationWithUser = (otherUserId, params = {}) =>
  api.get(`/messages/${otherUserId}`, { params });

// POST /api/messages
// export const sendMessage = (data) => api.post("/messages", data);

export const sendMessage = (data) => {
  return api.post("/messages", {
    receiverId: data.receiverId,
    content: data.content,
  });
};

// PUT /api/messages/:messageId/read
export const markMessageRead = (messageId) =>
  api.put(`/messages/${messageId}/read`);

// PUT /api/messages/:otherUserId/read-all
export const markAllAsRead = (otherUserId) =>
  api.put(`/messages/${otherUserId}/read-all`);

/* ================= MESSAGE ACTIONS ================= */

// PUT /api/messages/:messageId/edit
export const editMessage = (messageId, content) =>
  api.put(`/messages/${messageId}/edit`, { content });

// DELETE /api/messages/:messageId
export const deleteMessage = (messageId, deleteForEveryone = false) =>
  api.delete(`/messages/${messageId}`, {
    data: { deleteForEveryone },
  });

// POST /api/messages/:messageId/react
export const addReaction = (messageId, emoji) =>
  api.post(`/messages/${messageId}/react`, { emoji });

// DELETE /api/messages/:messageId/react
export const removeReaction = (messageId) =>
  api.delete(`/messages/${messageId}/react`);

/* ================= CONVERSATION ACTIONS ================= */

// PUT /api/messages/:otherUserId/mute
export const muteConversation = (otherUserId, duration) =>
  api.put(`/messages/${otherUserId}/mute`, { duration });

// PUT /api/messages/:otherUserId/unmute
export const unmuteConversation = (otherUserId) =>
  api.put(`/messages/${otherUserId}/unmute`);

// PUT /api/messages/:otherUserId/archive
export const archiveConversation = (otherUserId) =>
  api.put(`/messages/${otherUserId}/archive`);

// PUT /api/messages/:otherUserId/pin
export const pinConversation = (otherUserId) =>
  api.put(`/messages/${otherUserId}/pin`);

// POST /api/messages/:otherUserId/typing
export const setTypingStatus = (otherUserId, isTyping) =>
  api.post(`/messages/${otherUserId}/typing`, { isTyping });
