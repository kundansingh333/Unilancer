// // // // src/store/orderStore.js
// // // import { create } from "zustand";
// // // import api from "../api/client";
// // // import useAuthStore from "./authStore";

// // // const useOrderStore = create((set, get) => ({
// // //   orders: [],
// // //   currentOrder: null,
// // //   stats: null,
// // //   isLoading: false,
// // //   error: null,

// // //   // Helpers
// // //   setError: (msg) => set({ error: msg }),

// // //   // GET /api/orders?status=&role=
// // //   fetchOrders: async (filters = {}) => {
// // //     set({ isLoading: true, error: null });
// // //     try {
// // //       const params = new URLSearchParams();
// // //       if (filters.status) params.append("status", filters.status);
// // //       if (filters.role) params.append("role", filters.role);

// // //       const res = await api.get(`/orders?${params.toString()}`);
// // //       set({ orders: res.data.orders || [], isLoading: false });
// // //     } catch (err) {
// // //       console.error("fetchOrders error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to load your orders.";
// // //       set({ error: msg, isLoading: false });
// // //     }
// // //   },

// // //   // GET /api/orders/stats
// // //   fetchOrderStats: async () => {
// // //     set({ isLoading: true, error: null });
// // //     try {
// // //       const res = await api.get("/orders/stats");
// // //       set({ stats: res.data.stats || null, isLoading: false });
// // //     } catch (err) {
// // //       console.error("fetchOrderStats error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to load order stats.";
// // //       set({ error: msg, isLoading: false });
// // //     }
// // //   },

// // //   // GET /api/orders/:id
// // //   fetchOrderById: async (id) => {
// // //     set({ isLoading: true, error: null, currentOrder: null });
// // //     try {
// // //       const res = await api.get(`/orders/${id}`);
// // //       set({ currentOrder: res.data.order, isLoading: false });
// // //     } catch (err) {
// // //       console.error("fetchOrderById error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to load order details.";
// // //       set({ error: msg, isLoading: false });
// // //     }
// // //   },

