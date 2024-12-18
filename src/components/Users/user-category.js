import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Table,
  Pagination,
  Row,
  Modal,
  Form,
  Input,
  Button,
} from "antd";
import EditUser from "./edit-user";
import DeleteUser from "./delete-user";
import { Svgs } from "../Svgs/svg-icons";
const { Text } = Typography;

function UserCategory({ data }) {
  const [selectedEditUser, setSelectedEditUser] = useState(null);
  const [selectedViewUser, setSelectedViewUser] = useState(null);
  const [originalData, setOriginalData] = useState(data);
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    setFilteredData(data);
    setOriginalData(data);
  }, [data]);

  const handleEditClick = (user) => {
    setSelectedEditUser(user);
  };

  const handleViewClick = (user) => {
    setSelectedViewUser(user);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    // { title: "Password", dataIndex: "password", key: "password" },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      render: (profile) => profile ?? "---",
    },
    {
      title: "Treatment Details",
      dataIndex: "treatment_details",
      key: "treatment_details",
      render: (treatment_details) => treatment_details ?? "---",
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text, user) => (
        <div onClick={() => handleViewClick(user)}>{Svgs.view}</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => status ?? "---",
    },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <Row className="gap-5">
          <div onClick={() => handleEditClick(user)}>
            {selectedEditUser ? <EditUser data={user} /> : Svgs.editg}
          </div>
          <DeleteUser data={user} goBack={() => setSelectedEditUser(null)} />
        </Row>
      ),
    },
  ];

  return (
    <Layout>
      <div>
        {filteredData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
          />
        ) : (
          <div className="lg:py-20 py-10 px-8 flex flex-col justify-center items-center">
            <Text className="text-[#2C2C2E] md:text-2xl text-xl font-normal mt-2 mb-2">
              No Data Match
            </Text>
          </div>
        )}
      </div>
      {selectedViewUser && (
        <Modal
          title="USER DETAILS"
          visible={true}
          onCancel={() => setSelectedViewUser(null)}
          footer={null}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input value={selectedViewUser.name} disabled />
            </Form.Item>
            <Form.Item label="Email" style={{ marginTop: 10 }}>
              <Input value={selectedViewUser.email} disabled />
            </Form.Item>
            <Form.Item>
              <div className="justify-end flex">
                <Button
                  style={{
                    backgroundColor: "#0b3c95",
                    color: "white",
                    marginTop: 20,
                  }}
                >
                  Download
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {filteredData.length > 0 && (
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          className="center-pagination"
          style={{ marginTop: 20 }}
        />
      )}
    </Layout>
  );
}

export default UserCategory;
