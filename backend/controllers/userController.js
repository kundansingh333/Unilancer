// backend/controllers/userController.js
const User = require("../models/User");
const Job = require("../models/Job");
const Gig = require("../models/Gig");
const Order = require("../models/Order");

// ========== PROFILE MANAGEMENT ==========

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -verificationToken -resetPasswordToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get additional stats based on role
    let stats = {};

    if (user.role === "student") {
      stats = {
        applicationsCount: await Job.countDocuments({
          "applicants.userId": id,
        }),
        eventsAttended: await require("../models/Event").countDocuments({
          "registeredUsers.userId": id,
          "registeredUsers.attended": true,
        }),
      };
    }

    if (user.role === "alumni" || user.role === "student") {
      stats.gigsCount = await Gig.countDocuments({ createdBy: id });
      stats.ordersCompleted = await Order.countDocuments({
        freelancerId: id,
        status: "completed",
      });
      stats.totalEarnings = await Order.aggregate([
        {
          $match: {
            freelancerId: require("mongoose").Types.ObjectId(id),
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]).then((result) => result[0]?.total || 0);
    }

    if (user.role === "alumni" || user.role === "faculty") {
      stats.jobsPosted = await Job.countDocuments({ postedBy: id });
    }

    if (user.role === "faculty" || user.role === "admin") {
      stats.eventsOrganized = await require("../models/Event").countDocuments({
        organizedBy: id,
      });
    }

    res.json({
      success: true,
      user,
      stats,
    });
  } catch (err) {
    console.error("Get user profile error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profile",
    });
  }
};

// Update user profile
// exports.updateUserProfile = async (req, res) => {
//   try {
//     const {
//       name,
//       bio,
//       skills,
//       projects,
//       achievements,
//       resume,
//       profilePicture,
//       company,
//       jobTitle,
//       linkedIn,
//       upiId,
//       qrCodeImage,
//       openForFreelance,
//     } = req.body;

//     const user = await User.findById(req.userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found",
//       });
//     }

//     // Update common fields
//     if (name) user.name = name;
//     if (bio) user.bio = bio;
//     if (skills) user.skills = skills;
//     if (projects) user.projects = projects;
//     if (achievements) user.achievements = achievements;
//     if (resume) user.resume = resume;
//     if (profilePicture) user.profilePicture = profilePicture;

//     // Alumni specific
//     if (user.role === "alumni") {
//       if (company) user.company = company;
//       if (jobTitle) user.jobTitle = jobTitle;
//       if (linkedIn) user.linkedIn = linkedIn;
//     }

//     // Freelance specific
//     if (openForFreelance !== undefined)
//       user.openForFreelance = openForFreelance;
//     if (upiId) user.upiId = upiId;
//     if (qrCodeImage) user.qrCodeImage = qrCodeImage;

//     await user.save();

//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user: user.getPublicProfile(),
//     });
//   } catch (err) {
//     console.error("Update profile error:", err);

//     // ✅ HANDLE MONGOOSE VALIDATION ERRORS
//     if (err.name === "ValidationError") {
//       const firstError = Object.values(err.errors)[0]?.message;

//       return res.status(400).json({
//         success: false,
//         error: firstError || "Invalid input provided",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       error: "Failed to update profile",
//     });
//   }
// };

