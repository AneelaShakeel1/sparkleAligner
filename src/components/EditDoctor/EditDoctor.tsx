import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const EditDoctor: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const doctor = state?.doctor;

  useEffect(() => {
    if (!doctor) {
      navigate("/doctors");
    }
  }, [doctor, navigate]);

  const onFinish = (values: any) => {
    const updatedDoctor = { ...doctor, ...values };
    navigate("/doctors", {
      state: {
        updatedDoctor,
      },
    });
  };

  return (
    <div style={{ paddingLeft: "300px", paddingRight: "30px" }}>
      <h2>Edit Doctor</h2>
      {doctor && (
        <Form
          form={form}
          layout="vertical"
          initialValues={doctor}
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
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
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

export default EditDoctor;
