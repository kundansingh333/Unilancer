// backend/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  // ========== BASIC INFO ==========
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },

  description: {
    type: String,
    required: [true, "Event description is required"],
    minlength: [20, "Description must be at least 20 characters"],
    maxlength: [3000, "Description cannot exceed 3000 characters"],
  },

  eventType: {
    type: String,
    enum: [
      "hackathon",
      "workshop",
      "tech-talk",
      "fest",
      "meetup",
      "seminar",
      "webinar",
      "competition",
      "other",
    ],
    required: [true, "Event type is required"],
  },

  // ========== DATE & TIME ==========
  dateTime: {
    type: Date,
    required: [true, "Event date and time is required"],
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: "Event date must be in the future",
    },
  },

  endDateTime: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || value > this.dateTime;
      },
      message: "End time must be after start time",
    },
  },

  duration: {
    type: String, // "2 hours", "1 day", "3 days"
    required: [true, "Event duration is required"],
  },

  // ========== LOCATION ==========
  venue: {
    type: String,
    required: [true, "Venue is required"],
    trim: true,
  },

  venueType: {
    type: String,
    enum: ["On-campus", "Off-campus", "Online", "Hybrid"],
    default: "On-campus",
  },

  venueAddress: {
    type: String,
    trim: true,
  },

  meetingLink: {
    type: String, // For online events
    match: [/^https?:\/\/.+/, "Please provide a valid URL"],
  },

  // ========== ORGANIZER INFO ==========
  organizer: {
    type: String,
    required: [true, "Organizer name is required"],
    trim: true,
  },

  organizerContact: {
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
  },

  organizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  organizedByRole: {
    type: String,
    enum: ["student", "alumni", "faculty", "admin"],
  },

  // ========== REGISTRATION ==========
  registrationRequired: {
    type: Boolean,
    default: true,
  },

  registrationDeadline: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || value < this.dateTime;
      },
      message: "Registration deadline must be before event start time",
    },
  },

  registrationFee: {
    type: Number,
    min: 0,
    default: 0,
  },

  capacity: {
    type: Number,
    min: 1,
    default: 100,
  },

  registeredUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      registeredAt: {
        type: Date,
        default: Date.now,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "free"],
        default: "free",
      },
      transactionId: String,
      attended: {
        type: Boolean,
        default: false,
      },
    },
  ],

  // ========== ELIGIBILITY ==========
  eligibility: {
    openTo: {
      type: [String],
      enum: ["student", "alumni", "faculty", "all"],
      default: ["all"],
    },
    branches: [
      {
        type: String,
        enum: ["CSE", "ECE", "ME", "CE", "EE", "IT", "All"],
      },
    ],
    years: [
      {
        type: Number,
      },
    ],
    minTeamSize: {
      type: Number,
      min: 1,
      default: 1,
    },
    maxTeamSize: {
      type: Number,
      min: 1,
      default: 1,
    },
  },

  // ========== EVENT DETAILS ==========
  eventImage: {
    type: String, // Banner/poster URL
    default: "https://via.placeholder.com/800x400",
  },

  tags: [
    {
      type: String,
      trim: true,
    },
  ],

  agenda: [
    {
      time: String,
      activity: String,
      speaker: String,
    },
  ],

  prizes: [
    {
      position: String, // "1st Prize", "2nd Prize", "Best Innovation"
      reward: String, // "₹50,000", "Certificate", "Internship"
    },
  ],

  speakers: [
    {
      name: String,
      designation: String,
      company: String,
      profilePicture: String,
      bio: String,
    },
  ],

  sponsors: [
    {
      name: String,
      logo: String,
      tier: {
        type: String,
        enum: ["Title", "Platinum", "Gold", "Silver", "Bronze"],
      },
    },
  ],

  requirements: [
    {
      type: String,
      trim: true,
    },
  ],

  rules: [
    {
      type: String,
      trim: true,
    },
  ],

  // ========== LINKS & RESOURCES ==========
  externalLinks: {
    website: String,
    registrationForm: String,
    discord: String,
    whatsapp: String,
    linkedin: String,
  },

  // ========== STATUS ==========
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
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

  isFeatured: {
    type: Boolean,
    default: false,
  },

  // ========== STATS ==========
  views: {
    type: Number,
    default: 0,
  },

  totalRegistrations: {
    type: Number,
    default: 0,
  },

  attendanceCount: {
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
eventSchema.index({ title: "text", description: "text", organizer: "text" });
eventSchema.index({ organizedBy: 1 });
eventSchema.index({ status: 1, isApproved: 1 });
eventSchema.index({ dateTime: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ "eligibility.branches": 1 });

// ========== MIDDLEWARE ==========

// Update 'updatedAt' before saving
eventSchema.pre("save", function () {
  this.updatedAt = Date.now();
  // next();
});

// Auto-update total registrations
eventSchema.pre("save", function () {
  this.totalRegistrations = this.registeredUsers.length;
  // next();
});

// Auto-update event status based on date
eventSchema.pre("save", function () {
  const now = Date.now();

  if (this.status === "cancelled") {
    return;
    // return next(); // Don't auto-update if manually cancelled
  }

  if (this.endDateTime && this.endDateTime < now) {
    this.status = "completed";
  } else if (
    this.dateTime <= now &&
    (!this.endDateTime || this.endDateTime >= now)
  ) {
    this.status = "ongoing";
  } else if (this.dateTime > now) {
    this.status = "upcoming";
  }

  // next();
});

// ========== METHODS ==========

// Check if user is registered
eventSchema.methods.isUserRegistered = function (userId) {
  return this.registeredUsers.some(
    (reg) => reg.userId.toString() === userId.toString()
  );
};

// Check if registration is open
eventSchema.methods.isRegistrationOpen = function () {
  const now = Date.now();

  return (
    this.registrationRequired &&
    this.status === "upcoming" &&
    this.isApproved &&
    (!this.registrationDeadline || this.registrationDeadline > now) &&
    (this.capacity === 0 || this.totalRegistrations < this.capacity)
  );
};

// Get registration for user
eventSchema.methods.getUserRegistration = function (userId) {
  return this.registeredUsers.find(
    (reg) => reg.userId.toString() === userId.toString()
  );
};

// Increment view count
eventSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Check if event is full
eventSchema.methods.isFull = function () {
  return this.capacity > 0 && this.totalRegistrations >= this.capacity;
};

// Get attendance rate
eventSchema.methods.getAttendanceRate = function () {
  if (this.totalRegistrations === 0) return 0;
  return ((this.attendanceCount / this.totalRegistrations) * 100).toFixed(1);
};

// ========== VIRTUALS ==========

// Days until event
eventSchema.virtual("daysUntilEvent").get(function () {
  const diff = this.dateTime - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Hours until event
eventSchema.virtual("hoursUntilEvent").get(function () {
  const diff = this.dateTime - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60));
});

// Available spots
eventSchema.virtual("availableSpots").get(function () {
  if (this.capacity === 0) return "Unlimited";
  return Math.max(0, this.capacity - this.totalRegistrations);
});

// Registration percentage
eventSchema.virtual("registrationPercentage").get(function () {
  if (this.capacity === 0) return 0;
  return ((this.totalRegistrations / this.capacity) * 100).toFixed(1);
});

// Enable virtuals in JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

// ========== STATIC METHODS ==========

// Get upcoming events
eventSchema.statics.getUpcomingEvents = function () {
  return this.find({
    status: "upcoming",
    isApproved: true,
    dateTime: { $gt: Date.now() },
  }).sort({ dateTime: 1 });
};

// Get events by organizer
eventSchema.statics.getEventsByOrganizer = function (userId) {
  return this.find({ organizedBy: userId }).sort({ createdAt: -1 });
};

// Get featured events
eventSchema.statics.getFeaturedEvents = function () {
  return this.find({
    isFeatured: true,
    status: "upcoming",
    isApproved: true,
    dateTime: { $gt: Date.now() },
  }).sort({ dateTime: 1 });
};

// Search events
eventSchema.statics.searchEvents = function (query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
};
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ dateTime: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ venueType: 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
