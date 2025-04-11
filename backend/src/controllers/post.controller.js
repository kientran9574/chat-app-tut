import { uploadToCloudinary } from "../lib/utils/handle-promise.js";
import Post from "../models/post.model.js";

// Tạo bài viết mới
export const createPost = async (req, res) => {
  try {
    const { userId, text } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer); // dùng await hợp lệ ở đây
      imageUrl = result.secure_url;
      const newPost = new Post({
        userId,
        text,
        image: imageUrl,
      });
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } else {
      const newPost = new Post({ userId, text, image: null });
      const savedPost = await newPost.save();
      return res.status(201).json(savedPost);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả bài viết
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "fullName email profilePic"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy bài viết theo ID
// export const getPostById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const post = await Post.findById(id).populate("userId", "username email");
//     if (!post) return res.status(404).json({ message: "Post not found" });
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, removeImage } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    // Cập nhật text nếu có
    if (text !== undefined) {
      post.text = text;
    }
    // Nếu người dùng muốn xoá ảnh
    if (removeImage === "true") {
      post.image = null;
    }
    // Nếu có file mới
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      post.image = result.secure_url;
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Xóa bài viết
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
