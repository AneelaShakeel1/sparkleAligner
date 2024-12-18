import React, { useContext } from "react";
import {
  Typography,
  Input,
  Row,
} from "antd";
import { Svgs } from "../Svgs/svg-icons";
import { ToggleContext } from "../../context";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

// const userDropdown = (navigate) => (
//   <Menu className="!py-3 border border-[#DBDBDB] rounded-[5px] !shadow-none">
//     {/* <Menu.Item
//       className="dropdown__item__header"
//       key="0"
//       icon={Svgs.profilegray}
//       onClick={() => navigate("/profile")}
//     >
//       Profile
//     </Menu.Item>
//     <Menu.Item
//       className="dropdown__item__header"
//       key="1"
//       icon={Svgs.passwordgray}
//       onClick={() => navigate("/profile")}
//     >
//       Change Password
//     </Menu.Item> */}
//     {/* <Menu.Item
//       className="dropdown__item__header"
//       key="2"
//       icon={Svgs.logoutgray}
//       onClick={() => {
//         localStorage.clear();
//         navigate("/login");
//       }}
//     >
//       Logout
//     </Menu.Item> */}
//   </Menu>
// );

function Header({ children }) {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const usr = useSelector((state) => state?.user?.user);

  const { toggleSideBar } = useContext(ToggleContext);
  return (
    <div className="fixed z-10 w-full grid-width">
      <header className="flex justify-between items-center bg-[#f5f5f5] header__box__shadow py-5 px-4 lg:gap-0 gap-3">
        <Row onClick={toggleSideBar} className="lg:hidden block mr-3 shrink-0">
          {Svgs.bars}
        </Row>
        <div className="bg-white border border-white h-12 rounded-lg flex justify-center items-center px-3 py-1 w-full max-w-[450px]">
          {Svgs.search}
          <Input
            className="text-[#50586c] text-base placeholder:text-[#50586c] !pl-[5px]"
            placeholder="Search..."
            bordered={false}
          />
        </div>
        <div className="flex justify-center items-center lg:gap-6 gap-3">
          {/* <div className="border border-[#e1e3ec] rounded-lg w-12 h-12 flex justify-center items-center badge__super__count">
            <Badge count={2}>{Svgs.bell}</Badge>
          </div> */}
          {/* <Dropdown
            // overlay={userDropdown(navigate)}
            placement="bottomRight"
            trigger={["click"]}
            className="cursor-pointer"
          >
            <Space className="gap-3 items-center">
              <Avatar
                className="rounded-lg w-12 h-12 flex justify-center items-center"
                size="large"
                icon={<UserOutlined />}
              />
              <div className="lg:flex items-center gap-3 hidden">
                <div className="flex flex-col">
                  <Text className="text-base font-normal text-primaryContrast">
                    {usr?.name}
                  </Text>
                  <Text className="text-xs font-normal text-lightContrast">
                    {ROLES[usr?.role?.name]}
                  </Text>
                </div>
                {Svgs.arrowdown}
              </div>
            </Space>
          </Dropdown> */}
        </div>
      </header>
    </div>
  );
}

export default Header;
