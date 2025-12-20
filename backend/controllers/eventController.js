// backend/controllers/eventController.js
const Event = require("../models/Event");
const User = require("../models/User");

// ========== 1. CREATE EVENT ==========
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      dateTime,
      endDateTime,
      duration,
      venue,
      venueType,
      venueAddress,
      meetingLink,
      organizer,
      organizerContact,
      registrationRequired,
      registrationDeadline,
      registrationFee,
      capacity,
      eligibility,
      eventImage,
      tags,
      agenda,
      prizes,
      speakers,
      sponsors,
      requirements,
      rules,
      externalLinks,
    } = req.body;

    // Get user
    const user = await User.findById(req.userId);

    // Create event
    const event = new Event({
      title,
      description,
      eventType,
      dateTime,
      endDateTime,
      duration,
      venue,
      venueType,
      venueAddress,
      meetingLink,
      organizer,
      organizerContact,
      registrationRequired,
      registrationDeadline,
      registrationFee,
      capacity,
      eligibility,
      eventImage,
      tags,
      agenda,
      prizes,
      speakers,
      sponsors,
      requirements,
      rules,
      externalLinks,
      organizedBy: req.userId,
      organizedByRole: user.role,
      isApproved: user.role === "admin", // Auto-approve admin events
    });

    await event.save();

    res.status(201).json({
      success: true,
      message:
        user.role === "admin"
          ? "Event created successfully"
          : "Event created and is pending admin approval",
      event,
      requiresApproval: user.role !== "admin",
    });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create event",
    });
  }
};

// ========== 2. GET ALL EVENTS ==========

// exports.getAllEvents = async (req, res) => {
//   try {
//     const {
//       status = "all",
//       search,
//       eventType,
//       venueType,
//       isFeatured,
//       fromDate,
//       toDate,
//       sortBy = "dateTime",
//       order = "asc",
//       page = 1,
//       limit = 9,
//     } = req.query;

//     const query = { isApproved: true };

//     if (status !== "all") {
//       query.status = status;
//     }

//     if (search) {
//       query.$text = { $search: search };
//     }

//     if (eventType) query.eventType = eventType;
//     if (venueType) query.venueType = venueType;
//     if (isFeatured === "true") query.isFeatured = true;

//     const events = await Event.find(query).sort({
//       [sortBy]: order === "desc" ? -1 : 1,
//     });

//     res.json({ success: true, events });
//   } catch (err) {
//     res.status(500).json({ success: false, error: "Failed to fetch events" });
//   }
// };

// // ========== 3. GET SINGLE EVENT ==========
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate(
        "organizedBy",
        "name email role profilePicture company jobTitle"
      )
      .populate(
        "registeredUsers.userId",
        "name email branch year rollNumber profilePicture"
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Increment view count (but not for organizer)
    if (req.userId && event.organizedBy._id.toString() !== req.userId) {
      await event.incrementViews();
    }

    // Check user status
    const userStatus = req.userId
      ? {
          isRegistered: event.isUserRegistered(req.userId),
          registration: event.getUserRegistration(req.userId),
        }
      : null;

    res.json({
      success: true,
      event,
      userStatus,
      registrationOpen: event.isRegistrationOpen(),
    });
  } catch (err) {
    console.error("Get event error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch event",
    });
  }
};

// controllers/eventController.js
// const Event = require("../models/Event");

//

exports.getAllEvents = async (req, res) => {
  try {
    const {
      status = "all",
      search,
      eventType,
      venueType,
      isFeatured,
      sortBy = "dateTime",
      order = "asc",
      page = 1,
      limit = 9,
    } = req.query;

    const query = { isApproved: true };

    // STATUS
    if (status !== "all") {
      query.status = status;
    }

    // SEARCH (TEXT INDEX)
    if (search) {
      query.$text = { $search: search };
    }

    // FILTERS
    if (eventType) query.eventType = eventType;
    if (venueType) query.venueType = venueType;
    if (isFeatured === "true") query.isFeatured = true;

    // PAGINATION
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // QUERY
    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limitNum)
        .select(
          "title eventType dateTime venue venueType eventImage organizedBy status"
        ),
      Event.countDocuments(query),
    ]);

    res.json({
      success: true,
      events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch events",
    });
  }
};

// ========== 4. UPDATE EVENT ==========
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (event.organizedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this event",
      });
    }

    // Don't allow updating certain fields
    delete updates.organizedBy;
    delete updates.registeredUsers;
    delete updates.isApproved;
    delete updates.views;

    // Update event
    Object.assign(event, updates);
    await event.save();

    res.json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update event",
    });
  }
};

// ========== 5. DELETE EVENT ==========
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (event.organizedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this event",
      });
    }

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete event",
    });
  }
};

// ========== 6. REGISTER FOR EVENT ==========
exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        error: "Registration is closed for this event",
      });
    }

    // Check if already registered
    if (event.isUserRegistered(req.userId)) {
      return res.status(400).json({
        success: false,
        error: "You are already registered for this event",
      });
    }

    // Check if event is full
    if (event.isFull()) {
      return res.status(400).json({
        success: false,
        error: "Event is full. No more registrations allowed.",
      });
    }

    // Get user details for eligibility check
    const user = await User.findById(req.userId);

    // Check eligibility
    const { openTo, branches, years } = event.eligibility;

    // Role check
    if (!openTo.includes("all") && !openTo.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: `This event is only for ${openTo.join(", ")}`,
      });
    }

    // Branch check (for students)
    if (
      user.role === "student" &&
      branches.length > 0 &&
      !branches.includes("All")
    ) {
      if (!branches.includes(user.branch)) {
        return res.status(403).json({
          success: false,
          error: `This event is only for ${branches.join(", ")} students`,
        });
      }
    }

    // Year check (for students)
    if (user.role === "student" && years.length > 0) {
      if (!years.includes(user.year)) {
        return res.status(403).json({
          success: false,
          error: `This event is only for year ${years.join(", ")} students`,
        });
      }
    }

    // Determine payment status
    let paymentStatus = "free";
    if (event.registrationFee > 0) {
      paymentStatus = transactionId ? "paid" : "pending";
    }

    // Add registration
    event.registeredUsers.push({
      userId: req.userId,
      registeredAt: Date.now(),
      paymentStatus,
      transactionId: transactionId || undefined,
    });

    await event.save();

    res.json({
      success: true,
      message: "Successfully registered for the event",
      requiresPayment: event.registrationFee > 0 && !transactionId,
    });
  } catch (err) {
    console.error("Register event error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to register for event",
    });
  }
};

