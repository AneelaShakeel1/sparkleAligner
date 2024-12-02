import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

interface RenderMenuItem {
    label: string;
    link: string; 
  }
  
  interface RenderMenusProps {
    menus: RenderMenuItem[];
  }
  
const RenderMenus: React.FC<RenderMenusProps> = ({ menus }) => {
  const location = useLocation();

  const renderMenuItems = (items: RenderMenuItem[]) => {
    return items.map((item) => {
      if (!item.link) return null;  
  
      return (
        <Menu.Item
          key={item.link}
          className={location.pathname === item.link ? "active" : ""}
        >
          <Link to={item.link}>{item.label}</Link>
        </Menu.Item>
      );
    });
  };
  

  return (
    <Menu
      className="!mt-8 flex flex-col"
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: "100%", borderRight: 0 }}
    >
      {renderMenuItems(menus)}
    </Menu>
  );
};

export default RenderMenus;
