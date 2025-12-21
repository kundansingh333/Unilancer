// backend/models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  // ========== BASIC INFO ==========
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },

  description: {
    type: String,
    required: [true, "Job description is required"],
    minlength: [20, "Description must be at least 20 characters"],
    maxlength: [5000, "Description cannot exceed 5000 characters"],
  },

  company: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },

  companyLogo: {
    type: String, // URL to logo image
    default: "https://via.placeholder.com/100",
  },

  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },

  locationType: {
    type: String,
    enum: ["On-site", "Remote", "Hybrid"],
    default: "On-site",
  },

  // ========== JOB TYPE ==========
  jobType: {
    type: String,
    enum: ["Internship", "Full-time", "Part-time", "Contract"],
    required: [true, "Job type is required"],
  },

  duration: {
    type: String, // "3 months", "6 months", etc.
    required: function () {
      return this.jobType === "Internship" || this.jobType === "Contract";
    },
  },

  // ========== COMPENSATION ==========
  stipend: {
    type: Number,
    min: 0,
    required: function () {
      return this.jobType === "Internship";
    },
  },

  ctc: {
    type: Number, // Annual CTC in lakhs
    min: 0,
    required: function () {
      return this.jobType === "Full-time";
    },
  },

  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD", "EUR", "GBP"],
  },

  // ========== REQUIREMENTS ==========
  requirements: {
    branches: [
      {
        type: String,
        enum: ["CSE", "ECE", "ME", "CE", "EE", "IT", "All"],
      },
    ],

    batches: [
      {
        type: Number, // 2024, 2025, etc.
        min: 2020,
        max: 2030,
      },
    ],

    minCGPA: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    backlogAllowed: {
      type: Boolean,
      default: true,
    },

    maxBacklogs: {
      type: Number,
      min: 0,
      default: 0,
    },
  },

  // ========== APPLICATION INFO ==========
  applicationLink: {
    type: String, // External application URL
    match: [/^https?:\/\/.+/, "Please provide a valid URL"],
  },

  applyType: {
    type: String,
    enum: ["internal", "external"], // Apply on platform or redirect to external link
    default: "internal",
  },

  deadline: {
    type: Date,
    required: [true, "Application deadline is required"],
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: "Deadline must be in the future",
    },
  },

  openings: {
    type: Number,
    min: 1,
    default: 1,
  },

  // ========== POSTED BY ==========
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  postedByRole: {
    type: String,
    enum: ["alumni", "faculty", "admin"],
  },

  // ========== APPLICANTS ==========
  applicants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["applied", "shortlisted", "rejected", "accepted"],
        default: "applied",
      },
      resume: {
        type: String, // URL to resume used for this application
      },
      coverLetter: {
        type: String,
        maxlength: 1000,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // ========== BOOKMARKS ==========
  bookmarkedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // ========== TAGS & CATEGORIES ==========
  tags: [
    {
      type: String,
      trim: true,
    },
  ],

  category: {
    type: String,
    enum: [
      "Software",
      "Hardware",
      "Core",
      "Management",
      "Design",
      "Marketing",
      "Finance",
      "Other",
    ],
    default: "Other",
  },

  // ========== STATUS ==========
  status: {
    type: String,
    enum: ["active", "closed", "expired"],
    default: "active",
  },

  isApproved: {
    type: Boolean,
    default: false,
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  approvedAt: {
    type: Date,
  },

  // ========== ADDITIONAL INFO ==========
  benefits: [
    {
      type: String,
      trim: true,
    },
  ],

  responsibilities: [
    {
      type: String,
      trim: true,
    },
  ],

  // ========== VIEWS & STATS ==========
  views: {
    type: Number,
    default: 0,
  },

  totalApplications: {
    type: Number,
    default: 0,
  },

  // ========== TIMESTAMPS ==========
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ========== INDEXES ==========
// jobSchema.index({ title: "text", description: "text", company: "text" });
// jobSchema.index({ postedBy: 1 });
// jobSchema.index({ status: 1, isApproved: 1 });
// jobSchema.index({ deadline: 1 });
// jobSchema.index({ "requirements.branches": 1 });
// jobSchema.index({ jobType: 1 });
// jobSchema.index({ createdAt: -1 });

// ========== MIDDLEWARE ==========

// Update 'updatedAt' before saving
jobSchema.pre("save", function () {
  this.updatedAt = Date.now();
  // next();
});

// Auto-update total applications count
jobSchema.pre("save", function () {
  this.totalApplications = this.applicants.length;
  // next();
});

// Check if deadline has passed and update status
jobSchema.pre("save", function () {
  if (this.deadline < Date.now() && this.status === "active") {
    this.status = "expired";
  }
  // next();
});

// ========== METHODS ==========

// Check if user has already applied
jobSchema.methods.hasUserApplied = function (userId) {
  return this.applicants.some(
    (app) => app.userId.toString() === userId.toString()
  );
};

// Check if user has bookmarked
jobSchema.methods.isBookmarkedBy = function (userId) {
  return this.bookmarkedBy.some((id) => id.toString() === userId.toString());
};

// Get application status for a user
jobSchema.methods.getApplicationStatus = function (userId) {
  const application = this.applicants.find(
    (app) => app.userId.toString() === userId.toString()
  );
  return application ? application.status : null;
};

// Check if job is still accepting applications
jobSchema.methods.isAcceptingApplications = function () {
  return (
    this.status === "active" &&
    this.isApproved &&
    this.deadline > Date.now() &&
    (this.openings === 0 || this.totalApplications < this.openings)
  );
};

// Increment view count
jobSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// ========== VIRTUALS ==========

// Days until deadline
jobSchema.virtual("daysUntilDeadline").get(function () {
  const diff = this.deadline - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Application rate
jobSchema.virtual("applicationRate").get(function () {
  return this.openings > 0
    ? ((this.totalApplications / this.openings) * 100).toFixed(1)
    : 0;
});

// Enable virtuals in JSON
jobSchema.set("toJSON", { virtuals: true });
jobSchema.set("toObject", { virtuals: true });

// ========== STATIC METHODS ==========

// Get active jobs
jobSchema.statics.getActiveJobs = function () {
  return this.find({
    status: "active",
    isApproved: true,
    deadline: { $gt: Date.now() },
  }).sort({ createdAt: -1 });
};

// Get jobs by poster
jobSchema.statics.getJobsByPoster = function (userId) {
  return this.find({ postedBy: userId }).sort({ createdAt: -1 });
};

// Search jobs
jobSchema.statics.searchJobs = function (query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
};

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
