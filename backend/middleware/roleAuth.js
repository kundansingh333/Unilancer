// // backend/middleware/roleAuth.js
// // ========================================================

// const User = require("../models/User");

// // ========== ROLE-BASED AUTHORIZATION MIDDLEWARE ==========
// const roleAuth = (...allowedRoles) => {
//   return async (req, res, next) => {
//     try {
//       // Get user from database
//       const user = await User.findById(req.userId);

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           error: "User not found",
//         });
//       }

//       // Check if user's role is in allowed roles
//       if (!allowedRoles.includes(user.role)) {
//         return res.status(403).json({
//           success: false,
//           error: `Access denied. This action requires ${allowedRoles.join(
//             " or "
//           )} role.`,
//           requiredRoles: allowedRoles,
//           userRole: user.role,
//         });
//       }

//       // Additional check: Alumni/Faculty must be approved
//       if (
//         (user.role === "alumni" || user.role === "faculty") &&
//         !user.isApproved
//       ) {
//         return res.status(403).json({
//           success: false,
//           error: "Your account is pending admin approval",
//           needsApproval: true,
//         });
//       }

//       // Attach user to request for further use
//       req.user = user;

//       next();
//     } catch (err) {
//       console.error("Role auth error:", err);
//       res.status(500).json({
//         success: false,
//         error: "Authorization failed",
//       });
//     }
//   };
// };

// module.exports = roleAuth;

// // ========================================================
// // backend/middleware/errorHandler.js
// // ========================================================

// // ========== GLOBAL ERROR HANDLER ==========
// const errorHandler = (err, req, res, next) => {
//   console.error("Error:", err);

//   // Mongoose validation error
//   if (err.name === "ValidationError") {
//     const errors = Object.values(err.errors).map((e) => e.message);
//     return res.status(400).json({
//       success: false,
//       error: "Validation failed",
//       details: errors,
//     });
//   }

//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyPattern)[0];
//     return res.status(400).json({
//       success: false,
//       error: `${field} already exists`,
//     });
//   }

//   // Mongoose cast error (invalid ObjectId)
//   if (err.name === "CastError") {
//     return res.status(400).json({
//       success: false,
//       error: "Invalid ID format",
//     });
//   }

//   // JWT errors
//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       success: false,
//       error: "Invalid token",
//     });
//   }

//   if (err.name === "TokenExpiredError") {
//     return res.status(401).json({
//       success: false,
//       error: "Token expired",
//     });
//   }

//   // Default error
//   res.status(err.statusCode || 500).json({
//     success: false,
//     error: err.message || "Internal server error",
//   });
// };

// module.exports = errorHandler;

// // ========================================================
// // USAGE EXAMPLES
// // ========================================================

// /*
// // Protect route (any authenticated user)
// router.get('/profile', auth, getProfile);

// // Protect route (specific role)
// router.post('/jobs', auth, roleAuth('alumni', 'faculty', 'admin'), createJob);

// // Protect route (students only)
// router.post('/jobs/:id/apply', auth, roleAuth('student'), applyForJob);

// // Protect route (admin only)
// router.get('/admin/users', auth, roleAuth('admin'), getAllUsers);

// // Multiple roles
// router.post('/gigs', auth, roleAuth('student', 'alumni'), createGig);
// */

const User = require("../models/User");

// ========== ROLE-BASED AUTHORIZATION MIDDLEWARE ==========
// Usage: router.post('/job', auth, roleAuth('alumni', 'admin'), createJob)
const roleAuth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // 1. Get user from database using ID from auth middleware
      // We fetch fresh data to ensure role/approval status hasn't changed
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // 2. Check if user's role is in the allowed list
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: `Access denied. This action requires ${allowedRoles.join(
            " or "
          )} role.`,
          requiredRoles: allowedRoles,
          userRole: user.role,
        });
      }

      // 3. Additional Security: Check if account is approved
      // (Alumni & Faculty often require manual admin approval)
      if (
        (user.role === "alumni" || user.role === "faculty") &&
        !user.isApproved
      ) {
        return res.status(403).json({
          success: false,
          error: "Your account is pending admin approval",
          needsApproval: true,
        });
      }

      // 4. Attach full user object to request for the next controller to use
      req.user = user;

      next();
    } catch (err) {
      console.error("Role auth error:", err);
      res.status(500).json({
        success: false,
        error: "Authorization failed",
      });
    }
  };
};

module.exports = roleAuth;
