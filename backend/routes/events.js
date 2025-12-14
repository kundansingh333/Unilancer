// // backend/routes/events.js
// const express = require("express");
// const router = express.Router();
// const eventController = require("../controllers/eventController");
// const auth = require("../middleware/auth");
// const roleAuth = require("../middleware/roleAuth");

// // ========== PUBLIC ROUTES ==========

// /**
//  * @route   GET /api/events
//  * @desc    Get all events (with filters & pagination)
//  * @access  Public
//  * @query   page, limit, search, eventType, venueType, status, fromDate, toDate, isFeatured, sortBy, order
//  */
// router.get("/", eventController.getAllEvents);

// /**
//  * @route   GET /api/events/featured
//  * @desc    Get featured events
//  * @access  Public
//  */
// router.get("/featured", eventController.getFeaturedEvents);

// /**
//  * @route   GET /api/events/:id
//  * @desc    Get single event by ID
//  * @access  Public
//  */
// router.get("/:id", eventController.getEventById);

// // ========== PROTECTED ROUTES (All authenticated users) ==========

// /**
//  * @route   GET /api/events/my/organized
//  * @desc    Get all events organized by me
//  * @access  Private
//  */
// router.get("/my/organized", auth, eventController.getMyEvents);

// /**
//  * @route   GET /api/events/my/registered
//  * @desc    Get all events I'm registered for
//  * @access  Private
//  */
// router.get("/my/registered", auth, eventController.getMyRegistrations);

// /**
//  * @route   POST /api/events/:id/register
//  * @desc    Register for an event
//  * @access  Private
//  * @body    { transactionId } (optional, for paid events)
//  */
// router.post("/:id/register", auth, eventController.registerForEvent);

// /**
//  * @route   DELETE /api/events/:id/register
//  * @desc    Unregister from an event
//  * @access  Private
//  */
// router.delete("/:id/register", auth, eventController.unregisterFromEvent);

// // ========== EVENT CREATION (All roles can create events) ==========

// /**
//  * @route   POST /api/events
//  * @desc    Create a new event
//  * @access  Private (All authenticated users)
//  * @body    { title, description, eventType, dateTime, venue, ... }
//  */
// router.post("/create", auth, eventController.createEvent);

// /**
//  * @route   PUT /api/events/:id
//  * @desc    Update an event
//  * @access  Private (Event organizer or Admin)
//  */
// router.put("/:id/edit", auth, eventController.updateEvent);

// /**
//  * @route   DELETE /api/events/:id
//  * @desc    Delete an event
//  * @access  Private (Event organizer or Admin)
//  */
// router.delete("/:id", auth, eventController.deleteEvent);

// // ========== REGISTRATION MANAGEMENT (Event organizer or Admin) ==========

// /**
//  * @route   GET /api/events/:id/registrations
//  * @desc    Get all registrations for an event
//  * @access  Private (Event organizer or Admin)
//  * @query   paymentStatus (pending, paid, free), attended (true, false)
//  */
// router.get("/:id/registrations", auth, eventController.getEventRegistrations);

// /**
//  * @route   PUT /api/events/:id/attendance/:userId
//  * @desc    Mark attendance for a user
//  * @access  Private (Event organizer or Admin)
//  * @body    { attended: true/false }
//  */
// router.put("/:id/attendance/:userId", auth, eventController.markAttendance);

// module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const eventController = require("../controllers/eventController");
// // const auth = require("../middleware/auth");

// // // PUBLIC
// // router.get("/", eventController.getAllEvents);
// // router.get("/featured", eventController.getFeaturedEvents);

// // // PROTECTED (specific before dynamic)
// // // router.get("/my/organized", auth, eventController.getMyEvents);
// // // router.get("/my/registered", auth, eventController.getMyRegistrations);
// // router.get("/my-events", auth, eventController.getMyEvents);
// // router.get("/my-registrations", auth, eventController.getMyRegistrations);

// // // REGISTRATION
// // router.post("/:id/register", auth, eventController.registerForEvent);
// // router.delete("/:id/register", auth, eventController.unregisterFromEvent);

// // // CREATE / EDIT / DELETE
// // router.post("/create", auth, eventController.createEvent);
// // router.put("/:id/edit", auth, eventController.updateEvent);
// // router.delete("/:id", auth, eventController.deleteEvent);

// // // ATTENDANCE
// // router.get("/:id/registrations", auth, eventController.getEventRegistrations);
// // router.put("/:id/attendance/:userId", auth, eventController.markAttendance);

// // // MUST BE LAST!!!
// // router.get("/:id", eventController.getEventById);

// // module.exports = router;

// backend/routes/events.js

// backend/routes/events.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const auth = require("../middleware/auth");

/* ================= PUBLIC ================= */

// Featured MUST be before :id
router.get("/featured", eventController.getFeaturedEvents);

// My routes MUST be before :id
router.get("/my/organized", auth, eventController.getMyEvents);
router.get("/my/registered", auth, eventController.getMyRegistrations);

// All events
router.get("/", eventController.getAllEvents);

/* ================= EVENT REGISTRATION ================= */

router.post("/:id/register", auth, eventController.registerForEvent);
router.delete("/:id/register", auth, eventController.unregisterFromEvent);

/* ================= EVENT MANAGEMENT ================= */

router.post("/create", auth, eventController.createEvent);
router.put("/:id/edit", auth, eventController.updateEvent);
router.delete("/:id", auth, eventController.deleteEvent);

/* ================= REGISTRATIONS (VERY IMPORTANT) ================= */

router.get("/:id/registrations", auth, eventController.getEventRegistrations);
router.put("/:id/attendance/:userId", auth, eventController.markAttendance);

/* ================= SINGLE EVENT (MUST BE LAST) ================= */

router.get("/:id", eventController.getEventById);

module.exports = router;
