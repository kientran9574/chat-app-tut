import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";
const ChatContainer = () => {
  const {
    setSelectUser,
    messages,
    getMessages,
    selectUser,
    sendMessageToUser,
    unSendMessageToUser,
  } = useChatStore();
  const { authUser } = useAuthStore();
  useEffect(() => {
    getMessages(selectUser?._id);
    sendMessageToUser();
    return () => unSendMessageToUser();
  }, [
    getMessages,
    selectUser?._id,
    selectUser.id,
    sendMessageToUser,
    unSendMessageToUser,
  ]);
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex flex-1 flex-col w-full">
      <ChatHeader></ChatHeader>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                ></img>
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput></MessageInput>
    </div>
  );
};

export default ChatContainer;
