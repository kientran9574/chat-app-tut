import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:4500" : "/";
export const useAuthStore = create((set, get) => ({
  authUser: JSON.parse(localStorage.getItem("authUser")) || null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const result = await axiosInstance.get("/auth/check");
      set({ authUser: result.data });
      localStorage.setItem("authUser", JSON.stringify(result.data)); // 🔥 Lưu vào localStorage
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
      localStorage.removeItem("authUser"); // 🔥 Xóa nếu thất bại
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const result = await axiosInstance.post("/auth/login", data);
      set({ authUser: result.data.data });
      localStorage.setItem("authUser", JSON.stringify(result.data.data)); // 🔥 Lưu vào localStorage
      get().connectSocket();
      toast.success("Đăng nhập thành công");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: () => {
    localStorage.removeItem("authUser"); // 🔥 Xóa khỏi localStorage khi đăng xuất
    get().disconnectSocket();
    set({ authUser: null });
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const result = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: result.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io("http://localhost:4500", {
      query: {
        userId: authUser._id,
      },
    });
    if (socket.connect()) {
      set({ socket });
      socket.on("getOnlineUsers", (usersId) => {
        console.log("kien tran test socket client ", usersId);
        set({ onlineUsers: usersId });
      });
    }
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
