import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Flex,
  Typography,
  Layout,
  Spin,
  Select,
} from "antd";
import { Svgs } from "../Svgs/svg-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../../store/user/userSlice";
import { fetchAllUserAsync } from "../../store/user/userSlice";

const { Text } = Typography;
const { Content } = Layout;
const AddUser = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
  });
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState("");

  const storedRole = localStorage.getItem("role");

  if (!storedRole || storedRole === null || storedRole === "undefined") return;


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormValues({
      name: "",
      email: "",
      password: "",
      role: null,
    });
    setIsModalOpen(false);
  };

  const onFinish = async () => {
    try {
      setLoading(true);
      const resultAction = await dispatch(addUser(formValues));
      const response = resultAction.payload;
      if (resultAction.error) {
        toast.error(resultAction.error.message);
      } else if (resultAction) {
        if (response) {
          toast.success("user has been created.");
          dispatch(fetchAllUserAsync());
          handleCancel();
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        onClick={showModal}
        className="bg-primary flex justify-center items-center w-full max-w-[180px] py-5 text-base font-normal text-white rounded-lg"
        type=""
        icon={Svgs.addiconw}
      >
        Add New User
      </Button>
      <Modal open={isModalOpen} onCancel={handleCancel}>
        <Content className="flex flex-col">
          <Text className="text-primary md:text-[32px] text-xl font-medium text-center">
            Add New User
          </Text>
          <div className="flex flex-col justify-center items-center mt-5">
            <Text className="text-sm font-normal text-[#303030] text-center mb-2">
              Please fill the details below to add new User.
            </Text>
          </div>
          <Form
            name="login"
            size="large"
            layout="vertical"
            onFinish={onFinish}
            style={{
              width: "100%",
              maxWidth: "500px",
              margin: "15px auto 0 auto",
              fontWeight: "500",
              fontSize: "14px",
            }}
            className="flex flex-col gap-3"
          >
            <Form.Item label="Name:">
              <Input
                size="large"
                placeholder="Enter Name"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.name}
                onChange={(e) =>
                  setFormValues({ ...formValues, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="E-mail:">
              <Input
                size="large"
                placeholder="Enter Email"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.email}
                onChange={(e) =>
                  setFormValues({ ...formValues, email: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Password:">
              <Input
                size="large"
                placeholder="Enter Password"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({ ...formValues, password: e.target.value })
                }
              />
              <Form.Item label="Role:" style={{ marginTop: 15 }}>
                <Select
                  size="large"
                  value={formValues.role}
                  onChange={(value) =>
                    setFormValues({ ...formValues, role: value })
                  }
                  className="super__select text-sm font-normal text-dark h-14"
                  placeholder="Select Role"
                  style={{ height: "40px" }}
                >
                  {storedRole !== "Agent" && (
                    <Select.Option value="Agent">Agent</Select.Option>
                  )}
                  <Select.Option value="Patient">Patient</Select.Option>
                  <Select.Option value="Doctor">Doctor</Select.Option>
                  <Select.Option value="Manufacturer">Manufacturer</Select.Option>
                </Select>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Flex vertical style={{ marginTop: 20 }}>
                <Spin spinning={loading}>
                  <div className="flex">
                    <Button
                      className="bg-primary border border-primary text-white hover:bg-white hover:text-primary rounded-xl !h-14 transition-all ease-out w-full max-w-[320px] mx-auto"
                      type=""
                      htmlType="submit"
                      block
                    >
                      Save
                    </Button>
                  </div>
                </Spin>
              </Flex>
            </Form.Item>
          </Form>
        </Content>
      </Modal>
    </div>
  );
};

export default AddUser;
