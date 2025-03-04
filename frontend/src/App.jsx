import { useEffect } from "react";
import "./App.css";
import { useAuthStore } from "./store/useAuthStore";
import useRouterElement from "./useRouterElement";
import { Loader } from "lucide-react";

function App() {
  const routerElement = useRouterElement();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!authUser) {
      checkAuth(); // 🔥 Chỉ gọi API nếu authUser chưa có
    }
  }, [authUser, checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  console.log("🚀 ~ App ~ authUser:", authUser);
  return <div>{routerElement}</div>;
}

export default App;