// // //   // POST /api/orders
// // //   createOrder: async (payload) => {
// // //     set({ isLoading: true, error: null });
// // //     try {
// // //       const res = await api.post("/orders", payload);
// // //       // push newly created order into list (optimistic)
// // //       set((state) => ({
// // //         orders: [res.data.order, ...state.orders],
// // //         isLoading: false,
// // //       }));
// // //       return { success: true, order: res.data.order };
// // //     } catch (err) {
// // //       console.error("createOrder error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to create order.";
// // //       set({ error: msg, isLoading: false });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // PUT /api/orders/:id/accept
// // //   acceptOrder: async (id) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.put(`/orders/${id}/accept`);
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("acceptOrder error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to accept order.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // PUT /api/orders/:id/deliver  { deliverables: [...] }
// // //   deliverWork: async (id, deliverables) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.put(`/orders/${id}/deliver`, {
// // //         deliverables,
// // //       });
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("deliverWork error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to deliver work.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // PUT /api/orders/:id/revision  { reason }
// // //   requestRevision: async (id, reason) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.put(`/orders/${id}/revision`, { reason });
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("requestRevision error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to request revision.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // PUT /api/orders/:id/complete
// // //   completeOrder: async (id) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.put(`/orders/${id}/complete`);
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("completeOrder error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to complete order.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // PUT /api/orders/:id/cancel  { reason }
// // //   cancelOrder: async (id, reason) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.put(`/orders/${id}/cancel`, { reason });
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("cancelOrder error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to cancel order.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // POST /api/orders/:id/dispute  { reason }
// // //   raiseDispute: async (id, reason) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.post(`/orders/${id}/dispute`, { reason });
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("raiseDispute error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to raise dispute.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // POST /api/orders/:id/messages  { content, attachments }
// // //   addOrderMessage: async (id, content, attachments = []) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.post(`/orders/${id}/messages`, {
// // //         content,
// // //         attachments,
// // //       });
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("addOrderMessage error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to send message.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // POST /api/orders/:id/rate  { rating, review }
// // //   rateOrder: async (id, payload) => {
// // //     set({ error: null });
// // //     try {
// // //       const res = await api.post(`/orders/${id}/rate`, payload);
// // //       get()._updateOrderInState(res.data.order);
// // //       return { success: true };
// // //     } catch (err) {
// // //       console.error("rateOrder error:", err);
// // //       const msg = err?.response?.data?.error || "Failed to submit rating.";
// // //       set({ error: msg });
// // //       return { success: false, error: msg };
// // //     }
// // //   },

// // //   // INTERNAL: keep list and currentOrder in sync
// // //   _updateOrderInState: (updated) =>
// // //     set((state) => {
// // //       const orders = state.orders.map((o) =>
// // //         o._id === updated._id ? updated : o
// // //       );
// // //       const currentOrder =
// // //         state.currentOrder && state.currentOrder._id === updated._id
// // //           ? updated
// // //           : state.currentOrder;
// // //       return { orders, currentOrder };
// // //     }),
// // // }));

// // // export default useOrderStore;

// // // src/store/orderStore.js
// // import { create } from "zustand";
// // import api from "../api/client";
// // import * as ordersApi from "../api/ordersApi";

// // const useOrderStore = create((set, get) => ({
// //   // state
// //   currentOrder: null,
// //   isLoading: false,
// //   error: null,

// //   // actions
// //   setError: (err) =>
// //     set({
// //       error:
// //         typeof err === "string" ? err : err?.message || "An error occurred",
// //     }),

// //   fetchOrderById: async (orderId) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.fetchOrderById(orderId);
// //       // backend returns { success: true, order: {...} } or similar
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("fetchOrderById error:", err);
// //       const message =
// //         err?.response?.data?.error || err?.message || "Failed to fetch order";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   acceptOrder: async (orderId) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.acceptOrder(orderId);
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("acceptOrder error:", err);
// //       const message =
// //         err?.response?.data?.error || err?.message || "Failed to accept order";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   deliverWork: async (orderId, deliverables = []) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       // deliverables should be array of {type, name, url, description}
// //       const res = await ordersApi.deliverWork(orderId, { deliverables });
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("deliverWork error:", err);
// //       const message =
// //         err?.response?.data?.error || err?.message || "Failed to deliver work";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   requestRevision: async (orderId, reason = "") => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.requestRevision(orderId, { reason });
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("requestRevision error:", err);
// //       const message =
// //         err?.response?.data?.error ||
// //         err?.message ||
// //         "Failed to request revision";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   completeOrder: async (orderId) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.completeOrder(orderId);
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("completeOrder error:", err);
// //       const message =
// //         err?.response?.data?.error ||
// //         err?.message ||
// //         "Failed to complete order";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   cancelOrder: async (orderId, reason = "") => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.cancelOrder(orderId, { reason });
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("cancelOrder error:", err);
// //       const message =
// //         err?.response?.data?.error || err?.message || "Failed to cancel order";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   raiseDispute: async (orderId, reason = "") => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.raiseDispute(orderId, { reason });
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("raiseDispute error:", err);
// //       const message =
// //         err?.response?.data?.error || err?.message || "Failed to raise dispute";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   addOrderMessage: async (orderId, content) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.addOrderMessage(orderId, { content });
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("addOrderMessage error:", err);
// //       const message =
// //         err?.response?.data?.error || err?.message || "Failed to send message";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },

// //   rateOrder: async (orderId, payload = { rating: 5, review: "" }) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await ordersApi.rateOrder(orderId, payload);
// //       const order = res.data?.order || res.data;
// //       set({ currentOrder: order, isLoading: false });
// //       return { success: true, order };
// //     } catch (err) {
// //       console.error("rateOrder error:", err);
// //       const message =
// //         err?.response?.data?.error || err?.message || "Failed to submit rating";
// //       set({ error: message, isLoading: false });
// //       return { success: false, error: message };
// //     }
// //   },
// // }));

// // export default useOrderStore;

// import { create } from "zustand";
// import * as ordersApi from "../api/ordersApi";

// const useOrderStore = create((set, get) => ({
//   // ---------- STATE ----------
//   orders: [], // <-- FIX: always an array
//   stats: { active: 0, completed: 0, cancelled: 0 }, // <-- FIX: safe defaults
//   currentOrder: null,
//   isLoading: false,
//   error: null,

//   // ---------- HELPERS ----------
//   setError: (err) =>
//     set({
//       error:
//         typeof err === "string" ? err : err?.message || "An error occurred",
//     }),

//   // ---------- FETCH ALL ORDERS ----------
//   fetchOrders: async (query = {}) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.fetchOrders(query);

//       const orders = res?.data?.orders || res?.data || [];

//       set({
//         orders: Array.isArray(orders) ? orders : [], // SAFE ARRAY
//         isLoading: false,
//       });

//       return { success: true, orders };
//     } catch (err) {
//       console.error("fetchOrders error:", err);
//       const message = err?.response?.data?.error || "Failed to fetch orders";

//       set({ error: message, isLoading: false, orders: [] }); // SAFE
//       return { success: false, error: message };
//     }
//   },

//   // ---------- FETCH STATS ----------
//   fetchOrderStats: async () => {
//     try {
//       const res = await ordersApi.fetchOrderStats();
//       const stats = res?.data?.stats || res?.data || {};

//       set({
//         stats: {
//           active: stats.active || 0,
//           completed: stats.completed || 0,
//           cancelled: stats.cancelled || 0,
//         },
//       });
//     } catch (err) {
//       console.error("fetchOrderStats error:", err);
//       // keep previous stats
//     }
//   },

//   // ---------- FETCH ORDER BY ID ----------
//   fetchOrderById: async (orderId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.fetchOrderById(orderId);
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       console.error("fetchOrderById error:", err);
//       const message = err?.response?.data?.error || "Failed to fetch order";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- ACCEPT ORDER ----------
//   acceptOrder: async (orderId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.acceptOrder(orderId);
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message = err?.response?.data?.error || "Failed to accept order";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- DELIVER WORK ----------
//   deliverWork: async (orderId, deliverables = []) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.deliverWork(orderId, { deliverables });
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message = err?.response?.data?.error || "Failed to deliver work";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- REQUEST REVISION ----------
//   requestRevision: async (orderId, reason = "") => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.requestRevision(orderId, { reason });
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message =
//         err?.response?.data?.error || "Failed to request revision";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- COMPLETE ORDER ----------
//   completeOrder: async (orderId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.completeOrder(orderId);
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message = err?.response?.data?.error || "Failed to complete order";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- CANCEL ORDER ----------
//   cancelOrder: async (orderId, reason = "") => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.cancelOrder(orderId, { reason });
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message = err?.response?.data?.error || "Failed to cancel order";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- DISPUTE ----------
//   raiseDispute: async (orderId, reason = "") => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.raiseDispute(orderId, { reason });
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message = err?.response?.data?.error || "Failed to raise dispute";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- MESSAGE ----------
//   addOrderMessage: async (orderId, content) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.addOrderMessage(orderId, { content });
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message = err?.response?.data?.error || "Failed to send message";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },

//   // ---------- RATE ----------
//   rateOrder: async (orderId, payload) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await ordersApi.rateOrder(orderId, payload);
//       const order = res.data?.order || res.data;

//       set({ currentOrder: order, isLoading: false });
//       return { success: true, order };
//     } catch (err) {
//       const message = err?.response?.data?.error || "Failed to submit rating";

//       set({ error: message, isLoading: false });
//       return { success: false, error: message };
//     }
//   },
// }));

// export default useOrderStore;

// src/store/orderStore.js
// src/store/orderStore.js
import { create } from "zustand";
import * as ordersApi from "../api/ordersApi";

const useOrderStore = create((set, get) => ({
  // state
  orders: [], // list for OrdersPage
  stats: null,
  currentOrder: null,
  isLoading: false,
  error: null,

  isStatsLoading: false,
  statsError: null,

  // actions
  setError: (err) =>
    set({
      error:
        typeof err === "string" ? err : err?.message || "An error occurred",
    }),

  // Fetch paginated/filtered orders for OrdersPage
  fetchOrders: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.fetchOrders(query);
      // backend may return { success, orders, meta } or plain array
      const orders = res.data?.orders ?? res.data?.data ?? res.data ?? [];
      set({ orders, isLoading: false });
      return { success: true, orders };
    } catch (err) {
      console.error("fetchOrders error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to fetch orders";
      set({ error: message, isLoading: false, orders: [] });
      return { success: false, error: message };
    }
  },

  // fetchOrderStats: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const res = await ordersApi.fetchOrderStats();
  //     const stats = res.data?.stats ?? res.data ?? null;
  //     set({ stats, isLoading: false });
  //     return { success: true, stats };
  //   } catch (err) {
  //     console.error("fetchOrderStats error:", err);
  //     const message =
  //       err?.response?.data?.error ||
  //       err?.message ||
  //       "Failed to fetch order stats";
  //     set({ error: message, isLoading: false });
  //     return { success: false, error: message };
  //   }
  // },

  fetchOrderStats: async () => {
    try {
      set({ isStatsLoading: true, statsError: null });
      const res = await ordersApi.fetchOrderStats();

      if (!res.data?.success) {
        throw new Error(res.data?.error || "Failed to load stats");
      }

      set({ stats: res.data.stats });
      return res.data.stats;
    } catch (err) {
      console.error("fetchOrderStats error:", err);
      set({
        statsError: err?.response?.data?.error || err.message,
      });
      return null;
    } finally {
      set({ isStatsLoading: false });
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.fetchOrderById(orderId);
      // backend returns { success: true, order: {...} } or similar
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("fetchOrderById error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to fetch order";
      set({ error: message, isLoading: false, currentOrder: null });
      return { success: false, error: message };
    }
  },

  acceptOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.acceptOrder(orderId);
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("acceptOrder error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to accept order";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deliverWork: async (orderId, deliverables = []) => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.deliverWork(orderId, { deliverables });
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("deliverWork error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to deliver work";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  requestRevision: async (orderId, reason = "") => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.requestRevision(orderId, { reason });
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("requestRevision error:", err);
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to request revision";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  completeOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.completeOrder(orderId);
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("completeOrder error:", err);
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to complete order";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  cancelOrder: async (orderId, reason = "") => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.cancelOrder(orderId, { reason });
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("cancelOrder error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to cancel order";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  raiseDispute: async (orderId, reason = "") => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.raiseDispute(orderId, { reason });
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("raiseDispute error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to raise dispute";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  addOrderMessage: async (orderId, content) => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.addOrderMessage(orderId, { content });
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("addOrderMessage error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to send message";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  rateOrder: async (orderId, payload = { rating: 5, review: "" }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.rateOrder(orderId, payload);
      const order = res.data?.order ?? res.data ?? null;
      set({ currentOrder: order, isLoading: false });
      return { success: true, order };
    } catch (err) {
      console.error("rateOrder error:", err);
      const message =
        err?.response?.data?.error || err?.message || "Failed to submit rating";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));

export default useOrderStore;
