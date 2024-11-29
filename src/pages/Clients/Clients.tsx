import React, { useState, useEffect } from "react";
import {
  Input,
  Table,
  Button,
  Pagination,
  // Modal
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import "./Clients.css";

const { Search } = Input;

interface ClientData {
  // key: string;
  email: string;
  name: string;
  password: string;
  profile: null;
  role: string;
  status: null;
  treatment_details: null;
}

const Clients: React.FC = () => {
  // const navigate = useNavigate();
  // const location = useLocation();
  const [clients, setClients] = useState<ClientData[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const storedClients = localStorage.getItem("clients");
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  // const confirmDelete = (key: string) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to delete this client?",
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
  //   setClients(clients.filter((client) => client.key !== key));
  // };

  // const handleUpdate = (key: string) => {
  //   const clientToEdit = clients.find((c) => c.key === key);
  //   if (clientToEdit) {
  //     navigate(`/clients/edit/${key}`, {
  //       state: {
  //         client: clientToEdit,
  //       },
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (location.state?.updatedClient) {
  //     const updatedClient = location.state.updatedClient;
  //     setClients((prevClients) =>
  //       prevClients.map((client) =>
  //         client.key === updatedClient.key ? updatedClient : client
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
        className="center-pagination"
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default Clients;
