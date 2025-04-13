import mongoose from "mongoose";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { uploadToCloudinary } from "../lib/utils/handle-promise.js";
import cloudinary from "../lib/cloudinary.js";
export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user?._id;
    const imageFile = req.file;

    // Kiểm tra dữ liệu đầu vào
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "postId không hợp lệ" });
    }
    if (!text || text.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Nội dung bình luận không được để trống" });
    }
    if (text.length > 500) {
      return res.status(400).json({ error: "Bình luận tối đa 500 ký tự" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Kiểm tra bài đăng tồn tại
      const post = await Post.findById(postId).session(session);
      if (!post) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Bài đăng không tồn tại" });
      }

      let imageUrl = null;
      if (imageFile) {
        const result = await uploadToCloudinary(imageFile.buffer);
        imageUrl = result.secure_url;
      }

      const newComment = new Comment({
        userId,
        postId,
        text,
        image: imageUrl,
      });
      const savedComment = await newComment.save({ session });

      // Tăng commentsCount trong Post
      await Post.findByIdAndUpdate(
        postId,
        { $inc: { commentsCount: 1 } },
        { session }
      );

      await session.commitTransaction();

      // Populate thông tin người dùng
      const populatedComment = await Comment.findById(
        savedComment._id
      ).populate("userId", "fullName profilePic");

      res.status(201).json(populatedComment);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// lấy danh sahcs bình luận theo postId
export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "postId không hợp lệ" });
  }

  try {
    const comments = await Comment.find({ postId })
      .populate("userId", "fullName profilePic")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ postId });

    res.status(200).json({
      comments,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// Xóa bình luận
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "commentId không hợp lệ" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Tìm bình luận
      const comment = await Comment.findById(commentId).session(session);
      if (!comment) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Bình luận không tồn tại" });
      }

      // Kiểm tra quyền xóa
      if (comment.userId.toString() !== userId.toString()) {
        await session.abortTransaction();
        return res
          .status(403)
          .json({ error: "Bạn không có quyền xóa bình luận này" });
      }

      // Xóa ảnh trên Cloudinary nếu có
      if (comment.image) {
        const publicId = comment.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`comments/${publicId}`);
      }

      // Xóa bình luận
      await Comment.findByIdAndDelete(commentId).session(session);

      // Giảm commentsCount trong Post
      await Post.findByIdAndUpdate(
        comment.postId,
        { $inc: { commentsCount: -1 } },
        { session }
      );

      await session.commitTransaction();
      res.status(200).json({ message: "Đã xóa bình luận" });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật bình luận
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const userId = req?.user._id;
  const imageFile = req.file;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "commentId không hợp lệ" });
  }
  if (!text || text.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Nội dung bình luận không được để trống" });
  }
  if (text.length > 500) {
    return res.status(400).json({ message: "Bình luận tối đa 500 ký tự" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Tìm bình luận
    const comment = await Comment.findById(commentId).session(session);
    if (!comment) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }

    // Kiểm tra quyền cập nhật
    if (comment.userId.toString() !== userId.toString()) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "Bạn không có quyền cập nhật bình luận này" });
    }

    let imageUrl = comment.image;
    if (imageFile) {
      // Xóa ảnh cũ trên Cloudinary nếu có
      if (comment.image) {
        const publicId = comment.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`comments/${publicId}`);
      }
      // Upload ảnh mới
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: "comments",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      imageUrl = result.secure_url;
    }

    // Cập nhật bình luận
    comment.text = text;
    comment.image = imageUrl;
    await comment.save({ session });

    await session.commitTransaction();

    // Populate thông tin người dùng
    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "fullName profilePic"
    );

    res.status(200).json({
      message: "Cập nhật bình luận thành công",
      comment: populatedComment,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Lỗi server", error: error.message });
  } finally {
    session.endSession();
  }
};
