// backend/controllers/jobController.js
const Job = require("../models/Job");
const User = require("../models/User");
// const Notification = require("../models/Notification");

// ========== 1. CREATE JOB ==========
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      locationType,
      jobType,
      duration,
      stipend,
      ctc,
      requirements,
      deadline,
      applicationLink,
      applyType,
      tags,
      category,
      benefits,
      responsibilities,
      openings,
    } = req.body;

    // Get user
    const user = await User.findById(req.userId);

    // Validation: Only alumni, faculty, admin can post jobs
    if (!["alumni", "faculty", "admin"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "Only alumni, faculty, or admin can post jobs",
      });
    }

    // Create job
    const job = new Job({
      title,
      description,
      company,
      location,
      locationType,
      jobType,
      duration,
      stipend,
      ctc,
      requirements,
      deadline,
      applicationLink,
      applyType,
      tags,
      category,
      benefits,
      responsibilities,
      openings,
      postedBy: req.userId,
      postedByRole: user.role,
      isApproved: user.role === "admin", // Auto-approve admin posts
    });

    await job.save();

    res.status(201).json({
      success: true,
      message:
        user.role === "admin"
          ? "Job posted successfully"
          : "Job posted successfully and is pending admin approval",
      job,
      requiresApproval: user.role !== "admin",
    });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create job",
    });
  }
};

// ========== 2. GET ALL JOBS ==========
exports.getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      jobType,
      location,
      branch,
      minStipend,
      maxStipend,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query = {
      status: "active",
      isApproved: true,
      deadline: { $gt: Date.now() },
    };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Branch filter
    if (branch) {
      query["requirements.branches"] = { $in: [branch, "All"] };
    }

    // Stipend filter
    if (minStipend || maxStipend) {
      query.stipend = {};
      if (minStipend) query.stipend.$gte = Number(minStipend);
      if (maxStipend) query.stipend.$lte = Number(maxStipend);
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const jobs = await Job.find(query)
      .populate("postedBy", "name email role company profilePicture")
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasMore: skip + jobs.length < total,
      },
    });
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch jobs",
    });
  }
};

// ========== 3. GET SINGLE JOB ==========
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("postedBy", "name email role company profilePicture jobTitle")
      .populate(
        "applicants.userId",
        "name email branch year rollNumber profilePicture"
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Increment view count (but not for job poster)
    if (req.userId && job.postedBy._id.toString() !== req.userId) {
      await job.incrementViews();
    }

    // Check if current user has applied or bookmarked
    const userStatus = req.userId
      ? {
          hasApplied: job.hasUserApplied(req.userId),
          isBookmarked: job.isBookmarkedBy(req.userId),
          applicationStatus: job.getApplicationStatus(req.userId),
        }
      : null;

    res.json({
      success: true,
      job,
      userStatus,
    });
  } catch (err) {
    console.error("Get job error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch job",
    });
  }
};

// ========== 4. UPDATE JOB ==========
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (job.postedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this job",
      });
    }

    // Don't allow updating certain fields
    delete updates.postedBy;
    delete updates.applicants;
    delete updates.isApproved;

    // Update job
    Object.assign(job, updates);
    await job.save();

    res.json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    console.error("Update job error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update job",
    });
  }
};

// ========== 5. DELETE JOB ==========
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (job.postedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete job",
    });
  }
};

// ========== 6. APPLY FOR JOB ==========
exports.applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { resume, coverLetter } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Check if job accepts applications
    if (!job.isAcceptingApplications()) {
      return res.status(400).json({
        success: false,
        error: "Job is not accepting applications",
      });
    }

    // Check if already applied
    if (job.hasUserApplied(req.userId)) {
      return res.status(400).json({
        success: false,
        error: "You have already applied for this job",
      });
    }

    // Check if user is a student
    const user = await User.findById(req.userId);
    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can apply for jobs",
      });
    }

    // Check eligibility based on requirements
    const { branches, batches, minCGPA } = job.requirements;

    // Branch check
    if (
      branches.length > 0 &&
      !branches.includes("All") &&
      !branches.includes(user.branch)
    ) {
      return res.status(403).json({
        success: false,
        error: `This job is only for ${branches.join(", ")} students`,
      });
    }

    // Add application
    job.applicants.push({
      userId: req.userId,
      status: "applied",
      resume: resume || user.resume,
      coverLetter,
      appliedAt: Date.now(),
    });

    await job.save();

    // Create notification for job poster
    /* 
    const notification = new Notification({
      userId: job.postedBy,
      type: 'job',
      title: 'New Job Application',
      description: `${user.name} applied for ${job.title}`,
      relatedId: job._id,
      relatedModel: 'Job'
    });
    await notification.save();
    */

    res.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to submit application",
    });
  }
};

