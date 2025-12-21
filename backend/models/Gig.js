const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  // ========== BASIC INFO ==========
  title: {
    type: String,
    required: [true, "Gig title is required"],
    trim: true,
    minlength: [10, "Title must be at least 10 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },

  description: {
    type: String,
    required: [true, "Gig description is required"],
    minlength: [50, "Description must be at least 50 characters"],
    maxlength: [3000, "Description cannot exceed 3000 characters"],
  },

  category: {
    type: String,
    enum: [
      "web-development",
      "mobile-app",
      "data-science",
      "ui-ux-design",
      "graphic-design",
      "content-writing",
      "video-editing",
      "digital-marketing",
      "tutoring",
      "data-entry",
      "translation",
      "other",
    ],
    required: [true, "Category is required"],
  },

  subCategory: {
    type: String,
    trim: true,
  },

  // ========== PRICING ==========
  pricingModel: {
    type: String,
    enum: ["fixed", "hourly", "negotiable"],
    default: "fixed",
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [100, "Minimum price is ₹100"],
  },

  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD"],
  },

  // For hourly pricing
  hourlyRate: {
    type: Number,
    min: 0,
  },

  // ========== DELIVERY & TIMELINE ==========
  deliveryTime: {
    type: Number, // in days
    required: [true, "Delivery time is required"],
    min: [1, "Minimum delivery time is 1 day"],
    max: [90, "Maximum delivery time is 90 days"],
  },

  revisions: {
    type: Number,
    default: 1,
    min: 0,
    max: 10,
  },

  // ========== TECHNICAL DETAILS ==========
  techStack: [
    {
      type: String,
      trim: true,
    },
  ],

  requirements: [
    {
      type: String,
      trim: true,
    },
  ],

  deliverables: [
    {
      type: String,
      trim: true,
    },
  ],

  // ========== FREELANCER INFO ==========
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  freelancerRole: {
    type: String,
    enum: ["student", "alumni"],
  },

  // ========== PAYMENT INFO ==========
  paymentMethods: [
    {
      type: String,
      enum: ["UPI", "Bank Transfer", "PayPal", "Cash"],
    },
  ],

  upiId: {
    type: String,
    match: [/^[\w.-]+@[\w.-]+$/, "Please provide a valid UPI ID"],
  },

  qrCodeImage: {
    type: String, // Cloudinary URL
  },

  accountDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
  },

  // ========== MEDIA ==========
  gigImages: {
    type: [String],
    validate: {
      validator: function (val) {
        return val.length <= 5;
      },
      message: "Maximum 5 images allowed",
    },
  },

  portfolioLinks: [
    {
      title: String,
      url: {
        type: String,
        match: [/^https?:\/\/.+/, "Please provide a valid URL"],
      },
    },
  ],

  videoUrl: {
    type: String, // YouTube/Vimeo link
    match: [/^https?:\/\/.+/, "Please provide a valid URL"],
  },

  // ========== TAGS & SEO ==========
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],

  // ========== REVIEWS & RATINGS ==========
  reviews: [
    {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        maxlength: 500,
      },
      helpful: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Note: We don't store averageRating in DB if we calculate it via pre-save or virtuals.
  // You had it defined as a Schema field but also a virtual. Usually, you pick one.
  // I kept the schema field here because your pre-save hook updates it.
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  totalReviews: {
    type: Number,
    default: 0,
  },

  // ========== STATS ==========
  views: {
    type: Number,
    default: 0,
  },

  totalOrders: {
    type: Number,
    default: 0,
  },

  completedOrders: {
    type: Number,
    default: 0,
  },

  inProgressOrders: {
    type: Number,
    default: 0,
  },

  cancelledOrders: {
    type: Number,
    default: 0,
  },

  responseTime: {
    type: Number, // Average response time in hours
    default: 24,
  },

  completionRate: {
    type: Number, // Percentage
    default: 0,
  },

  // ========== PACKAGES (Optional) ==========
  packages: [
    {
      name: {
        type: String,
        enum: ["Basic", "Standard", "Premium"],
      },
      description: String,
      price: Number,
      deliveryTime: Number,
      revisions: Number,
      features: [String],
    },
  ],

  // ========== FAQ ==========
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],

  // ========== STATUS ==========
  isActive: {
    type: Boolean,
    default: true,
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

  isPaused: {
    type: Boolean,
    default: false,
  },

  pausedReason: {
    type: String,
  },

  isFeatured: {
    type: Boolean,
    default: false,
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

  lastOrderAt: {
    type: Date,
  },
});

