import { create } from "zustand";
import {
  fetchDashboardStats,
  fetchPendingUsers,
  approveUser,
  rejectUser,
  fetchPendingGigs,
  approveGig,
  rejectGig,
  fetchDisputedOrders,
} from "../api/adminApi";

const useAdminStore = create((set, get) => ({
  stats: null,
  pendingUsers: [],
  pendingGigs: [],
  disputedOrders: [],
  loading: false,
  error: null,

  // Dashboard Stats
  loadDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchDashboardStats();
      if (res.data.success) {
        set({ stats: res.data.stats });
      }
    } catch (err) {
      set({ error: err.response?.data?.error || err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Users
  loadPendingUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchPendingUsers();
      if (res.data.success) {
        set({ pendingUsers: res.data.users || [] });
      }
    } catch (err) {
      set({ error: err.response?.data?.error || err.message });
    } finally {
      set({ loading: false });
    }
  },

  approveUserById: async (id) => {
    try {
      const res = await approveUser(id);
      if (res.data.success) {
        set({
          pendingUsers: get().pendingUsers.filter((u) => u._id !== id),
        });
      }
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },

  rejectUserById: async (id, reason) => {
    try {
      const res = await rejectUser(id, reason);
      if (res.data.success) {
        set({
          pendingUsers: get().pendingUsers.filter((u) => u._id !== id),
        });
      }
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },

  // Gigs
  loadPendingGigs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchPendingGigs();
      if (res.data.success) {
        set({ pendingGigs: res.data.gigs || [] });
      }
    } catch (err) {
      set({ error: err.response?.data?.error || err.message });
    } finally {
      set({ loading: false });
    }
  },

  approveGigById: async (id) => {
    try {
      const res = await approveGig(id);
      if (res.data.success) {
        set({
          pendingGigs: get().pendingGigs.filter((g) => g._id !== id),
        });
      }
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },

  rejectGigById: async (id, reason) => {
    try {
      const res = await rejectGig(id, reason);
      if (res.data.success) {
        set({
          pendingGigs: get().pendingGigs.filter((g) => g._id !== id),
        });
      }
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  },

  // Disputes
  loadDisputedOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchDisputedOrders();
      if (res.data.success) {
        set({ disputedOrders: res.data.orders || [] });
      }
    } catch (err) {
      set({ error: err.response?.data?.error || err.message });
    } finally {
      set({ loading: false });
    }
  },

}));

export default useAdminStore;
