// const errorHandler = (err, req, res, next) => {
//   // 1. Log the error for the developer (server-side only)
//   console.error(`🔴 Error: ${err.message}`.red); // .red requires 'colors' package, or remove it
//   // If you don't use 'colors', just use: console.error(err.stack);

//   // 2. Determine the Status Code
//   // If the controller set a status (e.g. 404, 400), use it.
//   // Otherwise, default to 500 (Internal Server Error).
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

//   res.status(statusCode);

//   // 3. Send the JSON Response
//   res.json({
//     success: false,
//     message: err.message || "Server Error",
//     // Only show the stack trace in development mode for debugging
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// module.exports = errorHandler;

// ========== GLOBAL ERROR HANDLER ==========
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // 1. Mongoose Validation Error (e.g. missing required field)
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  // 2. Mongoose Duplicate Key Error (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists`,
    });
  }

  // 3. Mongoose Cast Error (Invalid ObjectId format)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
    });
  }

  // 4. JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // 5. Default Server Error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
