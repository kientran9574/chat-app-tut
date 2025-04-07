/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Video } from "lucide-react";
import GifPicker from "gif-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const fileInputRef = useRef(null);
  const fileVideoRef = useRef(null);
  const { sendMessages } = useChatStore();
  const [videoPreview, setVideoPreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImgPreview(reader.result);
    reader.readAsDataURL(file);
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeVideo = () => {
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadToCloudinary = async (file, resourceType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat_app_unsigned"); // Thay bằng preset của bạn
    formData.append("resource_type", resourceType);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dxtyhtk2b/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message || "Upload failed");
    return data.secure_url;
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imgPreview && !videoPreview) return;

    try {
      let videoUrl;
      // Upload video nếu có
      if (videoPreview) {
        videoUrl = await uploadToCloudinary(
          fileVideoRef.current.files[0],
          "video"
        );
      }
      console.log("video url ơi tôi cần bạn",videoUrl)
      await sendMessages({
        text: text.trim() || "",
        image: imgPreview || null,
        video: videoUrl || null,
      });
      setText("");
      setImgPreview(null);
      setVideoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (fileVideoRef.current) fileVideoRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleGifClick = async (gif) => {
    try {
      await sendMessages({
        text: "",
        image: gif.url, // URL của GIF từ Tenor
      });
      setShowGifPicker(false); // Ẩn picker sau khi chọn GIF
    } catch (error) {
      console.error("Failed to send GIF:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imgPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imgPreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      {videoPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <video
              src={videoPreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex flex-1 gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          />
          {/* image */}
          <input
            ref={fileInputRef}
            onChange={handleImageChange}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imgPreview ? "text-emerald-500" : "text-zinc-400"
            }`}
          >
            <Image size={20} />
          </button>
          {/* video */}
          <input
            ref={fileVideoRef}
            onChange={handleVideoChange}
            type="file"
            accept="video/*"
            className="hidden"
          />
          <button
            onClick={() => fileVideoRef.current?.click()}
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              fileVideoRef ? "text-emerald-500" : "text-zinc-400"
            }`}
          >
            <Video size={20} />
          </button>
          <button
            type="button"
            onClick={() => setShowGifPicker(!showGifPicker)}
            className="btn btn-circle text-zinc-400"
          >
            <Smile size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imgPreview && !videoPreview}
        >
          <Send size={22} />
        </button>
      </form>

      {showGifPicker && (
        <div className="mt-2">
          <GifPicker
            tenorApiKey="AIzaSyANDXMamAAwVld3Us2QC456BeMGjCx4-YI"
            onGifClick={handleGifClick}
            width="100%"
            height="300px"
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
