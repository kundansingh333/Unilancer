// backend/controllers/orderController.js
const Order = require("../models/Order");
const Gig = require("../models/Gig");
const User = require("../models/User");

// ========== 1. CREATE ORDER ==========
exports.createOrder = async (req, res) => {
  try {
    const {
      gigId,
      packageType,
      description,
      requirements,
      attachments,
      paymentMethod,
      transactionId,
      paymentProof,
    } = req.body;

    // Get gig
    const gig = await Gig.findById(gigId).populate("createdBy");

    if (!gig) {
      return res.status(404).json({
        success: false,
        error: "Gig not found",
      });
    }

    // Check if gig is available
    if (!gig.isAvailable()) {
      return res.status(400).json({
        success: false,
        error: "Gig is not available for orders",
      });
    }

    // Can't order own gig
    if (gig.createdBy._id.toString() === req.userId) {
      return res.status(400).json({
        success: false,
        error: "You cannot order your own gig",
      });
    }

    // Determine price and delivery time based on package
    let price = gig.price;
    let deliveryTime = gig.deliveryTime;
    let revisions = gig.revisions;

    if (packageType && gig.packages && gig.packages.length > 0) {
      const selectedPackage = gig.packages.find((p) => p.name === packageType);
      if (selectedPackage) {
        price = selectedPackage.price;
        deliveryTime = selectedPackage.deliveryTime;
        revisions = selectedPackage.revisions;
      }
    }

    // --- FIX START: Generate required fields for DB Schema ---
    const orderNumber = "ORD-" + Date.now() + Math.floor(Math.random() * 1000);

    const deadline = new Date();
    // Default to 3 days if deliveryTime is missing, otherwise add deliveryTime days
    deadline.setDate(deadline.getDate() + (parseInt(deliveryTime) || 3));
    // --- FIX END ---

    // Create order
    const order = new Order({
      gigId: gigId,
      clientId: req.userId,
      freelancerId: gig.createdBy._id,
      title: gig.title,
      description: description || gig.description,
      category: gig.category,
      packageType: packageType || "Custom",
      price: price,
      deliveryTime: deliveryTime,
      revisions: revisions,
      requirements: requirements,
      attachments: attachments,
      paymentMethod: paymentMethod,
      transactionId: transactionId,
      paymentProof: paymentProof,
      paymentStatus: transactionId ? "paid" : "pending",
      paymentDate: transactionId ? Date.now() : null,
      freelancerPaymentInfo: {
        upiId: gig.upiId,
        qrCodeImage: gig.qrCodeImage,
        accountDetails: gig.accountDetails,
      },
      // Inserted the required fields here
      orderNumber: orderNumber,
      deadline: deadline,
    });

    await order.save();

    // Update gig stats
    await gig.updateOrderStats("in_progress");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      requiresPayment: !transactionId,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create order",
    });
  }
};

// ========== 2. GET ALL ORDERS (My Orders) ==========
exports.getMyOrders = async (req, res) => {
  try {
    const { status, role } = req.query;

    const query = {
      $or: [{ clientId: req.userId }, { freelancerId: req.userId }],
    };

    // Status filter
    if (status) {
      query.status = status;
    }

    // Role filter (as client or freelancer)
    if (role === "client") {
      query.clientId = req.userId;
      delete query.$or;
    } else if (role === "freelancer") {
      query.freelancerId = req.userId;
      delete query.$or;
    }

    const orders = await Order.find(query)
      .populate("gigId", "title category gigImages")
      .populate("clientId", "name email profilePicture")
      .populate("freelancerId", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      total: orders.length,
    });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};

// ========== 3. GET SINGLE ORDER ==========
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("gigId")
      .populate("clientId", "name email profilePicture phone")
      .populate("freelancerId", "name email profilePicture phone skills")
      .populate("messages.senderId", "name profilePicture");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    if (
      order.clientId._id.toString() !== req.userId &&
      order.freelancerId._id.toString() !== req.userId
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      order,
      userRole:
        order.clientId._id.toString() === req.userId ? "client" : "freelancer",
    });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    });
  }
};