// Update user profile
// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const {
      // COMMON
      name,
      bio,
      skills,
      resume,
      profilePicture,
      college,
      notificationPreferences,

      // STUDENT
      branch,
      year,
      section,
      rollNumber,

      // ALUMNI
      company,
      jobTitle,
      yearOfPassing,
      domain,
      linkedIn,

      // FACULTY
      department,
      designation,
      employeeId,

      // FREELANCE
      openForFreelance,
      upiId,
      qrCodeImage,
    } = req.body;

    /* ================= COMMON ================= */
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (resume !== undefined) user.resume = resume;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (college !== undefined) user.college = college;
    if (notificationPreferences !== undefined)
      user.notificationPreferences = notificationPreferences;

    /* ================= STUDENT ================= */
    if (user.role === "student") {
      if (branch !== undefined) user.branch = branch;
      if (year !== undefined) user.year = year;
      if (section !== undefined) user.section = section;
      if (rollNumber !== undefined) user.rollNumber = rollNumber;
    }

    /* ================= ALUMNI ================= */
    if (user.role === "alumni") {
      if (company !== undefined) user.company = company;
      if (jobTitle !== undefined) user.jobTitle = jobTitle;
      if (yearOfPassing !== undefined) user.yearOfPassing = yearOfPassing;
      if (domain !== undefined) user.domain = domain;
      if (linkedIn !== undefined) user.linkedIn = linkedIn;
    }

    /* ================= FACULTY ================= */
    if (user.role === "faculty") {
      if (department !== undefined) user.department = department;
      if (designation !== undefined) user.designation = designation;
      if (employeeId !== undefined) user.employeeId = employeeId;
    }

    /* ================= FREELANCE ================= */
    if (openForFreelance !== undefined)
      user.openForFreelance = openForFreelance;
    if (upiId !== undefined) user.upiId = upiId;
    if (qrCodeImage !== undefined) user.qrCodeImage = qrCodeImage;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.getPublicProfile(),
    });
  } catch (err) {
    console.error("Update profile error:", err);

    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message;
      return res.status(400).json({
        success: false,
        error: firstError || "Invalid input",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    });
  }
};

// ========== SEARCH & DISCOVERY ==========

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const {
      query,
      role,
      branch,
      company,
      skills,
      page = 1,
      limit = 20,
    } = req.query;

    const searchQuery = {};

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
      ];
    }

    // Filters
    if (role) searchQuery.role = role;
    if (branch) searchQuery.branch = branch;
    if (company) searchQuery.company = { $regex: company, $options: "i" };
    if (skills) searchQuery.skills = { $in: skills.split(",") };

    // Only show approved and active users
    searchQuery.isBlocked = false;
    if (role === "alumni" || role === "faculty") {
      searchQuery.isApproved = true;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(searchQuery)
      .select(
        "name email role branch year company jobTitle profilePicture bio skills freelanceRating"
      )
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await User.countDocuments(searchQuery);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to search users",
    });
  }
};

// Get alumni directory
exports.getAlumniDirectory = async (req, res) => {
  try {
    const { company, domain, yearOfPassing, page = 1, limit = 20 } = req.query;

    const query = {
      role: "alumni",
      isApproved: true,
      isBlocked: false,
    };

    if (company) query.company = { $regex: company, $options: "i" };
    if (domain) query.domain = domain;
    if (yearOfPassing) query.yearOfPassing = Number(yearOfPassing);

    const skip = (page - 1) * limit;

    const alumni = await User.find(query)
      .select(
        "name email company jobTitle yearOfPassing domain branch profilePicture linkedIn bio skills"
      )
      .sort({ yearOfPassing: -1, name: 1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    // Get unique companies and domains for filters
    const [companies, domains] = await Promise.all([
      User.distinct("company", { role: "alumni", isApproved: true }),
      User.distinct("domain", { role: "alumni", isApproved: true }),
    ]);

    res.json({
      success: true,
      alumni,
      filters: {
        companies: companies.filter(Boolean),
        domains: domains.filter(Boolean),
      },
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    console.error("Get alumni directory error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alumni directory",
    });
  }
};

// Get top freelancers
exports.getTopFreelancers = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    const query = {
      openForFreelance: true,
      isBlocked: false,
      freelanceRating: { $gte: 4 },
    };

    const freelancers = await User.find(query)
      .select(
        "name email role profilePicture bio skills freelanceRating company jobTitle"
      )
      .sort({ freelanceRating: -1 })
      .limit(Number(limit));

    // Get their gigs
    const freelancersWithGigs = await Promise.all(
      freelancers.map(async (freelancer) => {
        const gigs = await Gig.find({
          createdBy: freelancer._id,
          isActive: true,
          isApproved: true,
        })
          .select("title price category averageRating totalReviews")
          .limit(3);

        return {
          ...freelancer.toObject(),
          gigs,
        };
      })
    );

    res.json({
      success: true,
      freelancers: freelancersWithGigs,
    });
  } catch (err) {
    console.error("Get top freelancers error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch top freelancers",
    });
  }
};

