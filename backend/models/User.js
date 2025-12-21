// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  // ========== AUTHENTICATION ==========
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  // ========== BASIC INFO ==========
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
  },

  role: {
    type: String,
    enum: {
      values: ["student", "alumni", "faculty", "admin"],
      message: "{VALUE} is not a valid role",
    },
    default: "student",
  },

  profilePicture: {
    type: String,
    default: "https://via.placeholder.com/150",
  },

  // ========== COLLEGE INFO ==========
  college: {
    type: String,
    required: [true, "College name is required"],
  },

  // ----------------------------------------------------
  // UPDATED BRANCH: No Enum, Only required for Students
  // ----------------------------------------------------
  branch: {
    type: String,
    // Enum removed: Allows any branch name
    required: function () {
      return this.role === "student"; // Optional for Alumni now
    },
    set: (v) => (v === "" ? undefined : v),
  },

  // ========== STUDENT SPECIFIC ==========
  year: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return this.role === "student";
    },
  },

  section: {
    type: String,
    uppercase: true,
    required: function () {
      return this.role === "student";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  rollNumber: {
    type: String,
    uppercase: true,
    unique: true,
    sparse: true,
    required: function () {
      return this.role === "student";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  // ========== ALUMNI SPECIFIC ==========
  company: {
    type: String,
    required: function () {
      return this.role === "alumni";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  jobTitle: {
    type: String,
    required: function () {
      return this.role === "alumni";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  yearOfPassing: {
    type: Number,
    min: 1950,
    max: new Date().getFullYear(),
    required: function () {
      return this.role === "alumni";
    },
  },

  // ----------------------------------------------------
  // UPDATED DOMAIN: No Enum (Allows "Web Development")
  // ----------------------------------------------------
  domain: {
    type: String,
    // Enum removed: Allows any domain text
    required: function () {
      return this.role === "alumni";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  linkedIn: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
      "Please provide a valid LinkedIn URL",
    ],
    set: (v) => (v === "" ? undefined : v),
  },

  // ========== FACULTY SPECIFIC ==========
  department: {
    type: String,
    required: function () {
      return this.role === "faculty";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  designation: {
    type: String,
    // Enum removed: Allows any designation
    required: function () {
      return this.role === "faculty";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.role === "faculty";
    },
    set: (v) => (v === "" ? undefined : v),
  },

  // ========== ADDITIONAL PROFILE ==========
  bio: {
    type: String,
    maxlength: [500, "Bio cannot exceed 500 characters"],
  },

  skills: [{ type: String, trim: true }],
  resume: { type: String },

  // ========== FREELANCE INFO ==========
  openForFreelance: { type: Boolean, default: false },
  upiId: {
    type: String,
    match: [/^[\w.-]+@[\w.-]+$/, "Please provide a valid UPI ID"],
  },
  qrCodeImage: { type: String },
  freelanceRating: { type: Number, default: 0, min: 0, max: 5 },

  // ========== NOTIFICATION PREFERENCES ==========
  notificationPreferences: {
    jobApplication: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
    eventRegistration: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
    newOrder: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    newMessage: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    orderDelivered: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    systemAnnouncement: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
  },

  // ========== EMAIL VERIFICATION ==========
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  verificationTokenExpires: { type: Date, select: false },

  // 🔹 NEW: OTP-BASED EMAIL VERIFICATION FIELDS
  emailVerificationCode: { type: String, select: false },
  emailVerificationCodeExpires: { type: Date, select: false },

  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },

  resetPasswordCode: { type: String, select: false },
  resetPasswordCodeExpires: { type: Date, select: false },

  // ========== ADMIN APPROVAL ==========
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role === "student";
    },
  },
  isBlocked: { type: Boolean, default: false },

  // ========== TIMESTAMPS ==========
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

// ========== INDEXES ==========
// userSchema.index({ email: 1 });
// userSchema.index({ role: 1 });
// userSchema.index({ rollNumber: 1 }, { sparse: true });
// userSchema.index({ employeeId: 1 }, { sparse: true });

// ========== MIDDLEWARE (FIXED FOR STABILITY) ==========
userSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();

  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ========== METHODS ==========
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  return token;
};

userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.verificationTokenExpires;
  delete userObject.emailVerificationCode;
  delete userObject.emailVerificationCodeExpires;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  delete userObject.__v;
  return userObject;
};

userSchema.virtual("fullProfile").get(function () {
  return {
    name: this.name,
    email: this.email,
    role: this.role,
    profilePicture: this.profilePicture,
  };
});

module.exports = mongoose.model("User", userSchema);
