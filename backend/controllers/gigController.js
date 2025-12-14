// backend/controllers/gigController.js
const Gig = require("../models/Gig");
const Order = require("../models/Order");
const User = require("../models/User");

// ========== 1. CREATE GIG ==========
exports.createGig = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      pricingModel,
      price,
      hourlyRate,
      deliveryTime,
      revisions,
      techStack,
      requirements,
      deliverables,
      paymentMethods,
      upiId,
      qrCodeImage,
      accountDetails,
      gigImages,
      portfolioLinks,
      videoUrl,
      tags,
      packages,
      faqs,
    } = req.body;

    // Get user
    const user = await User.findById(req.userId);

    // Only students and alumni can create gigs
    if (user.role !== "student" && user.role !== "alumni") {
      return res.status(403).json({
        success: false,
        error: "Only students and alumni can create gigs",
      });
    }

    // Check if user has set openForFreelance
    if (!user.openForFreelance) {
      return res.status(403).json({
        success: false,
        error: "Please enable freelancing in your profile first",
      });
    }

    // Create gig
    const gig = new Gig({
      title,
      description,
      category,
      subCategory,
      pricingModel,
      price,
      hourlyRate,
      deliveryTime,
      revisions,
      techStack,
      requirements,
      deliverables,
      paymentMethods,
      upiId: upiId || user.upiId,
      qrCodeImage: qrCodeImage || user.qrCodeImage,
      accountDetails,
      gigImages,
      portfolioLinks,
      videoUrl,
      tags,
      packages,
      faqs,
      createdBy: req.userId,
      freelancerRole: user.role,
    });

    await gig.save();

    res.status(201).json({
      success: true,
      message: "Gig created successfully and is pending admin approval",
      gig,
      requiresApproval: true,
    });
  } catch (err) {
    console.error("Create gig error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create gig",
    });
  }
};

// ========== 2. GET ALL GIGS ==========
exports.getAllGigs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      maxDeliveryTime,
      minRating,
      sortBy = "createdAt",
      order = "desc",
      isFeatured,
    } = req.query;

    // Build query
    const query = {
      isActive: true,
      isApproved: true,
      isPaused: false,
    };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Delivery time filter
    if (maxDeliveryTime) {
      query.deliveryTime = { $lte: Number(maxDeliveryTime) };
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Featured filter
    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const gigs = await Gig.find(query)
      .populate(
        "createdBy",
        "name email profilePicture freelanceRating role company jobTitle"
      )
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Gig.countDocuments(query);

    res.json({
      success: true,
      gigs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalGigs: total,
        hasMore: skip + gigs.length < total,
      },
    });
  } catch (err) {
    console.error("Get gigs error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch gigs",
    });
  }
};

// ========== 3. GET SINGLE GIG ==========
exports.getGigById = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id)
      .populate(
        "createdBy",
        "name email profilePicture bio skills freelanceRating role company jobTitle year branch"
      )
      .populate("reviews.reviewedBy", "name profilePicture");

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    // Increment view count (but not for gig owner)
    if (req.userId && gig.createdBy._id.toString() !== req.userId) {
      await gig.incrementViews();
    }

    // Check if current user has ordered this gig
    const userHasOrdered = req.userId
      ? await Order.exists({
          gigId: id,
          clientId: req.userId,
          status: { $in: ["completed", "in_progress", "delivered"] },
        })
      : false;

    res.json({
      success: true,
      gig,
      userHasOrdered: !!userHasOrdered,
      canReview: userHasOrdered && gig.canUserReview(req.userId),
    });
  } catch (err) {
    console.error("Get gig error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch gig",
    });
  }
};

// ========== 4. UPDATE GIG ==========
exports.updateGig = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    // Check authorization
    if (gig.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this gig",
      });
    }

    // Don't allow updating certain fields
    delete updates.createdBy;
    delete updates.reviews;
    delete updates.totalOrders;
    delete updates.completedOrders;
    delete updates.isApproved;

    // Update gig
    Object.assign(gig, updates);
    await gig.save();

    res.json({
      success: true,
      message: "Gig updated successfully",
      gig,
    });
  } catch (err) {
    console.error("Update gig error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update gig",
    });
  }
};

// ========== 5. DELETE GIG ==========
exports.deleteGig = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (gig.createdBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this gig",
      });
    }

    // Check for active orders
    const activeOrders = await Order.countDocuments({
      gigId: id,
      status: {
        $in: ["pending", "in_progress", "delivered", "revision_requested"],
      },
    });

    if (activeOrders > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete gig with active orders",
      });
    }

    await Gig.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Gig deleted successfully",
    });
  } catch (err) {
    console.error("Delete gig error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete gig",
    });
  }
};

