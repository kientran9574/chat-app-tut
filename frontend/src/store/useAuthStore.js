import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: JSON.parse(localStorage.getItem("authUser")) || null, // 🔥 Lấy từ localStorage khi khởi động
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
      toast.success("Đăng nhập thành công");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: () => {
    localStorage.removeItem("authUser"); // 🔥 Xóa khỏi localStorage khi đăng xuất
    set({ authUser: null });
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const result = await axiosInstance.put("/auth/update-profile", data);
      console.log("🚀 ~ updateProfile: ~ result:", result)
      set({ authUser: result.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
