import multer from "multer";
import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "../controllers/comment.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
const upload = multer();
const router = express.Router();

router.post("/", protectedRoute, upload.single("image"), createComment);
router.put(
  "/:commentId",
  protectedRoute,
  upload.single("image"),
  updateComment
);
router.get("/:postId", protectedRoute, getCommentsByPost);
router.delete("/:commentId", protectedRoute, deleteComment);
export default router;
