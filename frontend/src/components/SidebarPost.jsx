import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaSnapchat } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

const SidebarPost = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleLogout = async () => {
    const res = logout();
    if (res) {
      toast.success("Đăng xuất thành công");
      navigate("/login");
    }
  };
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-base-100 shadow-lg flex flex-col p-4">
      <div className="text-2xl font-bold mb-8">MySocial</div>
      <nav className="flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center p-4 mb-2 rounded-lg ${
              isActive ? "bg-primary text-white" : "hover:bg-base-200"
            }`
          }
        >
          <FaHome className="mr-3" /> Home
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center p-4 mb-2 rounded-lg ${
              isActive ? "bg-primary text-white" : "hover:bg-base-200"
            }`
          }
        >
          <FaUser className="mr-3" /> Profile
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex items-center p-4 mb-2 rounded-lg ${
              isActive ? "bg-primary text-white" : "hover:bg-base-200"
            }`
          }
        >
          <FaSnapchat className="mr-3" /> Messages
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center p-4 mb-2 rounded-lg w-full hover:bg-base-200 transition-colors"
        >
          <LogOut className="mr-3" />
          <p>Logout</p>
        </button>
      </nav>
    </div>
  );
};

export default SidebarPost;
