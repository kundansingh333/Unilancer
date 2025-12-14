// // // src/api/ordersApi.js
// // import api from "../api/client";

// // export const createOrder = (payload) => api.post("/orders", payload);
// // export const fetchOrderById = (id) => api.get(`/orders/${id}`);
// // export const getMyOrders = (params) => api.get("/orders", { params });

// // export const acceptOrder = (id) => api.put(`/orders/${id}/accept`);
// // export const deliverOrder = (id, payload) =>
// //   api.put(`/orders/${id}/deliver`, payload);
// // export const requestRevision = (id, payload) =>
// //   api.put(`/orders/${id}/revision`, payload);
// // export const completeOrder = (id) => api.put(`/orders/${id}/complete`);
// // export const cancelOrder = (id, payload) =>
// //   api.put(`/orders/${id}/cancel`, payload);
// // export const raiseDispute = (id, payload) =>
// //   api.post(`/orders/${id}/dispute`, payload);

// // // helper (optional) for messages
// // export const addOrderMessage = (id, payload) =>
// //   api.post(`/orders/${id}/messages`, payload);

// // src/api/ordersApi.js
// import api from "./client";

// /**
//  * Note: 'api' is your axios instance (src/api/client.js) which should attach
//  * Authorization header if token exists — keep that.
//  */

// export const fetchOrderById = (orderId) => api.get(`/orders/${orderId}`);

// export const acceptOrder = (orderId) => api.put(`/orders/${orderId}/accept`);

// export const deliverWork = (orderId, payload) =>
//   api.put(`/orders/${orderId}/deliver`, payload);

// export const requestRevision = (orderId, payload) =>
//   api.put(`/orders/${orderId}/revision`, payload);

// export const completeOrder = (orderId) =>
//   api.put(`/orders/${orderId}/complete`);

// export const cancelOrder = (orderId, payload) =>
//   api.put(`/orders/${orderId}/cancel`, payload);

// export const raiseDispute = (orderId, payload) =>
//   api.post(`/orders/${orderId}/dispute`, payload);

// export const addOrderMessage = (orderId, payload) =>
//   api.post(`/orders/${orderId}/messages`, payload);

// export const rateOrder = (orderId, payload) =>
//   api.post(`/orders/${orderId}/rate`, payload);

// export const fetchOrders = (query = {}) => {
//   return api.get("/orders", { params: query });
// };

// export const fetchOrderStats = () => {
//   return api.get("/orders/stats");
// };

// // Additional helpers
// export const createOrder = (payload) => api.post(`/orders`, payload);
// export const getMyOrders = (params) => api.get(`/orders`, { params });
// export const getOrderStats = () => api.get(`/orders/stats`);

// src/api/ordersApi.js

// import api from "../api/client";

// /**
//  * Orders API helpers
//  * All functions return the axios promise so your store can read res.data
//  */

// export const fetchOrders = (query = {}) => {
//   // query: { status, role, page, limit, ... }
//   return api.get("/orders", { params: query });
// };

// export const fetchOrderStats = () => {
//   return api.get("/orders/stats");
// };

// export const fetchOrderById = (orderId) => {
//   return api.get(`/orders/${orderId}`);
// };

// export const createOrder = (payload) => {
//   // payload example: { gigId, packageType, description, requirements, paymentMethod, transactionId }
//   return api.post(`/orders`, payload);
// };

// export const acceptOrder = (orderId) => {
//   return api.put(`/orders/${orderId}/accept`);
// };

// export const deliverWork = (orderId, payload) => {
//   // payload: { deliverables: [{type,name,url,description}, ...] }
//   return api.put(`/orders/${orderId}/deliver`, payload);
// };

// export const requestRevision = (orderId, payload) => {
//   // payload: { reason }
//   return api.put(`/orders/${orderId}/revision`, payload);
// };

// export const completeOrder = (orderId) => {
//   return api.put(`/orders/${orderId}/complete`);
// };

// export const cancelOrder = (orderId, payload) => {
//   // payload: { reason }
//   return api.put(`/orders/${orderId}/cancel`, payload);
// };

// export const raiseDispute = (orderId, payload) => {
//   // payload: { reason }
//   return api.post(`/orders/${orderId}/dispute`, payload);
// };

// export const addOrderMessage = (orderId, payload) => {
//   // payload: { content, attachments? }
//   return api.post(`/orders/${orderId}/messages`, payload);
// };

// export const rateOrder = (orderId, payload) => {
//   // payload: { rating, review }
//   return api.post(`/orders/${orderId}/rate`, payload);
// };

// src/api/ordersApi.js
import api from "./client";

/**
 * Orders API wrapper
 * All functions return axios promises (so store can inspect res.data)
 */

export const fetchOrders = (query = {}) => {
  // query: { status, role, page, limit, ... }
  return api.get("/orders", { params: query });
};

export const fetchOrderStats = () => {
  return api.get("/orders/stats");
};

export const fetchOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const createOrder = (payload) => {
  // payload includes: gigId, packageType, description, requirements, paymentMethod, transactionId, etc.
  return api.post("/orders", payload);
};

export const acceptOrder = (orderId) => {
  return api.put(`/orders/${orderId}/accept`);
};

export const deliverWork = (orderId, payload) => {
  // payload: { deliverables: [ { type, name, url, description }, ... ] }
  return api.put(`/orders/${orderId}/deliver`, payload);
};

export const requestRevision = (orderId, payload) => {
  // payload: { reason }
  return api.put(`/orders/${orderId}/revision`, payload);
};

export const completeOrder = (orderId) => {
  return api.put(`/orders/${orderId}/complete`);
};

export const cancelOrder = (orderId, payload) => {
  // payload: { reason }
  return api.put(`/orders/${orderId}/cancel`, payload);
};

export const raiseDispute = (orderId, payload) => {
  // payload: { reason }
  return api.post(`/orders/${orderId}/dispute`, payload);
};

export const addOrderMessage = (orderId, payload) => {
  // payload: { content, attachments? }
  return api.post(`/orders/${orderId}/messages`, payload);
};

export const rateOrder = (orderId, payload) => {
  // payload: { rating, review }
  return api.post(`/orders/${orderId}/rate`, payload);
};
