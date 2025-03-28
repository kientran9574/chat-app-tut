import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
const MessageInput = () => {
  const [text, setText] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { messages, sendMessages } = useChatStore();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendMessages({
        text: text.trim(),
        image: imgPreview || null,
      });
      // clear form
      setText("");
      setImgPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
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
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
          flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex flex-1 gap-2">
          {" "}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          />
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
            className={`hidden sm:flex btn btn-circle
                     ${imgPreview ? "text-emerald-500" : "text-zinc-400"}`}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imgPreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
