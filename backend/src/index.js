import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/dB.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import postRoutes from "./routes/post.route.js";
import likeRoutes from "./routes/like.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();
const server = http.createServer(app); // Sử dụng chung server với Express

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Tăng giới hạn body parser
app.use(express.json({ limit: "50mb" })); // Giới hạn 50MB cho JSON (tùy chọn)
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Giới hạn 50MB cho URL-encoded
// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
// Khởi tạo Socket.IO trên cùng server Express
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
const userSocketMap = {}; // {userId: socketId}
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Lắng nghe cổng
const PORT = process.env.PORT || 4500;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
