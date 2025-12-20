// src/store/messageStore.js
import { create } from "zustand";
import * as messageApi from "../api/messageApi";
import { socket } from "../socket/socket";

const useMessageStore = create((set, get) => ({
  conversations: [],
  messages: [],
  unreadCount: 0,

  typingUsers: {}, // { userId: true }

  activeChatUser: null,

  isLoading: false,
  error: null,

  /* ================= CONVERSATIONS ================= */

  // fetchConversations: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const res = await messageApi.getConversations();

  //     set({
  //       conversations: res.data.conversations || res.data || [],
  //       isLoading: false,
  //     });
  //   } catch (err) {
  //     set({
  //       error: err.response?.data?.error || "Failed to load conversations",
  //       isLoading: false,
  //       conversations: [], // fallback
  //     });
  //   }
  // },

  /* ================= CHAT MESSAGES ================= */

  fetchMessages: async (otherUserId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await messageApi.getConversationWithUser(otherUserId, params);

      // 1. Get the raw array from backend
      const rawMessages = res.data.messages || res.data || [];

      // 2. 🔥 REVERSE IT here so it is stored as [Oldest, ..., Newest]
      // This ensures the last item in the array is the Newest message.
      // (Only do this if your backend sends Newest First)
      const sortedMessages = rawMessages.reverse();

      set({
        messages: sortedMessages,
        activeChatUser: otherUserId,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to load messages",
        isLoading: false,
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await messageApi.getUnreadCount();
      set({ unreadCount: res.data.count });
    } catch {}
  },

  /* ================= CHAT ================= */

  fetchMessages: async (otherUserId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await messageApi.getConversationWithUser(otherUserId, params);

      set({
        messages: res.data.messages || res.data,
        activeChatUser: otherUserId,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to load messages",
        isLoading: false,
      });
    }
  },

  // sendMessage: async (data) => {
  //   try {
  //     const res = await messageApi.sendMessage(data);

  //     const newMessage = res.data.data; // ✅ correct object

  //     set((state) => ({
  //       messages: [...state.messages,newMessage],
  //     }));

  //     return newMessage;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  sendMessage: async (data) => {
    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      _id: tempId,
      senderId: { _id: "me" },
      receiverId: data.receiverId,
      content: data.content,
      createdAt: new Date().toISOString(),
      timeAgo: "just now",
      isRead: false,
      failed: false,
      isTemp: true,
    };

    // Optimistic UI
    set((state) => ({
      messages: [...state.messages, tempMessage],
    }));

    try {
      const res = await messageApi.sendMessage(data);
      const realMessage = res.data.data;

      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === tempId ? realMessage : m
        ),
      }));

      return realMessage;
    } catch (err) {
      // Mark failed
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === tempId ? { ...m, failed: true } : m
        ),
      }));
      throw err;
    }
  },

  markAllRead: async (otherUserId) => {
    try {
      await messageApi.markAllAsRead(otherUserId);
    } catch {}
  },

  /* ================= MESSAGE ACTIONS ================= */

  editMessage: async (messageId, content) => {
    const res = await messageApi.editMessage(messageId, content);

    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId ? res.data.message : m
      ),
    }));
  },

  deleteMessage: async (messageId, deleteForEveryone = false) => {
    await messageApi.deleteMessage(messageId, deleteForEveryone);

    set((state) => ({
      messages: state.messages.filter((m) => m._id !== messageId),
    }));
  },

  // reactToMessage: async (messageId, emoji) => {
  //   const res = await messageApi.addReaction(messageId, emoji);

  //   set((state) => ({
  //     messages: state.messages.map((m) =>
  //       m._id === messageId ? res.data.message : m
  //     ),
  //   }));
  // },

  // removeReaction: async (messageId) => {
  //   const res = await messageApi.removeReaction(messageId);

  //   set((state) => ({
  //     messages: state.messages.map((m) =>
  //       m._id === messageId ? res.data.message : m
  //     ),
  //   }));
  // },

  reactToMessage: async (messageId, emoji) => {
    const res = await messageApi.addReaction(messageId, emoji);

    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId
          ? {
              ...m, // ✅ KEEP content, senderId, etc.
              reactions: res.data.reactions,
            }
          : m
      ),
    }));
  },

  removeReaction: async (messageId) => {
    const res = await messageApi.removeReaction(messageId);

    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId
          ? {
              ...m,
              reactions: res.data.reactions,
            }
          : m
      ),
    }));
  },

  /* ================= SEARCH ================= */

  searchMessages: async (query) => {
    set({ isLoading: true });
    try {
      const res = await messageApi.searchMessages(query);
      set({ messages: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  // connectSocket: (userId) => {
  //   if (!socket.connected) {
  //     socket.connect();
  //     socket.emit("join", userId);
  //   }

  //   socket.off("new-message");
  //   socket.on("new-message", (message) => {
  //     const { activeChatUser } = get();

  //     if (
  //       message.senderId?._id === activeChatUser ||
  //       message.receiverId?._id === activeChatUser
  //     ) {
  //       set((state) => ({
  //         messages: [...state.messages, message],
  //       }));
  //     }
  //   });

  //   socket.off("typing");
  //   socket.on("typing", ({ userId, isTyping }) => {
  //     set((state) => ({
  //       typingUsers: {
  //         ...state.typingUsers,
  //         [userId]: isTyping,
  //       },
  //     }));
  //   });
  // },

  connectSocket: (userId) => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("join", userId);
    }

    socket.off("new-message");
    socket.on("new-message", (message) => {
      const { activeChatUser } = get();

      // ⚠️ FIX: Check if ID is an object (populated) or just a string
      const senderId =
        typeof message.senderId === "object"
          ? message.senderId._id
          : message.senderId;

      const receiverId =
        typeof message.receiverId === "object"
          ? message.receiverId._id
          : message.receiverId;

      // Compare extracted IDs with the active chat user
      if (senderId === activeChatUser || receiverId === activeChatUser) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    });

    socket.off("typing");
    socket.on("typing", ({ userId, isTyping }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [userId]: isTyping,
        },
      }));
    });
  },
  disconnectSocket: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  sendTyping: (receiverId, isTyping) => {
    socket.emit("typing", { receiverId, isTyping });
  },
}));

export default useMessageStore;
