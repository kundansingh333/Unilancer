// // import { create } from "zustand";
// // import * as jobsApi from "../api/jobsApi";

// // const useJobsStore = create((set, get) => ({
// //   jobs: [],
// //   job: null,
// //   pagination: null,
// //   isLoading: false,
// //   error: null,

// //   fetchJobs: async (params = {}) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await jobsApi.getAllJobs(params);
// //       set({
// //         jobs: res.data.jobs,
// //         pagination: res.data.pagination,
// //         isLoading: false,
// //       });
// //     } catch (err) {
// //       set({
// //         error: err.response?.data?.error || "Failed to fetch jobs",
// //         isLoading: false,
// //       });
// //     }
// //   },

// //   fetchJobById: async (id) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await jobsApi.getJobById(id);
// //       set({ job: res.data.job, isLoading: false });
// //       return res.data;
// //     } catch (err) {
// //       set({
// //         error: err.response?.data?.error || "Failed to fetch job",
// //         isLoading: false,
// //       });
// //     }
// //   },

// //   createJob: async (data) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await jobsApi.createJob(data);
// //       set({ isLoading: false });
// //       return { success: true, job: res.data.job };
// //     } catch (err) {
// //       set({
// //         error: err.response?.data?.error,
// //         isLoading: false,
// //       });
// //       return { success: false, error: err.response?.data?.error };
// //     }
// //   },
// //   /* ---------------- TOGGLE BOOKMARK ---------------- */
// //   toggleBookmark: async (jobId) => {
// //     try {
// //       const res = await jobsApi.toggleBookmark(jobId);
// //       const { isBookmarked } = res.data;

// //       // ✅ Update Job Detail Page
// //       if (get().job?._id === jobId) {
// //         set((state) => ({
// //           job: {
// //             ...state.job,
// //             isBookmarked,
// //           },
// //         }));
// //       }

// //       // ✅ Update Job List Page
// //       set((state) => ({
// //         jobs: state.jobs.map((job) =>
// //           job._id === jobId ? { ...job, isBookmarked } : job
// //         ),
// //       }));

// //       return res.data;
// //     } catch (err) {
// //       throw err;
// //     }
// //   },
// //   fetchMyPostedJobs: async () => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await jobsApi.getMyPostedJobs();
// //       set({
// //         myPostedJobs: res.data.jobs, // ✅ FIX 2
// //         isLoading: false,
// //       });
// //     } catch (err) {
// //       set({
// //         error: err.response?.data?.error || "Failed to fetch posted jobs",
// //         isLoading: false,
// //       });
// //     }
// //   },
// // }));

// // export default useJobsStore;

// import { create } from "zustand";
// import * as jobsApi from "../api/jobsApi";

// const useJobsStore = create((set, get) => ({
//   jobs: [],
//   job: null,
//   myPostedJobs: [], // ✅ FIXED: Initialize myPostedJobs
//   pagination: null,
//   isLoading: false,
//   error: null,

//   fetchJobs: async (params = {}) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await jobsApi.getAllJobs(params);
//       set({
//         jobs: res.data.jobs,
//         pagination: res.data.pagination,
//         isLoading: false,
//       });
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || "Failed to fetch jobs",
//         isLoading: false,
//       });
//     }
//   },

//   fetchJobById: async (id) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await jobsApi.getJobById(id);
//       set({ job: res.data.job, isLoading: false });
//       return res.data;
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || "Failed to fetch job",
//         isLoading: false,
//       });
//     }
//   },

//   createJob: async (data) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await jobsApi.createJob(data);
//       set({ isLoading: false });
//       return { success: true, job: res.data.job };
//     } catch (err) {
//       set({
//         error: err.response?.data?.error,
//         isLoading: false,
//       });
//       return { success: false, error: err.response?.data?.error };
//     }
//   },

//   /* ---------------- TOGGLE BOOKMARK ---------------- */
//   toggleBookmark: async (jobId) => {
//     try {
//       const res = await jobsApi.toggleBookmark(jobId);
//       const { isBookmarked } = res.data;

//       // ✅ Update Job Detail Page
//       if (get().job?._id === jobId) {
//         set((state) => ({
//           job: {
//             ...state.job,
//             isBookmarked,
//           },
//         }));
//       }

//       // ✅ Update Job List Page
//       set((state) => ({
//         jobs: state.jobs.map((job) =>
//           job._id === jobId ? { ...job, isBookmarked } : job
//         ),
//       }));

