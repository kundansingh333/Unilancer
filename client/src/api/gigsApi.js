// src/api/gigsApi.js
import api from "./client";

// PUBLIC

export const fetchGigs = (params = {}) => api.get("/gigs", { params }); // { page, limit, search, ... }

export const fetchTopRatedGigs = (limit = 10) =>
  api.get("/gigs/top-rated", { params: { limit } });

export const fetchFeaturedGigs = () => api.get("/gigs/featured");

export const fetchGigById = (id) => api.get(`/gigs/${id}`);

export const fetchFreelancerGigs = (freelancerId) =>
  api.get(`/gigs/freelancer/${freelancerId}`);

// PROTECTED

export const fetchMyGigs = () => api.get("/gigs/my/gigs");

export const createGig = (payload) => api.post("/gigs", payload);

export const updateGig = (id, payload) => api.put(`/gigs/${id}`, payload);

export const deleteGig = (id) => api.delete(`/gigs/${id}`);

export const toggleGigStatus = (id, data) =>
  api.put(`/gigs/${id}/status`, data);

export const addGigReview = (id, data) => api.post(`/gigs/${id}/review`, data);

export const markReviewHelpful = (gigId, reviewId) =>
  api.put(`/gigs/${gigId}/reviews/${reviewId}/helpful`);

export const fetchGigStats = (id) => api.get(`/gigs/${id}/stats`);
