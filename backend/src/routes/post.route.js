import express from "express";
import {
  createPost,
  getPosts,
  // getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/", upload.single("image"), createPost);

router.get("/", getPosts);

// router.get("/:id", getPostById);

router.put("/:id", upload.single("image"), updatePost);

router.delete("/:id", deletePost);

export default router;
