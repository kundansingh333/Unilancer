const express = require("express");
const router2 = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

// ========== PROTECTED ROUTES (All require authentication) ==========

/**
 * @route   GET /api/orders
 * @desc    Get all my orders (as client or freelancer)
 * @access  Private
 * @query   status, role (client/freelancer)
 */
router2.get("/", auth, orderController.getMyOrders);

/**
 * @route   GET /api/orders/stats
 * @desc    Get my order statistics
 * @access  Private
 */
router2.get("/stats", auth, orderController.getOrderStats);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private (Order parties only)
 */
router2.get("/:id", auth, orderController.getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 * @body    { gigId, packageType, description, requirements, paymentMethod, transactionId }
 */
router2.post("/", auth, orderController.createOrder);

/**
 * @route   PUT /api/orders/:id/accept
 * @desc    Accept an order (Freelancer)
 * @access  Private (Freelancer only)
 */
router2.put("/:id/accept", auth, orderController.acceptOrder);

/**
 * @route   PUT /api/orders/:id/deliver
 * @desc    Deliver work (Freelancer)
 * @access  Private (Freelancer only)
 * @body    { deliverables: [{ type, name, url, description }] }
 */
router2.put("/:id/deliver", auth, orderController.deliverWork);

/**
 * @route   PUT /api/orders/:id/revision
 * @desc    Request revision (Client)
 * @access  Private (Client only)
 * @body    { reason }
 */
router2.put("/:id/revision", auth, orderController.requestRevision);

/**
 * @route   PUT /api/orders/:id/complete
 * @desc    Complete an order (Client)
 * @access  Private (Client only)
 */
router2.put("/:id/complete", auth, orderController.completeOrder);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private (Client or Freelancer)
 * @body    { reason }
 */
router2.put("/:id/cancel", auth, orderController.cancelOrder);

/**
 * @route   POST /api/orders/:id/dispute
 * @desc    Raise a dispute
 * @access  Private (Client or Freelancer)
 * @body    { reason }
 */
router2.post("/:id/dispute", auth, orderController.raiseDispute);

/**
 * @route   POST /api/orders/:id/messages
 * @desc    Add a message to order
 * @access  Private (Order parties only)
 * @body    { content, attachments }
 */
router2.post("/:id/messages", auth, orderController.addOrderMessage);

/**
 * @route   POST /api/orders/:id/rate
 * @desc    Rate an order
 * @access  Private (Order parties only)
 * @body    { rating, review }
 */
router2.post("/:id/rate", auth, orderController.rateOrder);

module.exports = router2;
