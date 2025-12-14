// src/store/gigStore.js
import { create } from "zustand";
import api from "../api/client";

const useGigStore = create((set, get) => ({
  myGigs: [],
  isLoading: false,
  error: null,

  // Get all gigs created by logged-in user
  fetchMyGigs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/gigs/my/gigs");

      const gigs = res.data?.gigs || res.data?.data || res.data || [];

      set({ myGigs: gigs, isLoading: false });
    } catch (err) {
      console.error("fetchMyGigs error:", err);
      const message = err?.response?.data?.error || "Failed to load your gigs.";
      set({ error: message, isLoading: false });
    }
  },

  // Create a new gig (for when you build create page)
  createGig: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/gigs", payload);
      const newGig = res.data?.gig || res.data;

      // add on top
      set((state) => ({
        myGigs: [newGig, ...state.myGigs],
        isLoading: false,
      }));

      return { success: true, gig: newGig };
    } catch (err) {
      console.error("createGig error:", err);
      const message = err?.response?.data?.error || "Failed to create gig.";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update an existing gig
  updateGig: async (gigId, payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/gigs/${gigId}`, payload);
      const updatedGig = res.data?.gig || res.data;

      set((state) => ({
        myGigs: state.myGigs.map((g) => (g._id === gigId ? updatedGig : g)),
        isLoading: false,
      }));

      return { success: true, gig: updatedGig };
    } catch (err) {
      console.error("updateGig error:", err);
      const message = err?.response?.data?.error || "Failed to update gig.";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Pause / Resume gig
  toggleGigStatus: async (gigId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/gigs/${gigId}/status`);
      const updatedGig = res.data?.gig || res.data;

      set((state) => ({
        myGigs: state.myGigs.map((g) => (g._id === gigId ? updatedGig : g)),
        isLoading: false,
      }));

      return { success: true, gig: updatedGig };
    } catch (err) {
      console.error("toggleGigStatus error:", err);
      const message =
        err?.response?.data?.error || "Failed to update gig status.";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Delete gig
  deleteGig: async (gigId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/gigs/${gigId}`);

      set((state) => ({
        myGigs: state.myGigs.filter((g) => g._id !== gigId),
        isLoading: false,
      }));

      return { success: true };
    } catch (err) {
      console.error("deleteGig error:", err);
      const message = err?.response?.data?.error || "Failed to delete gig.";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));

export default useGigStore;
