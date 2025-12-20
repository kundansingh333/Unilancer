// // // backend/server.js
// // const express = require("express");
// // const http = require("http");
// // const socketIO = require("socket.io");

// // const cors = require("cors");
// // const dotenv = require("dotenv");
// // const connectDB = require("./config/db");
// // const errorHandler = require("./middleware/errorHandler");

// // // Load environment variables
// // dotenv.config();

// // // Initialize Express app
// // const app = express();
// // const server = http.createServer(app);

// // // ========== DATABASE CONNECTION ==========
// // connectDB();

// // // ========== SOCKET.IO SETUP ==========
// // const io = socketIO(server, {
// //   cors: {
// //     origin: process.env.FRONTEND_URL || "http://localhost:5173",
// //     methods: ["GET", "POST"],
// //     credentials: true,
// //   },
// // });

// // // Make io accessible globally
// // global.io = io;

// // // Socket.io connection handling
// // io.on("connection", (socket) => {
// //   console.log("🔌 User connected:", socket.id);

// //   // User joins their personal room
// //   socket.on("join", (userId) => {
// //     socket.join(userId);
// //     console.log(`✅ User ${userId} joined their room`);

// //     // Send online status to friends/connections
// //     socket.broadcast.emit("user-online", userId);
// //   });

// //   // Typing indicator
// //   socket.on("typing", (data) => {
// //     const { receiverId, isTyping } = data;
// //     io.to(receiverId).emit("user-typing", {
// //       userId: data.userId,
// //       isTyping,
// //     });
// //   });

// //   // Handle disconnection
// //   socket.on("disconnect", () => {
// //     console.log("❌ User disconnected:", socket.id);
// //     // You can emit offline status here if needed
// //   });
// // });

// // console.log("🚀 Socket.io initialized");

// // // ========== MIDDLEWARE ==========
// // // Body parser
// // // app.use(express.json());
// // // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json({ limit: "50mb" }));
// // app.use(express.urlencoded({ limit: "50mb", extended: true }));

// // // CORS configuration
// // app.use(
// //   cors({
// //     origin: process.env.FRONTEND_URL || "http://localhost:5173",
// //     credentials: true,
// //   })
// // );

// // // Request logging (development)
// // if (process.env.NODE_ENV === "development") {
// //   app.use((req, res, next) => {
// //     console.log(`${req.method} ${req.path}`);
// //     next();
// //   });
// // }

// // // ========== ROUTES ==========
// // app.use("/api/auth", require("./routes/auth"));
// // app.use("/api/jobs", require("./routes/jobs"));
// // app.use("/api/events", require("./routes/events"));
// // app.use("/api/gigs", require("./routes/gigs"));
// // app.use("/api/orders", require("./routes/orders"));
// // app.use("/api/messages", require("./routes/messages"));
// // app.use("/api/notifications", require("./routes/notifications"));
// // app.use("/api/admin", require("./routes/admin"));
// // app.use("/api/users", require("./routes/users"));

// // // Health check route
// // app.get("/api/health", (req, res) => {
// //   res.json({
// //     success: true,
// //     message: "Server is running",
// //     timestamp: new Date().toISOString(),
// //   });
// // });

// // // 404 handler
// // app.use((req, res) => {
// //   res.status(404).json({
// //     success: false,
// //     error: "Route not found",
// //   });
// // });

// // // ========== ERROR HANDLER ==========
// // app.use(errorHandler);

// // // ========== START SERVER ==========
// // const PORT = process.env.PORT || 5000;

// // server.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// //   console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
// //   console.log(`📡 API: http://localhost:${PORT}/api`);
// //   console.log(`💬 Socket.io: Ready for real-time connections`);
// // });

// // // Handle unhandled promise rejections
// // process.on("unhandledRejection", (err) => {
// //   console.error(`🔴 Unhandled Rejection: ${err.message}`);
// //   // Close server & exit
// //   process.exit(1);
// // });

// // backend/server.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io"); // ✅ FIXED
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const errorHandler = require("./middleware/errorHandler");

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const server = http.createServer(app);

// // ========== DATABASE CONNECTION ==========
// connectDB();

// // ========== SOCKET.IO SETUP ==========
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Make io accessible globally
// global.io = io;

// // Socket.io connection handling
// io.on("connection", (socket) => {
//   console.log("🔌 User connected:", socket.id);

//   // User joins their personal room
//   socket.on("join", (userId) => {
//     if (!userId) return;

//     socket.join(userId);
//     console.log(`✅ User ${userId} joined their room`);

//     // Notify others that user is online
//     socket.broadcast.emit("user-online", userId);
//   });

//   // Typing indicator
//   socket.on("typing", ({ receiverId, isTyping, userId }) => {
//     if (!receiverId || !userId) return;

//     io.to(receiverId).emit("typing", {
//       userId,
//       isTyping,
//     });
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// console.log("🚀 Socket.io initialized");

// // ========== MIDDLEWARE ==========
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// // CORS configuration
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

// // Request logging (development only)
// if (process.env.NODE_ENV === "development") {
//   app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
//   });
// }

// // ========== ROUTES ==========
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/jobs", require("./routes/jobs"));
// app.use("/api/events", require("./routes/events"));
// app.use("/api/gigs", require("./routes/gigs"));
// app.use("/api/orders", require("./routes/orders"));
// app.use("/api/messages", require("./routes/messages"));
// app.use("/api/notifications", require("./routes/notifications"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/users", require("./routes/users"));

// // Health check route
// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Server is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: "Route not found",
//   });
// });

// // ========== ERROR HANDLER ==========
// app.use(errorHandler);

// // ========== START SERVER ==========
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
//   console.log(`📡 API: http://localhost:${PORT}/api`);
//   console.log(`💬 Socket.io: Ready for real-time connections`);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err) => {
//   console.error(`🔴 Unhandled Rejection: ${err.message}`);
//   process.exit(1);
// });

// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
// const fix= require("./fix_db");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ================= DB =================
connectDB();

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ VERY IMPORTANT: Allow socket.io preflight
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ================= SOCKET.IO =================
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
//   allowEIO3: true, // ✅ CRITICAL FIX
// });

// // Make global
// global.io = io;

// io.on("connection", (socket) => {
//   console.log("🔌 Socket connected:", socket.id);

//   socket.on("join", (userId) => {
//     if (!userId) return;
//     socket.join(userId);
//     console.log(`✅ User joined room: ${userId}`);
//   });

//   socket.on("typing", ({ receiverId, userId, isTyping }) => {
//     if (!receiverId || !userId) return;
//     io.to(receiverId).emit("typing", { userId, isTyping });
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Socket disconnected:", socket.id);
//   });
// });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // IMPORTANT
});

global.io = io;

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined room`);
  });

  socket.on("typing", ({ receiverId, userId, isTyping }) => {
    io.to(receiverId).emit("typing", { userId, isTyping });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/events", require("./routes/events"));
app.use("/api/gigs", require("./routes/gigs"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));

app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

app.use(errorHandler);

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  console.log(`💬 Socket.io ready`);
});
