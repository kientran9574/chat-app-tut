/* eslint-disable react-hooks/exhaustive-deps */
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post, onUpdatePost }) => {
  const { authUser } = useAuthStore();
  const isOwner = authUser?._id === post.userId?._id;
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [editImage, setEditImage] = useState(post.image);
  const [loading, setLoading] = useState(false);
  // Like
  const [isLiked, setIsLiked] = useState(post.likes?.includes(authUser?._id));
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  // Comment
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [commentImgPreview, setCommentImgPreview] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  // Edit comment
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentImage, setEditCommentImage] = useState(null);
  const [editCommentImgPreview, setEditCommentImgPreview] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const commentFileInputRef = useRef(null);
  const editCommentFileInputRef = useRef(null);

  // Lấy danh sách bình luận
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/comments/${post._id}?page=1&limit=10`
      );
      setComments(response.data.comments);
    } catch (error) {
      toast.error("Không thể tải bình luận.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  // Handle delete post
  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;
    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      navigate(0);
      toast.success("Đã xoá bài viết!");
    } catch (err) {
      toast.error("Xoá thất bại");
    }
  };

  // Handle update post
  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", editText);

      if (editImage === null) {
        formData.append("removeImage", "true");
      }

      if (fileInputRef.current.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const res = await axiosInstance.put(`/posts/${post._id}`, formData);

      toast.success("Cập nhật thành công!");
      setEditImage(res.data.image);
      onUpdatePost?.(res.data);
      setIsEditing(false);
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Hình ảnh quá lớn! Chọn file nhỏ hơn 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEditImage(null);
  };

  // Handle like post
  const handleLikePost = async () => {
    if (!authUser) {
      toast.error("Vui lòng đăng nhập để thích bài viết!");
      return;
    }
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1);
    try {
      const res = await axiosInstance.post(`/likes/${post._id}/toggle`);

      if (res.data.action === "like") {
        onUpdatePost?.({
          ...post,
          likes: [...post.likes, authUser._id],
          likesCount: res.data.likesCount,
        });
      } else if (res.data.action === "unlike") {
        onUpdatePost?.({
          ...post,
          likes: post.likes.filter(
            (id) => id.toString() !== authUser._id.toString()
          ),
          likesCount: res.data.likesCount,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thao tác like");
      setIsLiked(!newIsLiked);
      setLikeCount(newIsLiked ? likeCount - 1 : likeCount + 1);
    }
  };

  // Handle comment image change
  const handleCommentImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Hình ảnh quá lớn! Chọn file nhỏ hơn 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }
    setCommentImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCommentImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      return;
    }
    if (!commentText.trim() && !commentImage) {
      toast.error("Vui lòng nhập nội dung hoặc chọn ảnh!");
      return;
    }

    setCommentLoading(true);
    const formData = new FormData();
    formData.append("postId", post._id);
    formData.append("text", commentText);
    if (commentImage) {
      formData.append("image", commentImage);
    }

    try {
      const response = await axiosInstance.post("/comments", formData);
      setComments((prev) => [response.data, ...prev]);
      setCommentText("");
      setCommentImage(null);
      setCommentImgPreview(null);
      toast.success("Bình luận thành công!");
      onUpdatePost?.({ ...post, commentsCount: post.commentsCount + 1 });
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể gửi bình luận.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!authUser) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;

    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Đã xóa bình luận!");
      onUpdatePost?.({ ...post, commentsCount: post.commentsCount - 1 });
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể xóa bình luận.");
    }
  };

  // Handle edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
    setEditCommentImage(comment.image);
    setEditCommentImgPreview(comment.image);
  };

  const handleEditCommentImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Hình ảnh quá lớn! Chọn file nhỏ hơn 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }
    setEditCommentImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditCommentImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditCommentSubmit = async (commentId) => {
    if (!authUser) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    if (!editCommentText.trim() && !editCommentImage) {
      toast.error("Vui lòng nhập nội dung hoặc chọn ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", editCommentText);
      if (editCommentImage === null) {
        formData.append("removeImage", "true");
      }
      if (editCommentFileInputRef.current.files[0]) {
        formData.append("image", editCommentFileInputRef.current.files[0]);
      }

      const response = await axiosInstance.put(
        `/comments/${commentId}`,
        formData
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? response.data : c))
      );
      // navigate(0);
      setEditingCommentId(null);
      setEditCommentText("");
      setEditCommentImage(null);
      setEditCommentImgPreview(null);
      fetchComments();
      toast.success("Chỉnh sửa bình luận thành công!");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Không thể chỉnh sửa bình luận."
      );
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
    setEditCommentImage(null);
    setEditCommentImgPreview(null);
  };

  return (
    <div className="card bg-base-100 shadow-lg rounded-xl p-5 mb-6 max-w-2xl mx-auto">
      {/* Menu button */}
      {isOwner && (
        <div className="absolute top-4 right-4">
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-base-100 shadow-xl rounded-lg border z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2 text-warning"
              >
                <Pencil size={16} /> Chỉnh sửa
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2 text-error"
              >
                <Trash2 size={16} /> Xoá
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img
              src={post.userId?.profilePic || "/default-avatar.png"}
              alt="Avatar"
            />
          </div>
        </div>
        <div className="ml-3">
          <p className="font-semibold text-base-content">
            {post.userId?.fullName || "Unknown User"}
          </p>
          <p className="text-sm text-base-content/70">
            {new Date(post.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-4 space-y-4">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="textarea textarea-bordered w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            placeholder="Nội dung bài viết..."
          />
          {editImage && (
            <div className="relative">
              <img
                src={editImage}
                alt="Preview"
                className="w-full rounded-lg object-cover max-h-96"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
              >
                <X size={18} />
              </button>
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />
            <button
              className="btn btn-outline btn-sm btn-primary"
              onClick={() => fileInputRef.current.click()}
            >
              Thêm / Thay ảnh
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
            <button
              className={`btn btn-primary btn-sm ${loading ? "loading" : ""}`}
              onClick={handleEditSubmit}
            >
              Lưu
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          {post.text && (
            <p className="text-base-content leading-relaxed">{post.text}</p>
          )}
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full rounded-lg mt-3 object-cover max-h-[500px]"
            />
          )}
        </div>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="pt-3">
          {/* Like and comment count */}
          <div className="flex justify-between text-sm text-base-content/70 mb-2">
            {likeCount > 0 && <span>{likeCount} lượt thích</span>}
            {post.commentsCount > 0 && (
              <span>{post.commentsCount} bình luận</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center border-t border-base-200 py-3 mb-3">
            <div className="flex gap-6">
              <button
                onClick={handleLikePost}
                className="flex items-center gap-1 text-base-content/80 hover:text-primary transition"
              >
                <Heart
                  size={22}
                  fill={isLiked ? "#ef4444" : "none"}
                  stroke={isLiked ? "#ef4444" : "currentColor"}
                  className="hover:scale-110 transition"
                />
                <span className="text-sm">Thích</span>
              </button>
              <button className="flex items-center gap-1 text-base-content/80 hover:text-primary transition">
                <MessageCircle size={22} strokeWidth={1.5} />
                <span className="text-sm">Bình luận</span>
              </button>
              <button className="flex items-center gap-1 text-base-content/80 hover:text-primary transition">
                <Send size={22} strokeWidth={1.5} />
                <span className="text-sm">Chia sẻ</span>
              </button>
            </div>
            <button className="text-base-content/80 hover:text-primary transition">
              <Bookmark size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex items-start gap-2 bg-base-200 rounded-full p-2">
              <div className="avatar">
                <div className="w-9 rounded-full">
                  <img
                    src={authUser?.profilePic || "/default-avatar.png"}
                    alt="Avatar"
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="input input-bordered input-sm w-full bg-transparent focus:outline-none rounded-full"
                  disabled={commentLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={commentFileInputRef}
                    onChange={handleCommentImageChange}
                    hidden
                  />
                  <button
                    type="button"
                    onClick={() => commentFileInputRef.current.click()}
                    className="btn btn-ghost btn-circle btn-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12" />
                      <path d="m8 8 4-4 4 4" />
                      <path d="M8 15H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-3" />
                    </svg>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-ghost btn-circle btn-xs"
                    disabled={
                      commentLoading || (!commentText.trim() && !commentImage)
                    }
                  >
                    <Send
                      size={18}
                      className={commentLoading ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
            {commentImgPreview && (
              <div className="relative mt-3 max-w-sm">
                <img
                  src={commentImgPreview}
                  alt="Preview"
                  className="rounded-lg object-cover w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCommentImage(null);
                    setCommentImgPreview(null);
                  }}
                  className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </form>

          {/* Comment list with scrollbar */}
          {comments.length > 0 && (
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 pr-2">
              {comments.map((comment) => (
                <div
                  key={comment?._id}
                  className="flex gap-2 mb-3 group relative"
                >
                  <div className="avatar flex items-start">
                    <div className="w-9 rounded-full">
                      <img
                        src={
                          comment.userId?.profilePic || "/default-avatar.png"
                        }
                        className="w-full rounded-full object-cover"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    {editingCommentId === comment._id ? (
                      <div className="bg-base-200 rounded-lg p-3">
                        <textarea
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="textarea textarea-bordered w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                          placeholder="Nội dung bình luận..."
                        />
                        {editCommentImgPreview && (
                          <div className="relative mt-2">
                            <img
                              src={editCommentImgPreview}
                              alt="Preview"
                              className="rounded-lg object-cover max-w-xs"
                            />
                            <button
                              onClick={() => {
                                setEditCommentImage(null);
                                setEditCommentImgPreview(null);
                              }}
                              className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            ref={editCommentFileInputRef}
                            onChange={handleEditCommentImageChange}
                            hidden
                          />
                          <button
                            className="btn btn-outline btn-xs btn-primary"
                            onClick={() =>
                              editCommentFileInputRef.current.click()
                            }
                          >
                            Thêm / Thay ảnh
                          </button>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={handleCancelEditComment}
                          >
                            Hủy
                          </button>
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => handleEditCommentSubmit(comment._id)}
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-base-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-sm text-base-content">
                              {comment.userId?.fullName}
                            </span>
                            <span className="text-xs text-base-content/70 ml-2">
                              {new Date(comment.createdAt).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-base-content mt-1">
                          {comment.text}
                        </p>
                        {comment.image && (
                          <img
                            src={comment.image}
                            alt="Comment"
                            className="mt-2 max-w-xs rounded-lg"
                          />
                        )}
                        {comment &&
                          authUser?._id &&
                          authUser?._id === comment?.userId?._id && (
                            <>
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="absolute top-2 right-8 btn btn-ghost btn-circle btn-xs text-warning opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="absolute top-2 right-2 btn btn-ghost btn-circle btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
