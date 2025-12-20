// src/socket/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:5001", {
  withCredentials: true,
  transports: ["websocket"], // IMPORTANT
  autoConnect: false, // we control when to connect
});