// ========== 4. ACCEPT ORDER (Freelancer) ==========
exports.acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    if (order.freelancerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Only freelancer can accept order",
      });
    }

    // Check status
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Order cannot be accepted in current status",
      });
    }

    await order.acceptOrder();

    res.json({
      success: true,
      message: "Order accepted successfully",
      order,
    });
  } catch (err) {
    console.error("Accept order error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to accept order",
    });
  }
};

// ========== 5. DELIVER WORK (Freelancer) ==========
exports.deliverWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliverables } = req.body;

    if (!deliverables || deliverables.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide deliverables",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    if (order.freelancerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Only freelancer can deliver work",
      });
    }

    // Check status
    if (
      order.status !== "in_progress" &&
      order.status !== "revision_requested"
    ) {
      return res.status(400).json({
        success: false,
        error: "Order is not in progress",
      });
    }

    await order.deliverWork(deliverables);

    res.json({
      success: true,
      message: "Work delivered successfully",
      order,
    });
  } catch (err) {
    console.error("Deliver work error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to deliver work",
    });
  }
};

// ========== 6. REQUEST REVISION (Client) ==========
exports.requestRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: "Please provide revision reason",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    if (order.clientId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Only client can request revision",
      });
    }

    // Check if can request revision
    if (!order.canRequestRevision()) {
      return res.status(400).json({
        success: false,
        error: "No revisions left or order not delivered",
      });
    }

    await order.requestRevision(reason);

    res.json({
      success: true,
      message: "Revision requested successfully",
      order,
    });
  } catch (err) {
    console.error("Request revision error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to request revision",
    });
  }
};

// ========== 7. COMPLETE ORDER (Client) ==========
exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    if (order.clientId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "Only client can complete order",
      });
    }

    // Check status
    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        error: "Order must be delivered before completion",
      });
    }

    await order.completeOrder();

    // Update gig stats
    const gig = await Gig.findById(order.gigId);
    if (gig) {
      await gig.updateOrderStats("completed");
    }

    res.json({
      success: true,
      message: "Order completed successfully",
      order,
    });
  } catch (err) {
    console.error("Complete order error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to complete order",
    });
  }
};

// ========== 8. CANCEL ORDER ==========
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: "Please provide cancellation reason",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    const isClient = order.clientId.toString() === req.userId;
    const isFreelancer = order.freelancerId.toString() === req.userId;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    // Check status - can't cancel completed orders
    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        error: "Cannot cancel completed order",
      });
    }

    await order.cancelOrder(reason, req.userId);

    // Update gig stats
    const gig = await Gig.findById(order.gigId);
    if (gig) {
      await gig.updateOrderStats("cancelled");
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to cancel order",
    });
  }
};

// ========== 9. RAISE DISPUTE ==========
exports.raiseDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: "Please provide dispute reason",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    const isClient = order.clientId.toString() === req.userId;
    const isFreelancer = order.freelancerId.toString() === req.userId;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    // Can't dispute completed or cancelled orders
    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        error: "Cannot raise dispute for this order status",
      });
    }

    await order.raiseDispute(reason, req.userId);

    res.json({
      success: true,
      message: "Dispute raised successfully. Admin will review.",
      order,
    });
  } catch (err) {
    console.error("Raise dispute error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to raise dispute",
    });
  }
};

// ========== 10. ADD MESSAGE TO ORDER ==========
exports.addOrderMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, attachments } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check authorization
    const isClient = order.clientId.toString() === req.userId;
    const isFreelancer = order.freelancerId.toString() === req.userId;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    await order.addMessage(req.userId, content, attachments);

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("Add message error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
};

// ========== 11. RATE ORDER ==========
// exports.rateOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rating, review } = req.body;

//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         error: "Rating must be between 1 and 5",
//       });
//     }

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         error: "Order not found",
//       });
//     }

