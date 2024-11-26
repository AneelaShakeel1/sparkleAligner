import React, { useState } from "react";
import { Input, Table, Button, Pagination } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./Doctors.css";

const { Search } = Input;

interface DoctorData {
  key: string;
  email: string;
  password: string;
  picture: string;
  treatmentdetails: string;
  status: string;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorData[]>([
    {
      key: "1",
      email: "dr.smith@example.com",
      password: "docpassword",
      picture: "path/to/drsmith.jpg",
      treatmentdetails: "10 treatments reviewed",
      status: "Active",
    },
    {
      key: "2",
      email: "dr.karen@example.com",
      password: "pass456",
      picture: "path/to/drkaren.jpg",
      treatmentdetails: "5 treatments pending",
      status: "Active",
    },
    {
      key: "3",
      email: "dr.lee@example.com",
      password: "secure789",
      picture: "path/to/drlee.jpg",
      treatmentdetails: "2 treatments on hold",
      status: "Inactive",
    },
    {
      key: "4",
      email: "dr.karen@example.com",
      password: "pass456",
      picture: "path/to/drkaren.jpg",
      treatmentdetails: "5 treatments pending",
      status: "Active",
    },
    {
      key: "5",
      email: "dr.lee@example.com",
      password: "secure789",
      picture: "path/to/drlee.jpg",
      treatmentdetails: "2 treatments on hold",
      status: "Inactive",
    },
    {
      key: "6",
      email: "dr.karen@example.com",
      password: "pass456",
      picture: "path/to/drkaren.jpg",
      treatmentdetails: "5 treatments pending",
      status: "Active",
    },
    {
      key: "7",
      email: "dr.lee@example.com",
      password: "secure789",
      picture: "path/to/drlee.jpg",
      treatmentdetails: "2 treatments on hold",
      status: "Inactive",
    },
    {
      key: "8",
      email: "dr.karen@example.com",
      password: "pass456",
      picture: "path/to/drkaren.jpg",
      treatmentdetails: "5 treatments pending",
      status: "Active",
    },
    {
      key: "9",
      email: "dr.lee@example.com",
      password: "secure789",
      picture: "path/to/drlee.jpg",
      treatmentdetails: "2 treatments on hold",
      status: "Inactive",
    },
    {
      key: "10",
      email: "dr.karen@example.com",
      password: "pass456",
      picture: "path/to/drkaren.jpg",
      treatmentdetails: "5 treatments pending",
      status: "Active",
    },
    {
      key: "11",
      email: "dr.lee@example.com",
      password: "secure789",
      picture: "path/to/drlee.jpg",
      treatmentdetails: "2 treatments on hold",
      status: "Inactive",
    },
  ]);
  

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const onSearch = (value: string) => {
    console.log(value);
  };

  const handleDelete = (key: string) => {
    setDoctors(doctors.filter((doctor) => doctor.key !== key));
  };

  const handleUpdate = (key: string) => {
    console.log(`Update doctor with key ${key}`);
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
      render: (_: any, record: DoctorData) => (
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
        dataSource={doctors.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        total={doctors.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default Doctors;
