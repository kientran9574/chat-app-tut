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
// Route bảo vệ cần đăng nhập
// function ProtectedRoute() {
//   const { authUser } = useAuthStore();
//   console.log("kientrandeptrai socket");
//   return authUser ? <Outlet /> : <Navigate to="/login" replace />;
// }

// Route từ chối người đã đăng nhập
function RejectedRoute() {
  const { authUser } = useAuthStore();
  return !authUser ? <Outlet /> : <Navigate to="/" replace />;
}

// Layout chính có Navbar
function MainLayout() {
  return (
    <NavbarPage>
      <Outlet></Outlet>
    </NavbarPage>
  );
}

const useRouterElement = () => {
  const routerElement = useRoutes([
    {
      path: "/",
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
        {
          path: "settings",
          element: <SettingPage />,
        },
        {
          path: "profile",
          element: <ProfilePage />,
        },
      ],
    },
    {
      element: <RejectedRoute />, // Bọc các route không cần đăng nhập
      children: [
        { path: "/login", element: <LoginPage /> },
        { path: "/sign-up", element: <SignUpPage /> },
      ],
    },
  ]);

  return routerElement;
};

export default useRouterElement;
