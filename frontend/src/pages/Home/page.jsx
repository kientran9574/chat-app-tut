import React from "react";
import SideBar from "../../components/SideBar";
import ChatContainer from "../../components/ChatContainer";
import NoChatSelected from "../../components/NoChatSelected";
import { useChatStore } from "../../store/useChatStore";

const HomePage = () => {
  const { setSelectUser, messages, getMessages, selectUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="pt-20 px-4">
        <div className="w-full max-w-6xl mx-auto h-[calc(100vh-8rem)] bg-base-100 rounded-lg shadow">
          <div className="flex h-full w-full rounded-lg overflow-hidden">
            <SideBar></SideBar>
            {selectUser ? (
              <ChatContainer></ChatContainer>
            ) : (
              <NoChatSelected></NoChatSelected>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
