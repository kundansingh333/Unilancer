// // backend/middleware/auth.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // ========== JWT AUTHENTICATION MIDDLEWARE ==========
// const auth = async (req, res, next) => {
//   try {
//     // Get token from header
//     const authHeader = req.header("Authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         error: "No token provided. Access denied.",
//       });
//     }

//     // Extract token
//     const token = authHeader.replace("Bearer ", "");

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if user still exists
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: "User not found. Token invalid.",
//       });
//     }

//     // Check if user is blocked
//     if (user.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         error: "Your account has been blocked.",
//       });
//     }

//     // Attach user info to request
//     req.userId = decoded.id;
//     req.userRole = decoded.role;

//     next();
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         error: "Token expired. Please login again.",
//       });
//     }

//     if (err.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid token. Access denied.",
//       });
//     }

//     console.error("Auth middleware error:", err);
//     res.status(500).json({
//       success: false,
//       error: "Authentication failed",
//     });
//   }
// };

// module.exports = auth;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========== JWT AUTHENTICATION MIDDLEWARE ==========
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Access denied.",
      });
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found. Token invalid.",
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        error: "Your account has been blocked.",
      });
    }

    // Attach user info to request (EXISTING)
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // ✅ REQUIRED ADDITION (DO NOT REMOVE ANYTHING ELSE)
    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please login again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Access denied.",
      });
    }

    console.error("Auth middleware error:", err);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

module.exports = auth;
