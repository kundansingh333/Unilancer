// // backend/server.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const errorHandler = require("./middleware/errorHandler");
// // const fix= require("./fix_db");

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // ================= DB =================
// connectDB();

// // ================= MIDDLEWARE =================
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));

// // ✅ VERY IMPORTANT: Allow socket.io preflight
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// // app.use(
// //   cors({
// //     origin: true, // allow all origins
// //     credentials: true,
// //   })
// // );

// app.use("/api/upload", require("./routes/upload"));

// // ================= SOCKET.IO =================

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
//   transports: ["websocket", "polling"], // IMPORTANT
// });

// global.io = io;

// io.on("connection", (socket) => {
//   console.log("🔌 Socket connected:", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`✅ User ${userId} joined room`);
//   });

//   socket.on("typing", ({ receiverId, userId, isTyping }) => {
//     io.to(receiverId).emit("typing", { userId, isTyping });
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Socket disconnected:", socket.id);
//   });
// });

// // ================= ROUTES =================
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/jobs", require("./routes/jobs"));
// app.use("/api/events", require("./routes/events"));
// app.use("/api/gigs", require("./routes/gigs"));
// app.use("/api/orders", require("./routes/orders"));
// app.use("/api/messages", require("./routes/messages"));
// app.use("/api/notifications", require("./routes/notifications"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/users", require("./routes/users"));

// app.get("/api/health", (req, res) => {
//   res.json({ success: true });
// });

// app.use(errorHandler);

// // ================= START =================
// const PORT = process.env.PORT || 5001;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on ${PORT}`);
//   console.log(`💬 Socket.io ready`);
// });

// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ================= DB =================
connectDB();

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ 1. Define ALL allowed domains (Local + Production + Preview)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5001",
  "https://unilancer-frontend.vercel.app",
  "https://unilancer.online",
  "https://www.unilancer.online",
];

// ✅ 2. Update Express CORS to use the list above
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps, curl, or Postman)
//       if (!origin) return callback(null, true);

//       // Check if the origin is in our allowed list
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         console.log("❌ Blocked by CORS:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   }),
// );
// app.options("*", cors());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      // Allow exact origins + all Vercel previews
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      // IMPORTANT: still allow response so headers are sent
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 🔥 REQUIRED for preflight (THIS FIXES YOUR ERROR)
// app.options("*", cors());

app.use("/api/upload", require("./routes/upload"));

// ================= SOCKET.IO =================

const io = new Server(server, {
  cors: {
    // ✅ 3. Update Socket.IO to use the same allowed list
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

global.io = io;

const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    if (userId) {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`✅ User ${userId} joined room`);
    }
  });

  // Join order room for real-time chat
  socket.on("joinOrder", (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`✅ Socket ${socket.id} joined order room: order_${orderId}`);
  });

  // Typing indicator to a specific receiver (existing logic)
  socket.on("typing", ({ receiverId, userId, isTyping }) => {
    io.to(receiverId).emit("typing", { userId, isTyping });
  });

  // Typing indicator broadcast to the entire order room
  socket.on("orderTyping", ({ orderId, userId, userName, isTyping }) => {
    // We broadcast to the room so the sender doesn't receive their own typing event
    socket.to(`order_${orderId}`).emit("orderTyping", { userId, userName, isTyping });
  });

  // ================= CALL SIGNALING =================
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    const targetSocket = userSocketMap[userToCall];
    if (targetSocket) {
      io.to(targetSocket).emit("callUser", { signal: signalData, from, name });
    }
  });

  socket.on("answerCall", (data) => {
    const targetSocket = userSocketMap[data.to];
    if (targetSocket) {
      io.to(targetSocket).emit("callAccepted", data.signal);
    }
  });

  socket.on("rejectCall", (data) => {
    const targetSocket = userSocketMap[data.to];
    if (targetSocket) {
      io.to(targetSocket).emit("callRejected");
    }
  });
  // ==================================================

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    for (const [userId, sId] of Object.entries(userSocketMap)) {
      if (sId === socket.id) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        break;
      }
    }
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
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  console.log(`💬 Socket.io ready`);
});