//       return res.data;
//     } catch (err) {
//       throw err;
//     }
//   },

//   fetchMyPostedJobs: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await jobsApi.getMyPostedJobs();
//       set({
//         myPostedJobs: res.data.jobs || [], // ✅ Added fallback to empty array
//         isLoading: false,
//       });
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || "Failed to fetch posted jobs",
//         isLoading: false,
//         myPostedJobs: [], // ✅ Set to empty array on error
//       });
//     }
//   },

//   // ✅ ADD DELETE JOB FUNCTION
//   deleteJob: async (jobId) => {
//     set({ isLoading: true, error: null });
//     try {
//       await jobsApi.deleteJob(jobId);

//       // Remove from myPostedJobs
//       set((state) => ({
//         myPostedJobs: state.myPostedJobs.filter((job) => job._id !== jobId),
//         isLoading: false,
//       }));

//       return { success: true };
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || "Failed to delete job",
//         isLoading: false,
//       });
//       return { success: false, error: err.response?.data?.error };
//     }
//   },
// }));

// export default useJobsStore;

import { create } from "zustand";
import * as jobsApi from "../api/jobsApi";

const useJobsStore = create((set, get) => ({
  jobs: [],
  job: null,
  myPostedJobs: [], // ✅ FIXED: Initialize myPostedJobs
  pagination: null,
  isLoading: false,
  error: null,
  myApplications: [], // ✅ Added to store user's job applications

  fetchJobs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await jobsApi.getAllJobs(params);
      set({
        jobs: res.data.jobs,
        pagination: res.data.pagination,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch jobs",
        isLoading: false,
      });
    }
  },

  fetchJobById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await jobsApi.getJobById(id);
      set({ job: res.data.job, isLoading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch job",
        isLoading: false,
      });
    }
  },

  createJob: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await jobsApi.createJob(data);
      set({ isLoading: false });
      return { success: true, job: res.data.job };
    } catch (err) {
      set({
        error: err.response?.data?.error,
        isLoading: false,
      });
      return { success: false, error: err.response?.data?.error };
    }
  },

  /* ---------------- TOGGLE BOOKMARK ---------------- */
  toggleBookmark: async (jobId) => {
    try {
      const res = await jobsApi.toggleBookmark(jobId);
      const { isBookmarked } = res.data;

      // ✅ Update Job Detail Page
      if (get().job?._id === jobId) {
        set((state) => ({
          job: {
            ...state.job,
            isBookmarked,
          },
        }));
      }

      // ✅ Update Job List Page
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job._id === jobId ? { ...job, isBookmarked } : job
        ),
      }));

      return res.data;
    } catch (err) {
      throw err;
    }
  },

  fetchMyPostedJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await jobsApi.getMyPostedJobs();
      set({
        myPostedJobs: res.data.jobs || [], // ✅ Added fallback to empty array
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch posted jobs",
        isLoading: false,
        myPostedJobs: [], // ✅ Set to empty array on error
      });
    }
  },

  // ✅ ADD DELETE JOB FUNCTION
  deleteJob: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      await jobsApi.deleteJob(jobId);

      // Remove from myPostedJobs
      set((state) => ({
        myPostedJobs: state.myPostedJobs.filter((job) => job._id !== jobId),
        isLoading: false,
      }));

      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to delete job",
        isLoading: false,
      });
      return { success: false, error: err.response?.data?.error };
    }
  },

  // ✅ ADD UPDATE JOB FUNCTION
  updateJob: async (jobId, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await jobsApi.updateJob(jobId, data);

      // Update in myPostedJobs if exists
      set((state) => ({
        myPostedJobs: state.myPostedJobs.map((job) =>
          job._id === jobId ? res.data.job : job
        ),
        job: res.data.job, // Update single job view
        isLoading: false,
      }));

      return { success: true, job: res.data.job };
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to update job",
        isLoading: false,
      });
      return { success: false, error: err.response?.data?.error };
    }
  },
  fetchMyApplications: async () => {
  set({ isLoading: true, error: null });
  try {
    const res = await jobsApi.getMyApplications();

    set({
      myApplications: res.data.applications || [],
      isLoading: false,
    });
  } catch (err) {
    set({
      error: err.response?.data?.error || "Failed to fetch applications",
      isLoading: false,
      myApplications: [], // fallback
    });
  }
},

}));

export default useJobsStore;
