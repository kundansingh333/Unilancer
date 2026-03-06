import api from "./client";

export const fetchDashboardStats = () => api.get("/admin/stats");
export const fetchUserGrowth = (period) => api.get(`/admin/user-growth?period=${period}`);
export const fetchRevenueAnalytics = (period) => api.get(`/admin/revenue?period=${period}`);

export const fetchPendingUsers = () => api.get("/admin/users/pending");
export const approveUser = (id) => api.put(`/admin/users/${id}/approve`);
export const rejectUser = (id, reason) => api.put(`/admin/users/${id}/reject`, { reason });

export const fetchPendingGigs = () => api.get("/admin/gigs/pending");
export const approveGig = (id) => api.put(`/admin/gigs/${id}/approve`);
export const rejectGig = (id, reason) => api.put(`/admin/gigs/${id}/reject`, { reason });

export const fetchPendingJobs = () => api.get("/admin/jobs/pending");
export const approveJob = (id) => api.put(`/admin/jobs/${id}/approve`);
export const rejectJob = (id, reason) => api.put(`/admin/jobs/${id}/reject`, { reason });

export const getAllUsers = (params) => api.get("/admin/users", { params });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleBlockUser = (id) => api.put(`/admin/users/${id}/block`);

export const fetchDeletedUsers = () => api.get("/admin/deleted-users");

export const fetchDisputedOrders = () => api.get("/admin/orders/disputed");
export const adminSendOrderMessage = (id, content) => api.post(`/admin/orders/${id}/message`, { content });