//     // Check if order is completed
//     if (order.status !== "completed") {
//       return res.status(400).json({
//         success: false,
//         error: "Can only rate completed orders",
//       });
//     }

//     // Check authorization and determine who is rating
//     const isClient = order.clientId.toString() === req.userId;
//     const isFreelancer = order.freelancerId.toString() === req.userId;

//     if (!isClient && !isFreelancer) {
//       return res.status(403).json({
//         success: false,
//         error: "Not authorized",
//       });
//     }

//     // Add rating
//     if (isClient) {
//       if (order.clientRating.rating) {
//         return res.status(400).json({
//           success: false,
//           error: "You have already rated this order",
//         });
//       }

//       order.clientRating = {
//         rating: rating,
//         review: review,
//         ratedAt: Date.now(),
//       };
//     } else {
//       if (order.freelancerRating.rating) {
//         return res.status(400).json({
//           success: false,
//           error: "You have already rated this order",
//         });
//       }

//       order.freelancerRating = {
//         rating: rating,
//         review: review,
//         ratedAt: Date.now(),
//       };
//     }

//     await order.save();

//     res.json({
//       success: true,
//       message: "Rating submitted successfully",
//     });
//   } catch (err) {
//     console.error("Rate order error:", err);
//     res.status(500).json({
//       success: false,
//       error: "Failed to submit rating",
//     });
//   }
// };

exports.rateOrder = async (req, res) => {
  try {
    const orderId = req.params.id; // From URL
    const { rating, review } = req.body; // From Frontend Payload

    // 1. Find the Order to get the 'gigId'
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Optional: Check if order is actually completed
    if (order.status !== "completed") {
      return res
        .status(400)
        .json({ success: false, error: "You can only rate completed orders" });
    }

    // 2. Find the Gig using the ID found in the Order
    const gig = await Gig.findById(order.gigId);
    if (!gig) {
      return res.status(404).json({ success: false, error: "Gig not found" });
    }

    // 3. Check if user already reviewed
    // We use the method we defined in your Gig.js model
    if (!gig.canUserReview(req.userId)) {
      return res
        .status(400)
        .json({ success: false, error: "You have already reviewed this gig" });
    }

    // 4. Create the review object
    // MAPPING HAPPENS HERE: We take 'review' from frontend and save as 'comment' in DB
    const newReview = {
      reviewedBy: req.userId,
      orderId: order._id,
      rating: Number(rating),
      comment: review, // <--- Mapping 'review' to 'comment'
      createdAt: Date.now(),
    };

    // 5. Push and Save
    gig.reviews.push(newReview);
    await gig.save(); // This triggers the averageRating calculation

    // Optional: Mark order as rated so they can't rate again via a different endpoint
    order.isRated = true;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: newReview,
    });
  } catch (err) {
    console.error("Rate Order Error:", err);
    res.status(500).json({ success: false, error: "Failed to submit rating" });
  }
};

// ========== 12. GET ORDER STATISTICS ==========
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Orders as client
    const clientOrders = await Order.find({ clientId: userId });

    // Orders as freelancer
    const freelancerOrders = await Order.find({ freelancerId: userId });

    const stats = {
      asClient: {
        total: clientOrders.length,
        pending: clientOrders.filter((o) => o.status === "pending").length,
        inProgress: clientOrders.filter((o) => o.status === "in_progress")
          .length,
        completed: clientOrders.filter((o) => o.status === "completed").length,
        cancelled: clientOrders.filter((o) => o.status === "cancelled").length,
        totalSpent: clientOrders
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + o.price, 0),
      },
      asFreelancer: {
        total: freelancerOrders.length,
        pending: freelancerOrders.filter((o) => o.status === "pending").length,
        inProgress: freelancerOrders.filter((o) => o.status === "in_progress")
          .length,
        completed: freelancerOrders.filter((o) => o.status === "completed")
          .length,
        cancelled: freelancerOrders.filter((o) => o.status === "cancelled")
          .length,
        totalEarned: freelancerOrders
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + o.price, 0),
      },
    };

    res.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
};

module.exports = exports;
