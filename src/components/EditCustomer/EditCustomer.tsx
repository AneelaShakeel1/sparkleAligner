import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const EditCustomer: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const customer = state?.customer;

  useEffect(() => {
    if (!customer) {
      navigate("/customers");
    }
  }, [customer, navigate]);

  const onFinish = (values: any) => {
    const updatedCustomer = { ...customer, ...values };
    navigate("/customers", {
      state: {
        updatedCustomer,
      },
    });
  };

  return (
    <div style={{ paddingLeft: "300px", paddingRight: "30px" }}>
      <h2>Edit Customer</h2>
      {customer && (
        <Form
          form={form}
          layout="vertical"
          initialValues={customer}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
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
            name="doctor"
            label="Assign Doctor"
            rules={[{ required: true, message: "Please select a doctor" }]}
          >
            <Select placeholder="Select Doctor">
              <Option value="Dr. Smith">Dr. Smith</Option>
              <Option value="Dr. Johnson">Dr. Johnson</Option>
              <Option value="Dr. Lee">Dr. Lee</Option>
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

export default EditCustomer;
