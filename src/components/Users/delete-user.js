import { useState } from "react";
import { Button, Modal, Typography, Layout, Flex, Image, Spin } from "antd";
import { Svgs } from "../Svgs/svg-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteUserAsync, fetchAllUserAsync } from "../../store/user/userSlice";

const { Text } = Typography;
const { Content } = Layout;

const DeleteUser = ({ data, goBack }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const id = data._id;
      const resultAction = await dispatch(deleteUserAsync(id));
      const response = resultAction.payload;
      if (resultAction.error) {
        toast.error(resultAction.error.message);
      } else if (resultAction) {
        if (response) {
          toast.success("User has been deleted");
          goBack?.();
          dispatch(fetchAllUserAsync());
          setIsModalOpen(false);
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div onClick={showModal} className="flex gap-2 text-[#D83A52]">
        {Svgs.delete}
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel}>
        <Content className="flex flex-col">
          <Image
            preview={false}
            className="max-w-[140px] mx-auto"
            src="../assets/images/trash.svg"
          />
          <div className="flex flex-col justify-center items-center mt-5">
            <Text className="text-base font-normal text-[#2c2c2e] text-center mb-2 max-w-[320px]">
              Are you sure you want to delete{" "}
              <span className="font-bold">{data.name}</span>?
            </Text>
          </div>
          <Flex gap={16} className="mt-6 justify-center">
            <Spin spinning={loading}>
              <Button
                className="bg-primary border border-primary flex justify-center items-center w-full max-w-[110px] py-5 text-sm font-normal text-white rounded-md"
                type=""
                onClick={handleSubmit}
              >
                Delete
              </Button>
            </Spin>
            <Button
              className="bg-[#D9D9D9] border border-[#D9D9D9] flex justify-center items-center w-full max-w-[110px] py-5 text-sm font-normal text-[#2c2c2e] rounded-md"
              type=""
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Flex>
        </Content>
      </Modal>
    </div>
  );
};

export default DeleteUser;
