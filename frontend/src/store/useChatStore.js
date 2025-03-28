import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectUser: null,
  onlineUser: [],
  isUserLoading: false,
  // Cập nhật user đang được chọn để hiển thị tin nhắn tương ứng
  setSelectUser: async (selectUser) => {
    console.log("kien tran tesst select user ", selectUser);
    set({ selectUser });
  },
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const result = await axiosInstance.get("/messages/users");
      set({ users: result.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    try {
      const result = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: result.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  sendMessages: async (messageData) => {
    console.log("message", messageData);
    const { selectUser, messages } = get();
    try {
      const result = await axiosInstance.post(
        `/messages/send/${selectUser._id}`,
        messageData
      );
      set({ messages: [...messages, result.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  sendMessageToUser: () => {
    const socket = useAuthStore.getState().socket;
    const { selectUser } = get();
    if (!selectUser) return;
    socket.on("newMessage", (newMessage) => {
      console.log("real-time", newMessage);
      // set({ ...messages, newMessage });
      // set({ messages: [...messages, newMessage] });
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unSendMessageToUser: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