// ========== 7. GET JOB APPLICANTS ==========
exports.getJobApplicants = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const job = await Job.findById(id).populate(
      "applicants.userId",
      "name email branch year rollNumber profilePicture resume skills"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (job.postedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view applicants",
      });
    }

    // Filter by status if provided
    let applicants = job.applicants;
    if (status) {
      applicants = applicants.filter((app) => app.status === status);
    }

    res.json({
      success: true,
      applicants,
      total: applicants.length,
    });
  } catch (err) {
    console.error("Get applicants error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch applicants",
    });
  }
};

// ========== 8. UPDATE APPLICATION STATUS ==========
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id, applicantId } = req.params;
    const { status } = req.body;

    if (!["applied", "shortlisted", "rejected", "accepted"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (job.postedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    // Find and update applicant
    const applicant = job.applicants.find(
      (app) => app.userId.toString() === applicantId
    );

    if (!applicant) {
      return res.status(404).json({
        success: false,
        error: "Applicant not found",
      });
    }

    applicant.status = status;
    applicant.updatedAt = Date.now();

    await job.save();

    // Create notification for applicant
    /* 
    const notification = new Notification({
      userId: applicantId,
      type: 'job',
      title: 'Application Status Updated',
      description: `Your application for ${job.title} has been ${status}`,
      relatedId: job._id,
      relatedModel: 'Job'
    });
    await notification.save();
    */

    res.json({
      success: true,
      message: "Application status updated",
      applicant,
    });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update status",
    });
  }
};

// ========== 9. BOOKMARK JOB ==========
exports.bookmarkJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    const isBookmarked = job.isBookmarkedBy(req.userId);

    if (isBookmarked) {
      // Remove bookmark
      job.bookmarkedBy = job.bookmarkedBy.filter(
        (userId) => userId.toString() !== req.userId
      );
    } else {
      // Add bookmark
      job.bookmarkedBy.push(req.userId);
    }

    await job.save();

    res.json({
      success: true,
      message: isBookmarked ? "Bookmark removed" : "Job bookmarked",
      isBookmarked: !isBookmarked,
    });
  } catch (err) {
    console.error("Bookmark error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to bookmark job",
    });
  }
};

// ========== 10. GET BOOKMARKED JOBS ==========
exports.getBookmarkedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      bookmarkedBy: req.userId,
      status: "active",
      isApproved: true,
    })
      .populate("postedBy", "name email role company profilePicture")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (err) {
    console.error("Get bookmarks error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookmarked jobs",
    });
  }
};

// ========== 11. GET MY POSTED JOBS ==========
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId })
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (err) {
    console.error("Get my jobs error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your jobs",
    });
  }
};

// ========== 12. GET MY APPLICATIONS ==========
exports.getMyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      "applicants.userId": req.userId,
    })
      .populate("postedBy", "name email role company profilePicture")
      .sort({ "applicants.appliedAt": -1 });

    // Extract application details
    const applications = jobs.map((job) => {
      const application = job.applicants.find(
        (app) => app.userId.toString() === req.userId
      );

      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          deadline: job.deadline,
          postedBy: job.postedBy,
        },
        application: {
          status: application.status,
          appliedAt: application.appliedAt,
          updatedAt: application.updatedAt,
        },
      };
    });

    res.json({
      success: true,
      applications,
      total: applications.length,
    });
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your applications",
    });
  }
};

module.exports = exports;