// ========== 6. PAUSE/RESUME GIG ==========
exports.toggleGigStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaused, pausedReason } = req.body;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    // Check authorization
    if (gig.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    gig.isPaused = isPaused;
    gig.pausedReason = isPaused ? pausedReason : null;
    await gig.save();

    res.json({
      success: true,
      message: isPaused
        ? "Gig paused successfully"
        : "Gig resumed successfully",
      gig,
    });
  } catch (err) {
    console.error("Toggle gig status error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update gig status",
    });
  }
};

// ========== 7. ADD REVIEW ==========
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, orderId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    // Check if user has completed order for this gig
    const order = await Order.findOne({
      _id: orderId,
      gigId: id,
      clientId: req.userId,
      status: "completed",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        error: "You can only review after completing an order",
      });
    }

    // Check if already reviewed
    if (!gig.canUserReview(req.userId)) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this gig",
      });
    }

    // Add review
    gig.reviews.push({
      reviewedBy: req.userId,
      orderId: orderId,
      rating: rating,
      comment: comment,
      createdAt: Date.now(),
    });

    await gig.save();

    // Update freelancer rating
    const freelancer = await User.findById(gig.createdBy);
    const allGigs = await Gig.find({ createdBy: gig.createdBy });

    let totalRating = 0;
    let totalReviews = 0;

    allGigs.forEach((g) => {
      totalRating += g.averageRating * g.totalReviews;
      totalReviews += g.totalReviews;
    });

    if (totalReviews > 0) {
      freelancer.freelanceRating = (totalRating / totalReviews).toFixed(1);
      await freelancer.save();
    }

    res.json({
      success: true,
      message: "Review added successfully",
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to add review",
    });
  }
};

// ========== 8. MARK REVIEW AS HELPFUL ==========
exports.markReviewHelpful = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    const review = gig.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    // Toggle helpful
    const index = review.helpful.indexOf(req.userId);

    if (index > -1) {
      review.helpful.splice(index, 1);
    } else {
      review.helpful.push(req.userId);
    }

    await gig.save();

    res.json({
      success: true,
      message: "Review updated",
      helpfulCount: review.helpful.length,
    });
  } catch (err) {
    console.error("Mark helpful error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update review",
    });
  }
};

// ========== 9. GET MY GIGS ==========
exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ createdBy: req.userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      gigs,
      total: gigs.length,
    });
  } catch (err) {
    console.error("Get my gigs error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your gigs",
    });
  }
};

// ========== 10. GET FREELANCER GIGS ==========
exports.getFreelancerGigs = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const gigs = await Gig.find({
      createdBy: freelancerId,
      isActive: true,
      isApproved: true,
      isPaused: false,
    })
      .populate("createdBy", "name email profilePicture freelanceRating role")
      .sort({ averageRating: -1 });

    const freelancer = await User.findById(freelancerId).select(
      "name email profilePicture bio skills freelanceRating role company jobTitle"
    );

    res.json({
      success: true,
      freelancer,
      gigs,
      total: gigs.length,
    });
  } catch (err) {
    console.error("Get freelancer gigs error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch freelancer gigs",
    });
  }
};

// ========== 11. GET TOP RATED GIGS ==========
exports.getTopRatedGigs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const gigs = await Gig.find({
      isActive: true,
      isApproved: true,
      isPaused: false,
      totalReviews: { $gte: 3 },
    })
      .populate("createdBy", "name profilePicture freelanceRating")
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      gigs,
    });
  } catch (err) {
    console.error("Get top rated gigs error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch top rated gigs",
    });
  }
};

// ========== 12. GET FEATURED GIGS ==========
exports.getFeaturedGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({
      isFeatured: true,
      isActive: true,
      isApproved: true,
      isPaused: false,
    })
      .populate("createdBy", "name profilePicture freelanceRating")
      .sort({ averageRating: -1 })
      .limit(6);

    res.json({
      success: true,
      gigs,
    });
  } catch (err) {
    console.error("Get featured gigs error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured gigs",
    });
  }
};

// ========== 13. GET GIG STATISTICS ==========
exports.getGigStats = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    // Check authorization
    if (gig.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    // Get order statistics
    const orders = await Order.find({ gigId: id });

    const stats = {
      views: gig.views,
      totalOrders: gig.totalOrders,
      completedOrders: gig.completedOrders,
      inProgressOrders: gig.inProgressOrders,
      cancelledOrders: gig.cancelledOrders,
      completionRate: gig.completionRate,
      averageRating: gig.averageRating,
      totalReviews: gig.totalReviews,
      totalRevenue: orders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.price, 0),
      conversionRate:
        gig.views > 0 ? ((gig.totalOrders / gig.views) * 100).toFixed(2) : 0,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("Get gig stats error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch gig statistics",
    });
  }
};

module.exports = exports;
