import React from "react";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
const NavbarPage = ({ children }) => {
  const { authUser } = useAuthStore();
  return (
    <>
      <header className="w-full bg-base-100 border-b border-b-base fixed z-10 backdrop-blur-lg bg-base-100/80 top-0">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-1 hover:opacity-80 transition-all"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold">Chatty</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={"/settings"}
                className={`
              btn btn-sm transition-colors     
              `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              {authUser && (
                <>
                  <Link
                    to={"/profile"}
                    className={`
              btn btn-sm transition-colors     
              `}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                  <Link
                    to={"/logout"}
                    className={`
              btn btn-sm transition-colors     
              `}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <Outlet></Outlet>
    </>
  );
};

export default NavbarPage;
