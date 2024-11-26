import React, { useState } from "react";
import { Input, Table, Button, Pagination } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./Clients.css";

const { Search } = Input;

interface ClientData {
  key: string;
  email: string;
  password: string;
  picture: string;
  treatmentdetails: string;
  status: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<ClientData[]>([
    {
      key: "1",
      email: "maria@example.com",
      password: "securepass",
      picture: "path/to/maria.jpg",
      treatmentdetails: "Aligner Phase 1",
      status: "Ongoing",
    },
    {
      key: "2",
      email: "john@example.com",
      password: "secure123",
      picture: "path/to/john.jpg",
      treatmentdetails: "Aligner Phase 2",
      status: "Completed",
    },
    {
      key: "3",
      email: "sofia@example.com",
      password: "mypassword",
      picture: "path/to/sofia.jpg",
      treatmentdetails: "Aligner Phase 3",
      status: "Ongoing",
    },
    {
      key: "4",
      email: "maria@example.com",
      password: "securepass",
      picture: "path/to/maria.jpg",
      treatmentdetails: "Aligner Phase 1",
      status: "Ongoing",
    },
    {
      key: "5",
      email: "john@example.com",
      password: "secure123",
      picture: "path/to/john.jpg",
      treatmentdetails: "Aligner Phase 2",
      status: "Completed",
    },
    {
      key: "6",
      email: "sofia@example.com",
      password: "mypassword",
      picture: "path/to/sofia.jpg",
      treatmentdetails: "Aligner Phase 3",
      status: "Ongoing",
    },
  ]);
  

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const onSearch = (value: string) => {
    console.log(value);
  };

  const handleDelete = (key: string) => {
    setClients(clients.filter((client) => client.key !== key));
  };

  const handleUpdate = (key: string) => {
    console.log(`Update client with key ${key}`);
  };

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
      render: (_: any, record: ClientData) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record.key)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="doctor-container">
      <Search
        placeholder="Search agents"
        onSearch={onSearch}
        style={{ width: "100%", marginBottom: 20 }}
      />
      <Table
        columns={columns}
        dataSource={clients.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        total={clients.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default Clients;