// ========== USER ACTIVITY ==========

// Get user activity timeline
exports.getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20 } = req.query;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    let activities = [];

    // Get recent jobs posted (if alumni/faculty)
    if (["alumni", "faculty"].includes(user.role)) {
      const jobs = await Job.find({ postedBy: id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt");

      activities.push(
        ...jobs.map((job) => ({
          type: "job_posted",
          title: "Posted a job",
          description: job.title,
          timestamp: job.createdAt,
        }))
      );
    }

    // Get recent gigs created
    if (["student", "alumni"].includes(user.role)) {
      const gigs = await Gig.find({ createdBy: id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt");

      activities.push(
        ...gigs.map((gig) => ({
          type: "gig_created",
          title: "Created a gig",
          description: gig.title,
          timestamp: gig.createdAt,
        }))
      );
    }

    // Get recent orders completed
    const completedOrders = await Order.find({
      freelancerId: id,
      status: "completed",
    })
      .sort({ completedAt: -1 })
      .limit(5)
      .select("title completedAt");

    activities.push(
      ...completedOrders.map((order) => ({
        type: "order_completed",
        title: "Completed an order",
        description: order.title,
        timestamp: order.completedAt,
      }))
    );

    // Sort by timestamp and limit
    activities.sort((a, b) => b.timestamp - a.timestamp);
    activities = activities.slice(0, Number(limit));

    res.json({
      success: true,
      activities,
    });
  } catch (err) {
    console.error("Get user activity error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user activity",
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const stats = {};

    // Jobs statistics
    if (["alumni", "faculty"].includes(user.role)) {
      stats.jobs = {
        posted: await Job.countDocuments({ postedBy: id }),
        applications: await Job.aggregate([
          { $match: { postedBy: require("mongoose").Types.ObjectId(id) } },
          { $project: { count: { $size: "$applicants" } } },
          { $group: { _id: null, total: { $sum: "$count" } } },
        ]).then((result) => result[0]?.total || 0),
      };
    }

    // Student statistics
    if (user.role === "student") {
      const applications = await Job.find({
        "applicants.userId": id,
      }).select("applicants");

      const userApplications = applications
        .map((job) =>
          job.applicants.find((app) => app.userId.toString() === id)
        )
        .filter(Boolean);

      stats.applications = {
        total: userApplications.length,
        shortlisted: userApplications.filter(
          (app) => app.status === "shortlisted"
        ).length,
        accepted: userApplications.filter((app) => app.status === "accepted")
          .length,
        rejected: userApplications.filter((app) => app.status === "rejected")
          .length,
      };
    }

    // Gig & Order statistics
    if (["student", "alumni"].includes(user.role)) {
      stats.gigs = {
        created: await Gig.countDocuments({ createdBy: id }),
        active: await Gig.countDocuments({
          createdBy: id,
          isActive: true,
          isApproved: true,
        }),
      };

      stats.orders = {
        asFreelancer: {
          total: await Order.countDocuments({ freelancerId: id }),
          completed: await Order.countDocuments({
            freelancerId: id,
            status: "completed",
          }),
          active: await Order.countDocuments({
            freelancerId: id,
            status: { $in: ["pending", "in_progress", "delivered"] },
          }),
        },
        asClient: {
          total: await Order.countDocuments({ clientId: id }),
          completed: await Order.countDocuments({
            clientId: id,
            status: "completed",
          }),
          active: await Order.countDocuments({
            clientId: id,
            status: { $in: ["pending", "in_progress", "delivered"] },
          }),
        },
      };

      // Earnings
      stats.earnings = await Order.aggregate([
        {
          $match: {
            freelancerId: require("mongoose").Types.ObjectId(id),
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]).then((result) => result[0]?.total || 0);
    }

    // Events
    const Event = require("../models/Event");
    stats.events = {
      organized: await Event.countDocuments({ organizedBy: id }),
      registered: await Event.countDocuments({ "registeredUsers.userId": id }),
      attended: await Event.countDocuments({
        "registeredUsers.userId": id,
        "registeredUsers.attended": true,
      }),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user statistics",
    });
  }
};

module.exports = exports;
