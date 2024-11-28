import React, { useState, useEffect } from "react";
import { Input, Table, Button, Pagination, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "./Agents.css";

const { Search } = Input;

interface AgentData {
  key: string;
  email: string;
  password: string;
  picture: string;
  treatmentdetails: string;
  status: string;
}

const Agents: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [agents, setAgents] = useState<AgentData[]>([
    {
      key: "1",
      email: "james@example.com",
      password: "password123",
      picture: "path/to/james.jpg",
      treatmentdetails: "Assigned to 5 clients",
      status: "Active",
    },
    {
      key: "2",
      email: "lisa@example.com",
      password: "password456",
      picture: "path/to/lisa.jpg",
      treatmentdetails: "Assigned to 3 clients",
      status: "Active",
    },
    {
      key: "3",
      email: "alex@example.com",
      password: "password789",
      picture: "path/to/alex.jpg",
      treatmentdetails: "Onboarding",
      status: "Inactive",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const confirmDelete = (key: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this agent?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleDelete(key),
    });
  };

  const onSearch = (value: string) => {
    console.log(value);
  };

  const handleDelete = (key: string) => {
    setAgents(agents.filter((agent) => agent.key !== key));
  };

  const handleUpdate = (key: string) => {
    const agentToEdit = agents.find((a) => a.key === key);
    if (agentToEdit) {
      navigate(`/agents/edit/${key}`, {
        state: {
          agent: agentToEdit,
        },
      });
    }
  };

  useEffect(() => {
    if (location.state?.updatedAgent) {
      const updatedAgent = location.state.updatedAgent;
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.key === updatedAgent.key ? updatedAgent : agent
        )
      );
    }
  }, [location.state]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Password", dataIndex: "password", key: "password" },
    { title: "Picture", dataIndex: "picture", key: "picture" },
    {
      title: "Treatment Details",
      dataIndex: "treatmentdetails",
      key: "treatmentdetails",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: AgentData) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record.key)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record.key)}
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
        style={{ marginTop: 20}}
      />
    </div>
  );
};

export default Agents;
