import { create } from "zustand";
import {
  fetchPendingEvents,
  approveEvent,
  rejectEvent,
  toggleFeatureEvent,
} from "../api/adminEventsApi";

const useAdminEventStore = create((set, get) => ({
  pendingEvents: [],
  loading: false,
  error: null,

  // Get all unapproved events
  loadPendingEvents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchPendingEvents();
      set({ pendingEvents: res.data.events || [] });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Approve event
  approve: async (id) => {
    try {
      const res = await approveEvent(id);
      if (res.data.success) {
        set({
          pendingEvents: get().pendingEvents.filter((e) => e._id !== id),
        });
      }
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  },

  // Reject event
  reject: async (id, reason) => {
    try {
      const res = await rejectEvent(id, reason);
      if (res.data.success) {
        set({
          pendingEvents: get().pendingEvents.filter((e) => e._id !== id),
        });
      }
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  },

  // Feature / Unfeature
  toggleFeature: async (id, isFeatured) => {
    try {
      const res = await toggleFeatureEvent(id, isFeatured);
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    }
  },
}));

export default useAdminEventStore;
