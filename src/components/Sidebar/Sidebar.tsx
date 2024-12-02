import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { DashboardOutlined } from "@ant-design/icons";
import "./Sidebar.css";
import Nav from "../../components/NavBar/index";
import { Layout, Drawer } from "antd";
import { ToggleContext } from "../../context";

const { Sider } = Layout;
const Sidebar: React.FC = () => {
  const context = useContext(ToggleContext);

  // If context is undefined, return null (or some fallback UI)
  if (!context) {
    return null; // Or handle error as needed
  }

  const { toggleSideBar, isToggled } = context;
  return (
    // <div className="sidebar">
    //   <div className="sidebar-header">
    //     <DashboardOutlined style={{ fontSize: "20px", color: "#42afd2" }} />
    //     <Link to="/super-admin-dashboard">
    //       <h2>SUPER ADMIN DASHBOARD</h2>
    //     </Link>
    //   </div>
    //   <div className="sidebar-content">
    //     <ul>
    //       <li>
    //         <Link to="/agents">Manage Agents</Link>
    //       </li>
    //       <li>
    //         <Link to="/doctors"> Manage Doctors</Link>
    //       </li>
    //       <li>
    //         <Link to="/patients">Manage Patients</Link>
    //       </li>
    //       <li>
    //         <Link to="/add-user">Add User</Link>
    //       </li>
    //     </ul>
    //   </div>
    // </div>
    <>
      <Drawer
        placement="left"
        onClose={toggleSideBar}
        visible={isToggled}
        className="lg:hidden block"
        bodyStyle={{ backgroundColor: "#001529", padding: "0" }}
      >
        <Nav  />
      </Drawer>
      <Sider
        width={280}
        className="!bg-primary nav__box__shadow z-10 lg:block hidden"
      >
        <Nav  />
      </Sider>
    </>
  );
};

export default Sidebar;
