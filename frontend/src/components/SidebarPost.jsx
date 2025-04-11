import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaPlusCircle } from "react-icons/fa";

const SidebarPost = () => {
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
      </nav>
    </div>
  );
};

export default SidebarPost;
