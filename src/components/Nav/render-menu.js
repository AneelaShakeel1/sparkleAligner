import { Menu } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const RenderMenus = ({ menus }) => {
  const location = useLocation();
  const user = useSelector((state) => state?.user?.user);

  const userPermissions = user?.permissions || [];

  const getMenuByPermissions = (item) => {
    const permissions = userPermissions.map((p) => p.permissionKey);
    if (!item.requiredPermission) return true;

    if (Array.isArray(item.requiredPermission)) {
      return item.requiredPermission.some((p) => permissions.includes(p));
    }
    return permissions.includes(item.requiredPermission);
  };

  const renderMenuItems = (items) => {
    return items.filter(getMenuByPermissions).map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu
            key={item.permissionKey}
            icon={item.icon}
            title={item.label}
            className={
              item.className +
              (location.pathname === item.link ? " active" : "")
            }
          >
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.permissionKey}
          icon={item.icon}
          className={item.className}
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
