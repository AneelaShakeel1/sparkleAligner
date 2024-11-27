import React from "react";
import { Link } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <DashboardOutlined
          style={{ fontSize: "20px", color: "#42afd2"}}
        />
        <Link to="/super-admin-dashboard">
          <h2>SUPER ADMIN DASHBOARD</h2>
        </Link>
      </div>
      <div className="sidebar-content">
        <ul>
          <li>
            <Link to="/agents">Manage Agents</Link>
          </li>
          <li>
            <Link to="/doctors"> Manage Doctors</Link>
          </li>
          <li>
            <Link to="/clients">Manage Clients</Link>
          </li>
          <li>
            <Link to="/add-user">Add User</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
