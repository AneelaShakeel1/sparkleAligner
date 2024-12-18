import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getMenuItems } from "./menu-items";
import RenderMenus from "./render-menu";
import { useSelector } from "react-redux";
import Logout from "./logout";

function Nav() {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);
  
  const menuItems = getMenuItems();

  let navContent = <RenderMenus menus={menuItems} />;

  return (
    <div className="px-2 py-6">
      <Link to="/">
        <Logo />
      </Link>
      <PerfectScrollbar className="height-scroll">
        {navContent}
      </PerfectScrollbar>
      <Link className="border-[#CED3DA] border-opacity-[0.2] border-t-2 pt-5 w-[94%] lg:fixed lg:bottom-0 lg:left-[2.5] bg-primary h-[100px] lg:w-[260px]">
        <Logout />
      </Link>
    </div>
  );
}

export default Nav;