// ========== INDEXES ==========
// gigSchema.index({ title: "text", description: "text", tags: "text" });
// gigSchema.index({ createdBy: 1 });
// gigSchema.index({ category: 1 });
// gigSchema.index({ averageRating: -1 });
// gigSchema.index({ isActive: 1, isApproved: 1 });
// gigSchema.index({ price: 1 });
// gigSchema.index({ createdAt: -1 });

// ========== MIDDLEWARE (FIXED) ==========

// 1. Update 'updatedAt' before saving
gigSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// 2. Calculate average rating and total reviews
gigSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.averageRating = (totalRating / this.reviews.length).toFixed(1);
    this.totalReviews = this.reviews.length;
  }
  next();
});

// 3. Calculate completion rate
gigSchema.pre("save", function (next) {
  if (this.totalOrders > 0) {
    this.completionRate = (
      (this.completedOrders / this.totalOrders) *
      100
    ).toFixed(1);
  }
  next();
});

// ========== METHODS ==========

// Check if user can review
gigSchema.methods.canUserReview = function (userId) {
  if (!this.reviews) return true; // Safety check
  return !this.reviews.some(
    (review) => review.reviewedBy.toString() === userId.toString()
  );
};

// Get review by user
gigSchema.methods.getUserReview = function (userId) {
  if (!this.reviews) return null; // Safety check
  return this.reviews.find(
    (review) => review.reviewedBy.toString() === userId.toString()
  );
};

// Increment view count
gigSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Check if gig is available
gigSchema.methods.isAvailable = function () {
  return this.isActive && this.isApproved && !this.isPaused;
};

// Update order stats
gigSchema.methods.updateOrderStats = async function (status) {
  if (status === "in_progress") {
    this.inProgressOrders += 1;
    this.totalOrders += 1;
  } else if (status === "completed") {
    this.inProgressOrders = Math.max(0, this.inProgressOrders - 1);
    this.completedOrders += 1;
    this.lastOrderAt = Date.now();
  } else if (status === "cancelled") {
    this.inProgressOrders = Math.max(0, this.inProgressOrders - 1);
    this.cancelledOrders += 1;
  }

  return this.save();
};

// ========== VIRTUALS ==========

// Success rate
gigSchema.virtual("successRate").get(function () {
  if (this.totalOrders === 0) return 100;
  return ((this.completedOrders / this.totalOrders) * 100).toFixed(1);
});

// Rating Distribution
gigSchema.virtual("ratingDistribution").get(function () {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  // Safety Check: Only loop if reviews exist
  if (this.reviews && this.reviews.length > 0) {
    this.reviews.forEach((review) => {
      if (distribution[review.rating] !== undefined) {
        distribution[review.rating] += 1;
      }
    });
  }
  return distribution;
});

// Average price per day
gigSchema.virtual("pricePerDay").get(function () {
  if (!this.deliveryTime || this.deliveryTime === 0) return 0;
  return (this.price / this.deliveryTime).toFixed(2);
});

// Enable virtuals in JSON
gigSchema.set("toJSON", { virtuals: true });
gigSchema.set("toObject", { virtuals: true });

// ========== STATIC METHODS ==========

// Get active gigs
gigSchema.statics.getActiveGigs = function () {
  return this.find({
    isActive: true,
    isApproved: true,
    isPaused: false,
  }).sort({ createdAt: -1 });
};

// Get gigs by freelancer
gigSchema.statics.getGigsByFreelancer = function (userId) {
  return this.find({ createdBy: userId }).sort({ createdAt: -1 });
};

// Get top rated gigs
gigSchema.statics.getTopRatedGigs = function (limit = 10) {
  return this.find({
    isActive: true,
    isApproved: true,
    isPaused: false,
    totalReviews: { $gte: 3 },
  })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(limit);
};

// Get featured gigs
gigSchema.statics.getFeaturedGigs = function () {
  return this.find({
    isFeatured: true,
    isActive: true,
    isApproved: true,
    isPaused: false,
  }).sort({ averageRating: -1 });
};

// Search gigs
gigSchema.statics.searchGigs = function (query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
};

const Gig = mongoose.model("Gig", gigSchema);

module.exports = Gig;
