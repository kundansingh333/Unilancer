import * as eventsApi from "../api/eventsApi";
import { create } from "zustand";
import { uploadImage } from "../api/uploadApi";

const CACHE_TTL = 60 * 1000; // 60 seconds

const makeCacheKey = (params = {}) =>
  JSON.stringify({
    search: params.search || "",
    eventType: params.eventType || "",
    venueType: params.venueType || "",
    status: params.status || "all",
    page: params.page || 1,
  });

const useEventStore = create((set, get) => ({
  /* ================= STATE ================= */
  events: [],
  event: null,

  myOrganizedEvents: [],
  myRegisteredEvents: [],

  featuredEvents: [],

  registrations: [],
  attendanceStats: null,

  isLoading: false,
  error: null,

  regLoading: false,
  regError: null,

  /* ================= CACHE ================= */
  eventsCache: {}, // { cacheKey: { data, timestamp } }

  /* ================= HELPERS ================= */
  setError: (msg) => set({ error: msg }),

  /* ================= EVENTS ================= */

  fetchEvents: async (params = {}) => {
    const cacheKey = makeCacheKey(params);
    const cached = get().eventsCache[cacheKey];
    const now = Date.now();

    // ✅ Serve from cache if valid
    if (cached && now - cached.timestamp < CACHE_TTL) {
      set({ events: cached.data, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await eventsApi.getAllEvents(params);

      const events = res.data.events || [];

      set((state) => ({
        events,
        isLoading: false,
        eventsCache: {
          ...state.eventsCache,
          [cacheKey]: {
            data: events,
            timestamp: now,
          },
        },
      }));
    } catch (err) {
      set({
        error: err?.response?.data?.error || "Failed to load events",
        isLoading: false,
      });
    }
  },

  fetchFeaturedEvents: async () => {
    if (get().featuredEvents.length > 0) return;

    set({ isLoading: true, error: null });

    try {
      const res = await eventsApi.getFeaturedEvents();
      set({ featuredEvents: res.data.events, isLoading: false });
    } catch (err) {
      set({
        error: err?.response?.data?.error || "Failed to load featured events",
        isLoading: false,
      });
    }
  },

  fetchEventById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await eventsApi.getEventById(id);

      set({
        event: res.data.event,
        userStatus: res.data.userStatus,
        registrationOpen: res.data.registrationOpen,
        isLoading: false,
      });

      return res.data;
    } catch {
      set({ error: "Failed to load event", isLoading: false });
    }
  },

  /* ================= CRUD ================= */

  createEvent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await eventsApi.createEvent(data);

      // 🔥 Invalidate cache
      set({ eventsCache: {} });

      return { success: true, event: res.data.event };
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to create event";
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  // eventStore.js or eventsApi.js
  uploadEventImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post("/upload/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url; // Cloudinary secure_url
  },

  updateEvent: async (id, updatedData) => {
    set({ isLoading: true, error: null });

    try {
      const res = await eventsApi.updateEvent(id, updatedData);
      if (!res.data.success) throw new Error(res.data.error);

      // 🔥 Invalidate cache
      set({ eventsCache: {} });

      return { success: true, event: res.data.event };
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await eventsApi.deleteEvent(id);
      if (!res.data?.success) {
        throw new Error(res.data?.error || "Failed to delete event");
      }

      set((state) => ({
        events: state.events.filter((e) => e._id !== id),
        eventsCache: {}, // 🔥 clear cache
      }));

      return { success: true };
    } catch (err) {
      set({ error: err?.response?.data?.error || "Failed to delete event" });
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  /* ================= REGISTRATION ================= */

  registerForEvent: async (eventId, transactionId = "") => {
    set({ isLoading: true, error: null });
    try {
      const res = await eventsApi.registerForEvent(eventId, { transactionId });
      return { success: true, ...res.data };
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Failed to register";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  unregisterFromEvent: async (eventId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await eventsApi.unregisterFromEvent(eventId);
      return { success: true, ...res.data };
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Failed to unregister";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  /* ================= ORGANIZER ================= */

  loadMyOrganizedEvents: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await eventsApi.getMyOrganizedEvents();
      set({ myOrganizedEvents: res.data.events, isLoading: false });
    } catch (err) {
      set({
        error: err?.response?.data?.error || err.message,
        isLoading: false,
      });
    }
  },

  fetchMyRegisteredEvents: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await eventsApi.getMyRegisteredEvents();
      set({ myRegisteredEvents: res.data.registrations, isLoading: false });
    } catch (err) {
      set({
        error: err?.response?.data?.error || err.message,
        isLoading: false,
      });
    }
  },

  /* ================= REGISTRATIONS ================= */

  getEventRegistrations: async (eventId, filters = {}) => {
    set({ regLoading: true, regError: null });

    try {
      const res = await eventsApi.fetchEventRegistrations(eventId, filters);
      set({
        registrations: res.data.registrations,
        attendanceStats: res.data.stats,
        regLoading: false,
      });
    } catch (err) {
      set({
        regError: err?.response?.data?.error || "Failed to fetch registrations",
        regLoading: false,
      });
    }
  },

  markUserAttendance: async (eventId, userId, attended) => {
    try {
      await eventsApi.markAttendance(eventId, userId, { attended });
      await get().getEventRegistrations(eventId);
    } catch (err) {
      return {
        success: false,
        error: err?.response?.data?.error || "Failed to update attendance",
      };
    }
  },
}));

export default useEventStore;
