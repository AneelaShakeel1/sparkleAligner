import React, { useState } from "react";
import { Button, Modal, Typography, Layout, Flex, Image } from "antd";
import { Svgs } from "../Svgs/svg-icons";

const { Text } = Typography;
const { Content } = Layout;

const Logout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.pathname = "/login";
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Button
        className="item__logout__hover w-full max-w-[240px] mx-auto py-2 text-base font-semibold text-white rounded-[10px]"
        type=""
        icon={Svgs.logoutwhite}
        onClick={showModal}
      >
        Log Out
      </Button>
      <Modal open={isModalOpen} onCancel={handleCancel}>
        <Content className="flex flex-col">
          <Image
            preview={false}
            className="max-w-[75px] mx-auto"
            src="../assets/images/logout-icon.svg"
          />
          <div className="flex flex-col justify-center items-center mt-5">
            <Text className="text-base font-semibold text-[#0F172A] text-center mb-2">
              Log Out
            </Text>
            <Text className="text-base font-normal text-[#2c2c2e] text-center mb-2 max-w-[320px]">
              Are you sure you want to log out?
            </Text>
          </div>
          <Flex gap={16} className="mt-6 justify-end">
            <Button
              className="flex justify-center items-center w-full max-w-[120px] py-5 text-sm font-normal text-primary rounded-md"
              type=""
              onClick={handleLogout}
            >
              Log out
            </Button>
            <Button
              className="bg-primary border border-primary flex justify-center items-center w-full max-w-[120px] py-5 text-sm font-normal text-white rounded-md"
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

export default Logout;
