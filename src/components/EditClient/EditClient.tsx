import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const EditClient: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const client = state?.client;

  useEffect(() => {
    if (!client) {
      navigate("/clients");
    }
  }, [client, navigate]);

  const onFinish = (values: any) => {
    const updatedClient = { ...client, ...values };
    navigate("/clients", {
      state: {
        updatedClient,
      },
    });
  };

  return (
    <div style={{ paddingLeft: "300px", paddingRight: "30px" }}>
      <h2>Edit Client</h2>
      {client && (
        <Form
          form={form}
          layout="vertical"
          initialValues={client}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter the password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="picture"
            label="Picture"
            rules={[
              { required: true, message: "Please enter the picture URL" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="treatmentdetails"
            label="Treatment Details"
            rules={[
              { required: true, message: "Please enter treatment details" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please enter the status" }]}
          >
            <Select placeholder="Select Status">
              <Option value="Ongoing">Ongoing</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditClient;
