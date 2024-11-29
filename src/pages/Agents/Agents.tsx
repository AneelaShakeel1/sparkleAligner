import React, { useState, useEffect } from "react";
import {
  Input,
  Table,
  Button,
  Pagination,
  // Modal
} from "antd";
// import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { useLocation } from "react-router-dom";
import "./Agents.css";

const { Search } = Input;

interface AgentData {
  // key: string;
  email: string;
  name: string;
  password: string;
  profile: null;
  role: string;
  status: null;
  treatment_details: null;
}

const Agents: React.FC = () => {
  // const navigate = useNavigate();
  // const location = useLocation();

  const [agents, setAgents] = useState<AgentData[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const storedAgents = localStorage.getItem("agents");
    if (storedAgents) {
      setAgents(JSON.parse(storedAgents));
    }
  }, []);

  // const confirmDelete = (key: string) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to delete this agent?",
  //     content: "This action cannot be undone.",
  //     okText: "Yes",
  //     cancelText: "No",
  //     onOk: () => handleDelete(key),
  //   });
  // };

  const onSearch = (value: string) => {
    console.log(value);
  };

  // const handleDelete = (key: string) => {
  //   setAgents(agents.filter((agent) => agent.key !== key));
  // };

  // const handleUpdate = (key: string) => {
  //   const agentToEdit = agents.find((a) => a.key === key);
  //   if (agentToEdit) {
  //     navigate(`/agents/edit/${key}`, {
  //       state: {
  //         agent: agentToEdit,
  //       },
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (location.state?.updatedAgent) {
  //     const updatedAgent = location.state.updatedAgent;
  //     setAgents((prevAgents) =>
  //       prevAgents.map((agent) =>
  //         agent.key === updatedAgent.key ? updatedAgent : agent
  //       )
  //     );
  //   }
  // }, [location.state]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    // { title: "Password", dataIndex: "password", key: "password" },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      render: (profile: any) => profile ?? "---",
    },
    {
      title: "Treatment Details",
      dataIndex: "treatment_details",
      key: "treatment_details",
      render: (treatment_details: any) => treatment_details ?? "---",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => status ?? "---",
    },
    {
      title: "Actions",
      key: "actions",
      render: (
        _: any
        // record: AgentData
      ) => (
        <>
          <Button
            icon={<EditOutlined />}
            // onClick={() => handleUpdate(record.key)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            // onClick={() => confirmDelete(record.key)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="agent-container">
      <Search
        placeholder="Search agents"
        onSearch={onSearch}
        style={{ width: "100%", marginBottom: 20 }}
      />
      <Table
        columns={columns}
        dataSource={agents.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        total={agents.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        className="center-pagination"
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default Agents;
