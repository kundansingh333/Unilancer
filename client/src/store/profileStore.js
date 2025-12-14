// // src/store/profileStore.js
// import { create } from "zustand";
// import api from "../api/client";

// const useProfileStore = create((set) => ({
//   isSaving: false,
//   error: null,
//   success: null,

//   clearStatus: () => set({ error: null, success: null }),

//   updateProfile: async (payload) => {
//     set({ isSaving: true, error: null, success: null });
//     try {
//       const res = await api.put("/users/profile", payload);

//       set({
//         isSaving: false,
//         success: res.data?.message || "Profile updated successfully",
//       });

//       // If you want, you can refresh /auth/me elsewhere after this
//       return { success: true, data: res.data };
//     } catch (err) {
//       console.error("updateProfile error:", err);
//       const message = err?.response?.data?.error || "Failed to update profile";
//       set({ isSaving: false, error: message });
//       return { success: false, error: message };
//     }
//   },
// }));

// export default useProfileStore;

import { create } from "zustand";
import api from "../api/client";

const useProfileStore = create((set) => ({
  isSaving: false,
  error: null,
  success: null,

  /* ---------------- CLEAR STATUS ---------------- */
  clearStatus: () =>
    set({
      error: null,
      success: null,
    }),

  /* ---------------- UPDATE PROFILE ---------------- */
  updateProfile: async (payload) => {
    // reset state before request
    set({
      isSaving: true,
      error: null,
      success: null,
    });

    try {
      const res = await api.put("/users/profile", payload);

      const message = res?.data?.message || "Profile updated successfully";

      set({
        isSaving: false,
        success: message,
      });

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      console.error("❌ updateProfile error:", err);

      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to update profile";

      set({
        isSaving: false,
        error: message,
      });

      return {
        success: false,
        error: message,
      };
    }
  },
}));

export default useProfileStore;
