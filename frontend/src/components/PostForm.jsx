import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const PostForm = ({ onPostCreated }) => {
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Hình ảnh quá lớn! Chọn file nhỏ hơn 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh!");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImgPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return; // Prevent empty posts
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", authUser?._id); // Replace with actual user ID
    formData.append("text", text);
    if (imageFile) formData.append("image", imageFile);
    // Kiểm tra nội dung FormData
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    if (!authUser?._id) {
      toast.error("Không thể đăng bài khi chưa đăng nhập!");
      return;
    }
    try {
      const response = await axiosInstance.post("/posts", formData);
      onPostCreated?.(response.data);
      setText("");
      setImageFile(null);
      setImgPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6 mb-6 mx-auto max-w-2xl">
      <form onSubmit={handleSubmit}>
        {/* Textarea */}
        <textarea
          className="textarea textarea-bordered w-full mb-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          disabled={loading}
        />

        {/* Image Preview */}
        {imgPreview && (
          <div className="relative mb-4">
            <img
              src={imgPreview}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-lg border border-base-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
              disabled={loading}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {/* Image Upload Button */}
            <input
              ref={fileInputRef}
              onChange={handleImageChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`btn btn-ghost btn-sm ${
                imgPreview ? "text-primary" : "text-base-content"
              }`}
              disabled={loading}
              title="Add Image"
            >
              <Image size={20} />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary btn-sm flex items-center gap-2 ${
              loading ? "loading" : ""
            }`}
            disabled={loading || (!text.trim() && !imageFile)}
          >
            <Send size={16} />
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
