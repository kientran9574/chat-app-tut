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
import { useState, useRef } from "react";
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
  // like
  const [isLiked, setIsLiked] = useState(post.likes?.includes(authUser?._id));
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  // Handle delete
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

  // Handle update
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
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEditImage(null);
  };
  // LIKE
  const handleLikePost = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1);
    try {
      const res = await axiosInstance.post(`/likes/${post._id}/toggle`);

      // Cập nhật UI ngay lập tức
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
    }
  };

  return (
    <div className="card bg-base-100 shadow-md border p-4 mb-4 relative">
      {/* Menu button */}
      {isOwner && (
        <div className="absolute top-3 right-3">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md border z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-yellow-600 flex items-center gap-2 whitespace-nowrap"
              >
                <Pencil size={16} /> Chỉnh sửa
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} /> Xoá
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-3">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img src={post.userId?.profilePic} alt="Avatar" />
          </div>
        </div>
        <div className="ml-3">
          <p className="font-bold">
            {post.userId?.fullName || "Unknown User"}{" "}
          </p>
          <p className="text-sm text-gray-500">23/07</p>
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-4 space-y-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="textarea textarea-bordered w-full resize-none"
            rows={3}
          />

          {/* Image preview with remove button */}
          {editImage && (
            <div className="relative">
              <img
                src={editImage}
                alt="Preview"
                className="w-full rounded-lg border object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-red-100"
              >
                <X size={18} className="text-red-600" />
              </button>
            </div>
          )}

          {/* Upload new image */}
          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />
            <button
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current.click()}
            >
              Thêm / Thay ảnh
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsEditing(false)}
            >
              Huỷ
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
        <>
          {post.text && <p className="mb-4">{post.text}</p>}
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full h-auto rounded-lg mb-4"
            />
          )}
        </>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="space-y-2 pt-2 mt-2">
          {/* Like, Comment, Share buttons */}
          <div className="flex justify-between items-center px-2">
            <div className="flex space-x-4">
              <button
                onClick={handleLikePost}
                className="p-1 focus:outline-none"
              >
                <Heart
                  size={24}
                  fill={isLiked ? "#ff0000" : "none"}
                  stroke={isLiked ? "#ff0000" : "currentColor"}
                  className="transition-all duration-300 hover:scale-110"
                />
              </button>
              <button className="p-1">
                <MessageCircle size={24} strokeWidth={1.5} />
              </button>
              <button className="p-1">
                <Send size={24} strokeWidth={1.5} />
              </button>
            </div>
            <button className="p-1">
              <Bookmark size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Like count */}
          {likeCount > 0 && (
            <div className="px-2 text-sm font-semibold">
              {likeCount} lượt thích
            </div>
          )}

          {/* Caption */}
          {/* {post.text && (
            <div className="px-2 text-sm">
              <span className="font-semibold">{post.userId?.fullName}</span>{" "}
              {post.text}
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default PostCard;
