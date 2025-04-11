import React from "react";
import SidebarPost from "../../components/SideBarPost";
import { Outlet } from "react-router-dom";
const PostLayout = () => {
  return (
    <div className="flex">
      <SidebarPost />
      <div className="ml-64 flex-1">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default PostLayout;
