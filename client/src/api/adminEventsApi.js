import api from "./client";

// Get all pending events
export const fetchPendingEvents = () => api.get("/admin/events/pending");

// Approve event
export const approveEvent = (eventId) =>
  api.put(`/admin/events/${eventId}/approve`);

// Reject event
export const rejectEvent = (eventId, reason) =>
  api.put(`/admin/events/${eventId}/reject`, { reason });

// Feature / Unfeature event
export const toggleFeatureEvent = (eventId, isFeatured) =>
  api.put(`/admin/events/${eventId}/feature`, { isFeatured });
