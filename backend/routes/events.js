// module.exports = router;

const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

/* ================= STATIC ROUTES (MUST BE FIRST) ================= */

// 1. GET Requests (Static)
router.get("/featured", eventController.getFeaturedEvents);
router.get("/my/organized", auth, eventController.getMyEvents);
router.get("/my/registered", auth, eventController.getMyRegistrations);
router.get("/", eventController.getAllEvents);

// 2. POST Requests (Static)
// Moved this UP so it's safely away from any /:id logic
router.post("/create", auth, eventController.createEvent);

//cloudinary upload route
router.post(
  "/upload-image",
  auth,
  upload.single("image"),
  eventController.uploadEventImage
);

/* ================= DYNAMIC ROUTES (/:id) ================= */

// 3. Event Registration (Specific /:id actions)
router.post("/:id/register", auth, eventController.registerForEvent);
router.delete("/:id/register", auth, eventController.unregisterFromEvent);

// 4. Specific Management & Data
router.get("/:id/registrations", auth, eventController.getEventRegistrations);
router.put("/:id/attendance/:userId", auth, eventController.markAttendance);
router.put("/:id/edit", auth, eventController.updateEvent);

// 5. Generic /:id operations (MUST BE LAST)
router.delete("/:id", auth, eventController.deleteEvent);
router.get("/:id", eventController.getEventById);

module.exports = router;
