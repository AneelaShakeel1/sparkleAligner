import Nav from "../Nav";
import React, { useContext } from "react";
import { Layout, Drawer } from "antd";
import { ToggleContext } from "../../context";

const { Sider } = Layout;

const SideBar = () => {
  const { toggleSideBar, isToggled } = useContext(ToggleContext);
  return (
    <>
      <Drawer
        placement="left"
        onClose={toggleSideBar}
        visible={isToggled}
        className="lg:hidden block"
        bodyStyle={{ backgroundColor: "#001529", padding: "0" }}
      >
        <Nav className="primary__color" />
      </Drawer>
      <Sider
        width={280}
        className="!bg-primary nav__box__shadow z-10 lg:block hidden"
      >
        <Nav className="primary__color" />
      </Sider>
    </>
  );
};

export { SideBar };
