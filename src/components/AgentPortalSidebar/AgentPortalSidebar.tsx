import React from "react";
import { Link } from "react-router-dom";
import { TeamOutlined } from "@ant-design/icons";
import "./AgentPortalSidebar.css";

const AgentPortalSidebar: React.FC = () => {
  return (
    <div className="agent-sidebar">
      <div className="agent-sidebar-header">
        <TeamOutlined style={{ fontSize: "20px", color: "#42afd2" }} />
        {/* <Link to="/agent-dashboard"> */}
        <h2>AGENT DASHBOARD</h2>
        {/* </Link> */}
      </div>
      <div className="agent-sidebar-content">
        <ul>
          <li>
            <Link to="/teeth-images">Manage Teeth Images</Link>
          </li>
          <li>
            <Link to="/customers">Manage Customers</Link>
          </li>
          <li>
            <Link to="/stl-files">Manage STL Files</Link>
          </li>
          <li>
            <Link to="/documents">Manage Various File Formats</Link>
          </li>
          <li>
            <Link to="/treatment-preview">Manage Treatment Preview</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AgentPortalSidebar;
