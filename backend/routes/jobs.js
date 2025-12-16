// backend/routes/jobs.js
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

// ========== PUBLIC ROUTES ==========

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs (with filters & pagination)
 * @access  Public
 * @query   page, limit, search, jobType, location, branch, minStipend, maxStipend, sortBy, order
 */
router.get("/", jobController.getAllJobs);

// ========== PROTECTED ROUTES (All authenticated users) ==========

/**
 * @route   GET /api/jobs/my/bookmarks
 * @desc    Get all bookmarked jobs
 * @access  Private
 */
router.get("/my/bookmarks", auth, jobController.getBookmarkedJobs);

/**
 * @route   GET /api/jobs/my/applications
 * @desc    Get all my job applications
 * @access  Private (Students)
 */
router.get(
  "/my/applications",
  auth,
  roleAuth("student"),
  jobController.getMyApplications
);

/**
 * @route   GET /api/jobs/my/posted
 * @desc    Get all jobs posted by me
 * @access  Private (Alumni, Faculty, Admin)
 */
router.get(
  "/my/posted",
  auth,
  roleAuth("alumni", "faculty", "admin"),
  jobController.getMyJobs
);

/**
 * @route   POST /api/jobs
 * @desc    Create a new job
 * @access  Private (Alumni, Faculty, Admin)
 * @body    { title, description, company, location, jobType, requirements, deadline, ... }
 */
router.post(
  "/create",
  auth,
  roleAuth("alumni", "faculty", "admin"),
  jobController.createJob
);

/**
 * @route   POST /api/jobs/:id/bookmark
 * @desc    Bookmark or unbookmark a job
 * @access  Private
 */
router.post("/:id/bookmark", auth, jobController.bookmarkJob);

// ========== JOB CREATION (Alumni, Faculty, Admin only) ==========

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update a job
 * @access  Private (Job owner or Admin)
 */
router.put(
  "/:id",
  auth,
  roleAuth("alumni", "faculty", "admin"),
  jobController.updateJob
);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete a job
 * @access  Private (Job owner or Admin)
 */
router.delete(
  "/:id",
  auth,
  roleAuth("alumni", "faculty", "admin"),
  jobController.deleteJob
);

// ========== JOB APPLICATIONS (Students only) ==========

/**
 * @route   POST /api/jobs/:id/apply
 * @desc    Apply for a job
 * @access  Private (Students only)
 * @body    { resume, coverLetter }
 */
router.post("/:id/apply", auth, roleAuth("student"), jobController.applyForJob);

// ========== APPLICANT MANAGEMENT (Job owner or Admin) ==========

/**
 * @route   GET /api/jobs/:id/applicants
 * @desc    Get all applicants for a job
 * @access  Private (Job owner or Admin)
 * @query   status (applied, shortlisted, rejected, accepted)
 */
router.get(
  "/:id/applicants",
  auth,
  roleAuth("alumni", "faculty", "admin"),
  jobController.getJobApplicants
);

/**
 * @route   PUT /api/jobs/:id/applicants/:applicantId
 * @desc    Update application status
 * @access  Private (Job owner or Admin)
 * @body    { status }
 */
router.put(
  "/:id/applicants/:applicantId",
  auth,
  roleAuth("alumni", "faculty", "admin"),
  jobController.updateApplicationStatus
);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get single job by ID
 * @access  Public
 */
router.get("/:id", jobController.getJobById);

module.exports = router;
