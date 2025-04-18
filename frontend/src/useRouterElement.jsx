/* eslint-disable react-refresh/only-export-components */
import { useRoutes, Navigate, Outlet } from "react-router-dom";
import HomePage from "./pages/Home/page";
import { useAuthStore } from "./store/useAuthStore";
import SignUpPage from "./SignUp/page";
import LoginPage from "./pages/Login/page";
import SettingPage from "./pages/Setting/page";
import ProfilePage from "./pages/Profile/page";
import NavbarPage from "./pages/Navbar/page";
import { AuthMiddleware } from "./auth.middlwares.js";
import ForgotPassword from "./pages/ForgotPassword/page.jsx";
import PostLayout from "./pages/Post/layout.jsx";
import PostHome from "./pages/Post/PostHome.jsx";
// Route bảo vệ cần đăng nhập
function ProtectedRoute() {
  const { authUser } = useAuthStore();
  return authUser ? <Outlet /> : <Navigate to="/login" replace />;
}

// Route từ chối người đã đăng nhập
function RejectedRoute() {
  const { authUser } = useAuthStore();
  return !authUser ? <Outlet /> : <Navigate to="/" replace />;
}

// Layout chính có Navbar
function MainLayout() {
  return (
    <NavbarPage>
      <Outlet />
    </NavbarPage>
  );
}

const useRouterElement = () => {
  const routerElement = useRoutes([
    {
      path: "/message",
      element: (
        <AuthMiddleware>
          <MainLayout />
        </AuthMiddleware>
      ), // MainLayout là layout chính
      children: [
        {
          index: true,
          element: <HomePage />, // HomePage sẽ được Outlet hiển thị
        },
      ],
    },
    {
      path: "/profile", // Route riêng cho profile
      element: (
        <AuthMiddleware>
          <MainLayout></MainLayout>
        </AuthMiddleware>
      ),
      children: [
        {
          index: true,
          element: <ProfilePage />, // Sẽ render qua Outlet
        },
      ],
    },
    {
      element: <RejectedRoute />, // Bọc các route không cần đăng nhập
      children: [
        { path: "/login", element: <LoginPage /> },
        { path: "/sign-up", element: <SignUpPage /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
      ],
    },
    {
      path: "/",
      element: (
        <AuthMiddleware>
          <PostLayout />
        </AuthMiddleware>
      ),
      children: [{ index: true, element: <PostHome /> }],
    },
  ]);

  return routerElement;
};

export default useRouterElement;