// ========== 7. UNREGISTER FROM EVENT ==========
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check if registered
    if (!event.isUserRegistered(req.userId)) {
      return res.status(400).json({
        success: false,
        error: "You are not registered for this event",
      });
    }

    // Don't allow unregister if event has started
    if (event.status !== "upcoming") {
      return res.status(400).json({
        success: false,
        error: "Cannot unregister from an ongoing or completed event",
      });
    }

    // Remove registration
    event.registeredUsers = event.registeredUsers.filter(
      (reg) => reg.userId.toString() !== req.userId
    );

    await event.save();

    res.json({
      success: true,
      message: "Successfully unregistered from event",
    });
  } catch (err) {
    console.error("Unregister event error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to unregister from event",
    });
  }
};

// ========== 8. GET EVENT REGISTRATIONS ==========
exports.getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, attended } = req.query;

    const event = await Event.findById(id).populate(
      "registeredUsers.userId",
      "name email branch year rollNumber profilePicture phone"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (event.organizedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view registrations",
      });
    }

    // Filter registrations
    let registrations = event.registeredUsers;

    if (paymentStatus) {
      registrations = registrations.filter(
        (reg) => reg.paymentStatus === paymentStatus
      );
    }

    if (attended !== undefined) {
      registrations = registrations.filter(
        (reg) => reg.attended === (attended === "true")
      );
    }

    res.json({
      success: true,
      registrations,
      total: registrations.length,
      stats: {
        totalRegistrations: event.totalRegistrations,
        attendanceCount: event.attendanceCount,
        attendanceRate: event.getAttendanceRate(),
        availableSpots: event.availableSpots,
      },
    });
  } catch (err) {
    console.error("Get registrations error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch registrations",
    });
  }
};

// ========== 9. MARK ATTENDANCE ==========
exports.markAttendance = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { attended } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check authorization
    const user = await User.findById(req.userId);
    if (event.organizedBy.toString() !== req.userId && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    // Find registration
    const registration = event.registeredUsers.find(
      (reg) => reg.userId.toString() === userId
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: "User not registered for this event",
      });
    }

    // Update attendance
    const wasAttended = registration.attended;
    registration.attended = attended;

    // Update attendance count
    if (attended && !wasAttended) {
      event.attendanceCount += 1;
    } else if (!attended && wasAttended) {
      event.attendanceCount = Math.max(0, event.attendanceCount - 1);
    }

    await event.save();

    res.json({
      success: true,
      message: "Attendance updated",
      registration,
    });
  } catch (err) {
    console.error("Mark attendance error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to mark attendance",
    });
  }
};

// ========== 10. GET MY ORGANIZED EVENTS ==========
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizedBy: req.userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      events,
      total: events.length,
    });
  } catch (err) {
    console.error("Get my events error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your events",
    });
  }
};

// ========== 11. GET MY REGISTERED EVENTS ==========
exports.getMyRegistrations = async (req, res) => {
  try {
    console.log("Fetching registrations for user:", req.userId);
    const events = await Event.find({
      "registeredUsers.userId": req.userId,
    })
      .populate("organizedBy", "name email role profilePicture")
      .sort({ dateTime: 1 });

    // Extract registration details
    const registrations = events.map((event) => {
      const registration = event.registeredUsers.find(
        (reg) => reg.userId.toString() === req.userId
      );

      return {
        event: {
          _id: event._id,
          title: event.title,
          eventType: event.eventType,
          dateTime: event.dateTime,
          endDateTime: event.endDateTime,
          venue: event.venue,
          venueType: event.venueType,
          status: event.status,
          eventImage: event.eventImage,
          organizedBy: event.organizedBy,
        },
        registration: {
          registeredAt: registration.registeredAt,
          paymentStatus: registration.paymentStatus,
          attended: registration.attended,
          transactionId: registration.transactionId,
        },
      };
    });

    res.json({
      success: true,
      registrations,
      total: registrations.length,
    });
  } catch (err) {
    console.error("Get registrations error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your registrations",
    });
  }
};

// ========== 12. GET FEATURED EVENTS ==========
exports.getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isFeatured: true,
      status: "upcoming",
      isApproved: true,
      dateTime: { $gt: Date.now() },
    })
      .populate("organizedBy", "name email role profilePicture")
      .sort({ dateTime: 1 })
      .limit(5);

    res.json({
      success: true,
      events,
    });
  } catch (err) {
    console.error("Get featured events error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured events",
    });
  }
};

//cloudinary setup

exports.uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    res.json({
      success: true,
      imageUrl: req.file.path, // ✅ Cloudinary URL
    });
  } catch (err) {
    console.error("Event image upload error:", err);
    res.status(500).json({
      success: false,
      error: "Image upload failed",
    });
  }
};

module.exports = exports;
