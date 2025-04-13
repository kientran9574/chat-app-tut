import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hàm kiểm tra trạng thái đăng nhập (giả lập)
const isAuthenticated = () => {
  return !!localStorage.getItem("authUser");
};

// Middleware component
export const AuthMiddleware = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      // Nếu chưa đăng nhập, chuyển hướng về trang login
      navigate("/login");
    }
  }, [navigate]);

  // Nếu đã đăng nhập thì render nội dung con
  return isAuthenticated() ? children : null;
};
