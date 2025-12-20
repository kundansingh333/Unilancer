import api from "./client";

export const createEvent = (data) => api.post("/events/create", data);
export const getAllEvents = (params) => api.get("/events/", { params });
export const getEventById = (id) => api.get(`/events/${id}`);
export const registerForEvent = (id, data) =>
  api.post(`/events/${id}/register`, data);
export const unregisterFromEvent = (id) => api.delete(`/events/${id}/register`);
export const getMyOrganizedEvents = () => api.get("/events/my/organized");
export const getMyRegisteredEvents = () => api.get("/events/my/registered");
export const updateEvent = (id, data) => api.put(`/events/${id}/edit`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const fetchEventRegistrations = (id, params) =>
  api.get(`/events/${id}/registrations`, { params });
export const markAttendance = (id, userId, data) =>
  api.put(`/events/${id}/attendance/${userId}`, data);
export const getFeaturedEvents = () => api.get("/events/featured");
// export const uploadEventImage = (file) => {
//   const formData = new FormData();
//   formData.append("image", file);

//   return api.post("/events/upload-image", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };
