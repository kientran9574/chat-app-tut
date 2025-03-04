/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { useRoutes, Navigate, Outlet } from "react-router-dom";
import HomePage from "./pages/Home/page";
import { useAuthStore } from "./store/useAuthStore";
import SignUpPage from "./SignUp/page";
import LoginPage from "./pages/Login/page";
import SettingPage from "./pages/Setting/page";
import ProfilePage from "./pages/Profile/page";
import NavbarPage from "./pages/Navbar/page";

function ProtectedRoute({ children }) {
  const { authUser, checkAuth } = useAuthStore();
  return authUser ? children : <Navigate to={"/login"} replace></Navigate>;
}
function RejectedRoute() {
  const { authUser } = useAuthStore();
  return !authUser ? <Outlet></Outlet> : <Navigate to={"/"}></Navigate>;
}
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
      index: true,
      element: (
        <ProtectedRoute>
          <MainLayout>
            <HomePage></HomePage>
          </MainLayout>
        </ProtectedRoute>
      ), // Bọc các route cần bảo vệ
    },
    {
      path: "",
      element: <RejectedRoute></RejectedRoute>,
      children: [
        {
          path: "login",
          element: <LoginPage></LoginPage>,
        },
        {
          path: "sign-up",
          element: <SignUpPage></SignUpPage>,
        },
      ],
    },
    {
      path: "/settings",
      element: <SettingPage></SettingPage>,
    },
    {
      path: "/profile",
      index: true,
      element: <ProfilePage></ProfilePage>,
    },
  ]);
  return routerElement;
};
export default useRouterElement;
