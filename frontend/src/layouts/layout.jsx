import React from "react";
import NavigatePage from "../pages/Navigate/page";

const MainLayout = ({ chilren }) => {
  return (
    <div>
      <NavigatePage></NavigatePage>
      {chilren}
    </div>
  );
};

export default MainLayout;
