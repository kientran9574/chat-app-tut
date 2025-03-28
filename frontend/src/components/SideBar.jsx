import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
  const { users, getUsers, setSelectUser, selectUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const filterUserd = showOnlineOnly
    ? users.filter((user) => onlineUsers?.includes(user._id))
    : users;
  return (
    <aside className="w-20 lg:w-72 overflow-y-auto border-r border-base-300 flex flex-col">
      <div className="border-b border-base-300 w-full px-4 pb-4">
        <div className="flex items-center gap-3">
          <User className="size-5"></User>
          <h1>Contact</h1>
        </div>
        <div className="flex items-center mt-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              value={showOnlineOnly}
              className="size-6 checkbox"
              onChange={(error) => setShowOnlineOnly(error.target.checked)}
            ></input>
            <span className="">Show online only</span>
          </label>
        </div>
      </div>
      <div className="overflow-y-auto max-h-full space-y-2">
        {filterUserd?.map((user) => (
          <div
            className={`rounded w-full bg-base-100 flex items-center px-2 py-2 hover:bg-base-300 transition-all duration-300 gap-3 cursor-pointer
            ${
              user._id === selectUser?._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }
            `}
            key={user._id}
            onClick={() => {
              setSelectUser(user);
            }}
          >
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            />
            <div className="flex flex-col gap-2">
              <p className="text-primary text-lg font-bold">{user.fullName}</p>
              {onlineUsers?.includes(user._id) && (
                <span className="text-green-500">Online</span>
              )}
              {!onlineUsers?.includes(user._id) && (
                <span className="text-slate-300">Office</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
