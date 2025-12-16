import api from "./client";

// CREATE
export const createJob = (data) => api.post("/jobs/create", data);

// READ
export const getAllJobs = (params) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);

// UPDATE / DELETE
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// APPLY
export const applyForJob = (id, data) => api.post(`/jobs/${id}/apply`, data);

// BOOKMARK
export const toggleBookmark = (id) => api.post(`/jobs/${id}/bookmark`);

// MY DATA
export const getMyPostedJobs = () => api.get("/jobs/my/posted");
export const getMyApplications = () => api.get("/jobs/my/applications");
export const getBookmarkedJobs = () => api.get("/jobs/my/bookmarks");

// APPLICANTS
export const getJobApplicants = (id, params) =>
  api.get(`/jobs/${id}/applicants`, { params });

export const updateApplicationStatus = (id, applicantId, data) =>
  api.put(`/jobs/${id}/applicants/${applicantId}`, data);

// frontend/src/api/jobsApi.js
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   withCredentials: true,
// });

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ========== JOB APIs ==========

// // Get all jobs
// export const getAllJobs = (params) => api.get("/jobs", { params });

// // Get single job
// export const getJobById = (id) => api.get(`/jobs/${id}`);

// // Create job
// export const createJob = (data) => api.post("/jobs", data);

// // Update job
// export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);

// // Delete job
// export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// // Get my posted jobs
// export const getMyPostedJobs = () => api.get("/jobs/my-jobs");

// // Get my applied jobs
// export const getMyAppliedJobs = () => api.get("/jobs/my-applications");

// // Apply to job
// export const applyToJob = (id, data) => api.post(`/jobs/${id}/apply`, data);

// // Withdraw application
// export const withdrawApplication = (id) => api.delete(`/jobs/${id}/apply`);

// // Get job applicants (for job poster)
// export const getJobApplicants = (id, params) =>
//   api.get(`/jobs/${id}/applicants`, { params });

// // Update application status (for job poster)
// export const updateApplicationStatus = (jobId, applicantId, data) =>
//   api.put(`/jobs/${jobId}/applicants/${applicantId}`, data);

// // Toggle bookmark
// export const toggleBookmark = (id) => api.post(`/jobs/${id}/bookmark`);

// // Get bookmarked jobs
// export const getBookmarkedJobs = () => api.get("/jobs/bookmarks");

// export default api;
