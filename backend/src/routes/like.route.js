import express from "express";

import { protectedRoute } from "../middlewares/auth.middleware.js";
import {  toggleLike } from "../controllers/like.controller.js";
const router = express.Router();

// Like một bài viết
// router.post("/:postId", protectedRoute, likePost);
// Dùng cho cả like/unlike
router.post("/:postId/toggle", protectedRoute, toggleLike);
// Unlike một bài viết
// router.delete("/:postId", protectedRoute, unlikePost);

// Kiểm tra user đã like bài viết chưa
// router.get("/:postId/check", protectedRoute, checkUserLike);

// Lấy danh sách like của bài viết
// router.get("/:postId", getLikesByPost);

export default router;
