import React, { useState, useEffect } from "react";
import { Input, Button, Modal, Table, message, Form, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Option } = Select;

export interface Customer {
  key: string;
  name: string;
  email: string;
  password: string;
  doctor: string;
}

const ManageCustomers: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    password: "",
    doctor: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Lee"];

  const generateRandomKey = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem("customers", JSON.stringify(customers));
    }
  }, [customers]);

  const handleCreateLogin = () => {
    if (
      newCustomer.name &&
      newCustomer.email &&
      newCustomer.password &&
      newCustomer.doctor
    ) {
      const newCustomerData = {
        key: generateRandomKey(),
        ...newCustomer,
      };
      setCustomers((prevCustomers) => [...prevCustomers, newCustomerData]);
      message.success("Customer login created!");
      setIsModalVisible(false);
    } else {
      message.error("Please fill in all fields");
    }
  };

  const confirmDelete = (key: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this customer?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleDeleteCustomer(key),
    });
  };

  const handleDeleteCustomer = (key: string) => {
    setCustomers(customers.filter((customer) => customer.key !== key));
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Password", dataIndex: "password", key: "password" },
    { title: "Doctor", dataIndex: "doctor", key: "doctor" },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: Customer) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdateCustomer(record.key)}
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

  const handleUpdateCustomer = (key: string) => {
    const customerToUpdate = customers.find((c) => c.key === key);
    if (customerToUpdate) {
      navigate(`/customers/edit/${key}`, {
        state: { customer: customerToUpdate },
      });
    }
  };

  useEffect(() => {
    if (location.state?.updatedCustomer) {
      const updatedCustomer = location.state.updatedCustomer;
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.key === updatedCustomer.key ? updatedCustomer : customer
        )
      );
    }
  }, [location.state]);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ margin: 30 }}
      >
        Create Customer Login
      </Button>
      <Modal
        title="Create Customer Login"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateLogin}
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input
              name="name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              placeholder="Enter name"
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              name="email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              name="password"
              value={newCustomer.password}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, password: e.target.value })
              }
              placeholder="Enter password"
            />
          </Form.Item>
          <Form.Item label="Assign Doctor">
            <Select
              value={newCustomer.doctor}
              onChange={(value) =>
                setNewCustomer({ ...newCustomer, doctor: value })
              }
              placeholder="Select Doctor"
            >
              {doctors.map((doctor) => (
                <Option key={doctor} value={doctor}>
                  {doctor}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={customers}
        pagination={false}
        style={{ marginLeft: 20, marginRight: 20 }}
      />
    </div>
  );
};

export default ManageCustomers;
