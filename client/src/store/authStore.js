// // src/store/authStore.js
// import { create } from "zustand";
// import api from "../api/client";

// const useAuthStore = create((set, get) => ({
//   user: null,
//   token: localStorage.getItem("unilancer_token") || null,
//   isLoading: false,
//   error: null,

//   // Load user if token already exists (on app start)
//   loadUserFromToken: async () => {
//     const token = get().token;
//     if (!token) return;

//     set({ isLoading: true, error: null });
//     try {
//       const res = await api.get("/auth/me");
//       set({ user: res.data.user, isLoading: false });
//     } catch (err) {
//       console.error("loadUserFromToken error:", err);
//       localStorage.removeItem("unilancer_token");
//       set({ user: null, token: null, isLoading: false });
//     }
//   },

//   // LOGIN
//   login: async (credentials) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await api.post("/auth/login", credentials);
//       const { token, user } = res.data;

//       localStorage.setItem("unilancer_token", token);

//       set({
//         user,
//         token,
//         isLoading: false,
//         error: null,
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("login error:", err);
//       const message =
//         err?.response?.data?.error || "Login failed. Please try again.";
//       set({ isLoading: false, error: message });
//       return { success: false, error: message };
//     }
//   },

//   // REGISTER
//   register: async (payload) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await api.post("/auth/register", payload);

//       set({ isLoading: false, error: null });

//       return {
//         success: true,
//         message:
//           res.data?.message ||
//           "Registration successful. Please check your email to verify your account.",
//       };
//     } catch (err) {
//       console.error("register error:", err);
//       const message =
//         err?.response?.data?.error || "Registration failed. Please try again.";
//       set({ isLoading: false, error: message });
//       return { success: false, error: message };
//     }
//   },

//   // LOGOUT
//   logout: async () => {
//     try {
//       // await api.post("/auth/logout");
//     } catch (e) {
//       console.warn("Logout API failed (ignored):", e);
//     } finally {
//       localStorage.removeItem("unilancer_token");
//       set({ user: null, token: null, error: null });
//     }
//   },

//   // ============ NEW: FORGOT PASSWORD ============
//   forgotPassword: async (email) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await api.post("/auth/forgot-password", { email });
//       set({ isLoading: false });
//       return {
//         success: true,
//         message:
//           res.data?.message ||
//           "If that email exists, a reset link has been sent.",
//       };
//     } catch (err) {
//       console.error("forgotPassword error:", err);
//       const message =
//         err?.response?.data?.error || "Failed to send reset link.";
//       set({ isLoading: false, error: message });
//       return { success: false, error: message };
//     }
//   },

//   // ============ NEW: RESET PASSWORD ============
//   resetPassword: async ({ token, newPassword }) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await api.post("/auth/reset-password", {
//         token,
//         newPassword,
//       });
//       set({ isLoading: false });
//       return {
//         success: true,
//         message:
//           res.data?.message ||
//           "Password reset successful. You can now login with your new password.",
//       };
//     } catch (err) {
//       console.error("resetPassword error:", err);
//       const message = err?.response?.data?.error || "Password reset failed.";
//       set({ isLoading: false, error: message });
//       return { success: false, error: message };
//     }
//   },
// }));

// export default useAuthStore;

// src/store/authStore.js
import { create } from "zustand";
import api from "../api/client";

const useAuthStore = create((set, get) => ({
  // 🔹 hydrate from localStorage
  user: JSON.parse(localStorage.getItem("unilancer_user")) || null,
  token: localStorage.getItem("unilancer_token") || null,

  isLoading: false,
  error: null,

  // ================= LOAD USER FROM TOKEN =================
  loadUserFromToken: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/auth/me");

      // 🔹 persist user
      localStorage.setItem("unilancer_user", JSON.stringify(res.data.user));

      set({ user: res.data.user, isLoading: false });
    } catch (err) {
      console.error("loadUserFromToken error:", err);
      localStorage.removeItem("unilancer_token");
      localStorage.removeItem("unilancer_user");
      set({ user: null, token: null, isLoading: false });
    }
  },

  // ================= LOGIN =================
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/login", credentials);
      const { token, user } = res.data;

      // 🔹 persist both token & user
      localStorage.setItem("unilancer_token", token);
      localStorage.setItem("unilancer_user", JSON.stringify(user));

      set({
        user,
        token,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.error || "Login failed. Please try again.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // ================= REGISTER =================
  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/register", payload);
      set({ isLoading: false, error: null });

      return {
        success: true,
        message:
          res.data?.message ||
          "Registration successful. Please verify your email.",
      };
    } catch (err) {
      const message = err?.response?.data?.error || "Registration failed.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      // optional API call
    } finally {
      localStorage.removeItem("unilancer_token");
      localStorage.removeItem("unilancer_user");
      set({ user: null, token: null, error: null });
    }
  },

  // ================= FORGOT PASSWORD =================
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/forgot-password", { email });
      set({ isLoading: false });
      return {
        success: true,
        message: res.data?.message || "Reset link sent if email exists.",
      };
    } catch (err) {
      const message =
        err?.response?.data?.error || "Failed to send reset link.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // ================= RESET PASSWORD =================
  resetPassword: async ({ token, newPassword }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      set({ isLoading: false });
      return {
        success: true,
        message: res.data?.message || "Password reset successful.",
      };
    } catch (err) {
      const message = err?.response?.data?.error || "Password reset failed.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },
}));

export default useAuthStore;
