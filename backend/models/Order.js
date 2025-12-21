// backend/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // ========== PARTIES ==========
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ========== ORDER DETAILS ==========
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },

  category: {
    type: String,
    required: true,
  },

  // ========== PACKAGE SELECTED ==========
  packageType: {
    type: String,
    enum: ["Basic", "Standard", "Premium", "Custom"],
  },

  // ========== PRICING ==========
  price: {
    type: Number,
    required: true,
    min: 0,
  },

  currency: {
    type: String,
    default: "INR",
  },

  // ========== TIMELINE ==========
  deliveryTime: {
    type: Number, // in days
    required: true,
  },

  deadline: {
    type: Date,
    required: true,
  },

  actualDeliveryDate: {
    type: Date,
  },

  revisions: {
    type: Number,
    default: 1,
  },

  revisionsUsed: {
    type: Number,
    default: 0,
  },

  // ========== REQUIREMENTS ==========
  requirements: {
    type: String,
    maxlength: 2000,
  },

  attachments: [
    {
      name: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // ========== STATUS ==========
  status: {
    type: String,
    enum: [
      "pending",
      "in_progress",
      "delivered",
      "revision_requested",
      "completed",
      "cancelled",
      "disputed",
    ],
    default: "pending",
  },

  // ========== PAYMENT ==========
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },

  paymentMethod: {
    type: String,
    enum: ["UPI", "Bank Transfer", "PayPal", "Cash"],
  },

  transactionId: {
    type: String,
  },

  paymentProof: {
    type: String, // URL to payment screenshot
  },

  paymentDate: {
    type: Date,
  },

  // Freelancer's payment info at time of order
  freelancerPaymentInfo: {
    upiId: String,
    qrCodeImage: String,
    accountDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
    },
  },

  // ========== DELIVERABLES ==========
  deliveredWork: [
    {
      type: {
        type: String,
        enum: ["file", "link", "text"],
      },
      name: String,
      url: String,
      description: String,
      deliveredAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // ========== REVISION HISTORY ==========
  revisionRequests: [
    {
      requestedAt: Date,
      reason: String,
      response: String,
      respondedAt: Date,
    },
  ],

  // ========== COMMUNICATION ==========
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: String,
      attachments: [
        {
          name: String,
          url: String,
        },
      ],
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // ========== CANCELLATION ==========
  cancellationReason: {
    type: String,
    maxlength: 500,
  },

  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  cancelledAt: {
    type: Date,
  },

  // ========== DISPUTE ==========
  disputeReason: {
    type: String,
    maxlength: 1000,
  },

  disputeRaisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  disputeRaisedAt: {
    type: Date,
  },

  disputeResolution: {
    type: String,
    maxlength: 1000,
  },

  disputeResolvedAt: {
    type: Date,
  },

  // ========== MILESTONES (For large projects) ==========
  milestones: [
    {
      title: String,
      description: String,
      amount: Number,
      deadline: Date,
      status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending",
      },
      completedAt: Date,
    },
  ],

  // ========== RATING & REVIEW ==========
  clientRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    ratedAt: Date,
  },

  freelancerRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    ratedAt: Date,
  },

  // ========== TIMESTAMPS ==========
  createdAt: {
    type: Date,
    default: Date.now,
  },

  acceptedAt: {
    type: Date,
  },

  startedAt: {
    type: Date,
  },

  deliveredAt: {
    type: Date,
  },

  completedAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ========== INDEXES ==========
// orderSchema.index({ orderNumber: 1 });
// orderSchema.index({ clientId: 1 });
// orderSchema.index({ freelancerId: 1 });
// orderSchema.index({ gigId: 1 });
// orderSchema.index({ status: 1 });
// orderSchema.index({ createdAt: -1 });

// ========== MIDDLEWARE ==========

// Generate order number before saving
orderSchema.pre("save", async function () {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  this.updatedAt = Date.now();
});

