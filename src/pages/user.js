import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Content } from "antd/es/layout/layout";
import { SideBar } from "../components/SideBar";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import UserCategory from "../components/Users/user-category";
import { fetchAllUserAsync } from "../store/user/userSlice";
import CreateUser from "../components/Users/add-user";
import { Radio } from "antd";

export default function Users() {

  const getAllUsers = useSelector((state) =>
    state.user ? state.user.users : []
  );

  const [filteredUsers, setFilteredUsers] = useState([]);

  const dispatch = useDispatch();

  const role = localStorage.getItem("role");

  const [selectedRole, setSelectedRole] = useState(
    role === "Agent" ? "All" : "Agent"
  );

  useEffect(() => {
    dispatch(fetchAllUserAsync());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRole === "All" && role === "Agent") {
      const filtered = getAllUsers.filter((user) => user.role !== "Agent");
      setFilteredUsers(filtered);
    } else if (selectedRole === "All" && role !== "Agent") {
      setFilteredUsers(getAllUsers);
    } else {
      const filtered = getAllUsers.filter((user) => user.role === selectedRole);
      setFilteredUsers(filtered);
    }
  }, [getAllUsers, selectedRole]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="relative flex flex-col">
        <Header />
        <PerfectScrollbar style={{ height: "100vh" }}>
          <Content className="px-4 pt-28 pb-6">
            <div className="flex justify-end items-center mr-8">
              <Radio.Group onChange={handleRoleChange} value={selectedRole}>
                <Radio
                  value="All"
                  className={selectedRole === "All" ? "checked-radio" : ""}
                >
                  All
                </Radio>
                {role !== "Agent" && (
                  <Radio
                    value="Agent"
                    className={selectedRole === "Agent" ? "checked-radio" : ""}
                  >
                    Agents
                  </Radio>
                )}
                <Radio
                  value="Doctor"
                  className={selectedRole === "Doctor" ? "checked-radio" : ""}
                >
                  Doctors
                </Radio>
                <Radio
                  value="Patient"
                  className={selectedRole === "Patient" ? "checked-radio" : ""}
                >
                  Patients
                </Radio>
                <Radio
                  value="Manufacturer"
                  className={selectedRole === "Manufacturer" ? "checked-radio" : ""}
                >
                  Manufacturer
                </Radio>
              </Radio.Group>
              <style>
                {`.checked-radio .ant-radio-inner { border-color:white !important; background-color: #0b3c95 !important}`}
              </style>
              <CreateUser />
            </div>
            <div className="mt-6">
                <UserCategory
                  data={filteredUsers || []}
                />
            </div>
          </Content>
        </PerfectScrollbar>
      </div>
    </div>
  );
}
