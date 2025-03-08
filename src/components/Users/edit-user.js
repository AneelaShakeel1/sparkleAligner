import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Flex,
  Typography,
  Layout,
  Spin,
} from "antd";
import { Svgs } from "../Svgs/svg-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllUserAsync, updateUserAsync } from "../../store/user/userSlice";

const { Text } = Typography;
const { Content } = Layout;

const EditUser = ({ data }) => {
  console.log(data, "data here");
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    // password: "",
  });

  useEffect(() => {
    if (data) {
      setFormValues({
        name: data.name || "",
        email: data.email || "",
        // password: data.password || "",
      });
    }
  }, [data]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let id = data._id;
      const resultAction = await dispatch(
        updateUserAsync({ id, ...formValues })
      );
      if (resultAction && resultAction?.payload) {
        await dispatch(fetchAllUserAsync());
        toast.success("User has been updated");
        setFormValues({
          name: String(data.name),
          email: String(data.email),
          // password: String(data.password),
        });
        setIsModalOpen(false);
      } else if (resultAction?.error?.message) {
        toast.error(resultAction?.error?.message || "something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div onClick={showModal} className="flex gap-2">
        {Svgs.editg}
      </div>
      <Modal destroyOnClose open={isModalOpen} onCancel={handleCancel}>
        <Content className="flex flex-col">
          <Text className="text-primary md:text-[32px] text-xl font-medium text-center">
            Edit User
          </Text>
          <div className="flex flex-col justify-center items-center mt-5">
            <Text className="text-sm font-normal text-[#303030] text-center mb-2">
              Please fill the details below to edit User.
            </Text>
          </div>
          <Form
            name="login"
            size="large"
            layout="vertical"
            onFinish={handleSubmit}
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
                placeholder="Edit your name"
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
                placeholder="Edit your Email"
                className="super__select text-sm font-normal text-dark h-14"
                value={formValues.email}
                onChange={(e) =>
                  setFormValues({ ...formValues, email: e.target.value })
                }
              />
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
                      Update
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

export default EditUser;