// Set deadline based on delivery time
orderSchema.pre("save", function () {
  if (this.isNew && !this.deadline) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + this.deliveryTime);
    this.deadline = deadline;
  }
});

// ========== METHODS ==========

// Check if order is overdue
orderSchema.methods.isOverdue = function () {
  return this.status === "in_progress" && this.deadline < Date.now();
};

// Check if order is late
orderSchema.methods.isLate = function () {
  if (this.status !== "completed" && this.status !== "delivered") return false;
  return this.actualDeliveryDate > this.deadline;
};

// Calculate days remaining
orderSchema.methods.daysRemaining = function () {
  if (this.status === "completed" || this.status === "cancelled") return 0;
  const diff = this.deadline - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Check if can request revision
orderSchema.methods.canRequestRevision = function () {
  return this.status === "delivered" && this.revisionsUsed < this.revisions;
};

// Add message
orderSchema.methods.addMessage = function (
  senderId,
  content,
  attachments = []
) {
  this.messages.push({
    senderId,
    content,
    attachments,
    sentAt: Date.now(),
  });
  return this.save();
};

// Request revision
orderSchema.methods.requestRevision = function (reason) {
  if (!this.canRequestRevision()) {
    throw new Error("No revisions left or order not delivered");
  }

  this.revisionsUsed += 1;
  this.revisionRequests.push({
    requestedAt: Date.now(),
    reason,
  });
  this.status = "revision_requested";

  return this.save();
};

// Deliver work
orderSchema.methods.deliverWork = function (deliverables) {
  this.deliveredWork.push(...deliverables);
  this.status = "delivered";
  this.deliveredAt = Date.now();
  this.actualDeliveryDate = Date.now();

  return this.save();
};

// Accept order (freelancer)
orderSchema.methods.acceptOrder = function () {
  this.status = "in_progress";
  this.acceptedAt = Date.now();
  this.startedAt = Date.now();

  return this.save();
};

// Complete order
orderSchema.methods.completeOrder = function () {
  this.status = "completed";
  this.completedAt = Date.now();

  return this.save();
};

// Cancel order
orderSchema.methods.cancelOrder = function (reason, cancelledBy) {
  this.status = "cancelled";
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = Date.now();

  return this.save();
};

// Raise dispute
orderSchema.methods.raiseDispute = function (reason, raisedBy) {
  this.status = "disputed";
  this.disputeReason = reason;
  this.disputeRaisedBy = raisedBy;
  this.disputeRaisedAt = Date.now();

  return this.save();
};

// ========== VIRTUALS ==========

// Order duration (in days)
orderSchema.virtual("duration").get(function () {
  if (!this.completedAt) return null;
  const start = this.startedAt || this.createdAt;
  const diff = this.completedAt - start;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Progress percentage
orderSchema.virtual("progress").get(function () {
  if (this.status === "completed") return 100;
  if (this.status === "cancelled") return 0;

  const statusProgress = {
    pending: 10,
    in_progress: 50,
    delivered: 90,
    revision_requested: 70,
  };

  return statusProgress[this.status] || 0;
});

// Enable virtuals in JSON
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

// ========== STATIC METHODS ==========

// Get orders by client
orderSchema.statics.getOrdersByClient = function (clientId) {
  return this.find({ clientId })
    .populate("gigId", "title category price")
    .populate("freelancerId", "name email profilePicture")
    .sort({ createdAt: -1 });
};

// Get orders by freelancer
orderSchema.statics.getOrdersByFreelancer = function (freelancerId) {
  return this.find({ freelancerId })
    .populate("gigId", "title category")
    .populate("clientId", "name email profilePicture")
    .sort({ createdAt: -1 });
};

// Get active orders
orderSchema.statics.getActiveOrders = function (userId) {
  return this.find({
    $or: [{ clientId: userId }, { freelancerId: userId }],
    status: {
      $in: ["pending", "in_progress", "delivered", "revision_requested"],
    },
  }).sort({ deadline: 1 });
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
