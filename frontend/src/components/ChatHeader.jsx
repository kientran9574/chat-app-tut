import React from "react";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
const ChatHeader = () => {
  const { setSelectUser, selectUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="w-full border-b border-base-300 p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 relative rounded-full">
              <img
                src={selectUser?.profilePic || "/avatar.png"}
                alt={selectUser?.fullName}
              ></img>
            </div>
          </div>
          <div>
            <span>{selectUser?.fullName}</span>
            <p
              className={`${
                onlineUsers?.includes(selectUser?._id)
                  ? "text-green-500"
                  : "text-slate-400"
              }`}
            >
              {onlineUsers?.includes(selectUser?._id) ? "online" : "office"}
            </p>
          </div>
        </div>
        <button className="size-5" onClick={() => setSelectUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
