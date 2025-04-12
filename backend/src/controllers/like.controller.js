import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Kiểm tra bài viết tồn tại
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    // Kiểm tra đã like chưa
    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      // Nếu đã like -> thực hiện unlike
      await Like.findOneAndDelete({ userId, postId });
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
        $pull: { likes: userId }, // Nếu bạn dùng mảng likes trong Post
      });

      return res.status(200).json({
        message: "Đã unlike bài viết",
        action: "unlike",
        likesCount: post.likesCount - 1,
      });
    } else {
      // Nếu chưa like -> thực hiện like
      const newLike = new Like({ userId, postId });
      await newLike.save();
      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 },
        $addToSet: { likes: userId }, // Nếu bạn dùng mảng likes trong Post
      });

      return res.status(201).json({
        message: "Đã like bài viết",
        action: "like",
        likesCount: post.likesCount + 1,
        like: newLike,
      });
    }
  } catch (error) {
    console.error("Lỗi khi thao tác like:", error);
    res.status(500).json({ message: "Lỗi server khi thao tác like" });
  }
};
