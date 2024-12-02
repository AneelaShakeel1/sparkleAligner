import React from "react";
import { menuItems } from "./menu-items";
import RenderMenus from "./render-menu";
import PerfectScrollbar from "react-perfect-scrollbar";

const Nav: React.FC = () => {
  let navContent = <RenderMenus menus={menuItems} />;

  return (
    <div className="px-2 py-6">
      <PerfectScrollbar className="height-scroll">
        {navContent}
      </PerfectScrollbar>
    </div>
  );
};

export default Nav;
