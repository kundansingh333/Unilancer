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
//         requiresApproval: res.data?.requiresApproval,
//       };
//     } catch (err) {
//       console.error("register error:", err);
//       const message =
//         err?.response?.data?.error || "Registration failed. Please try again.";
//       set({ isLoading: false, error: message });
//       return { success: false, error: message };
//     }
//   },

//   // 🔹 NEW: VERIFY OTP
//   verifyOtp: async ({ email, otp }) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await api.post("/auth/verify-otp", { email, otp });
//       set({ isLoading: false, error: null });
//       return {
//         success: true,
//         message: res.data?.message || "Email verified successfully.",
//         requiresApproval: res.data?.requiresApproval,
//       };
//     } catch (err) {
//       console.error("verifyOtp error:", err);
//       const message =
//         err?.response?.data?.error ||
//         "OTP verification failed. Please try again.";
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
// }));

// export default useAuthStore;

// src/store/authStore.js
import { create } from "zustand";
import api from "../api/client";

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("unilancer_token") || null,
  isLoading: false,
  error: null,

  // Load user if token already exists (on app start)
  loadUserFromToken: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data.user, isLoading: false });
    } catch (err) {
      console.error("loadUserFromToken error:", err);
      localStorage.removeItem("unilancer_token");
      set({ user: null, token: null, isLoading: false });
    }
  },

  // LOGIN
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/login", credentials);
      const { token, user } = res.data;

      localStorage.setItem("unilancer_token", token);

      set({
        user,
        token,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      console.error("login error:", err);
      const message =
        err?.response?.data?.error || "Login failed. Please try again.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // REGISTER
  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/register", payload);

      set({ isLoading: false, error: null });

      return {
        success: true,
        message:
          res.data?.message ||
          "Registration successful. Please check your email to verify your account.",
      };
    } catch (err) {
      console.error("register error:", err);
      const message =
        err?.response?.data?.error || "Registration failed. Please try again.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      // await api.post("/auth/logout");
    } catch (e) {
      console.warn("Logout API failed (ignored):", e);
    } finally {
      localStorage.removeItem("unilancer_token");
      set({ user: null, token: null, error: null });
    }
  },

  // ============ NEW: FORGOT PASSWORD ============
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/forgot-password", { email });
      set({ isLoading: false });
      return {
        success: true,
        message:
          res.data?.message ||
          "If that email exists, a reset link has been sent.",
      };
    } catch (err) {
      console.error("forgotPassword error:", err);
      const message =
        err?.response?.data?.error || "Failed to send reset link.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // ============ NEW: RESET PASSWORD ============
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
        message:
          res.data?.message ||
          "Password reset successful. You can now login with your new password.",
      };
    } catch (err) {
      console.error("resetPassword error:", err);
      const message = err?.response?.data?.error || "Password reset failed.";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },
}));

export default useAuthStore;
