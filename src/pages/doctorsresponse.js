import React, { useEffect } from "react";
import { Table ,message} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllApprovalsAsync } from "../store/doctorApproval/doctorApprovalSlice";
import { SideBar } from "../components/SideBar";

const DoctorsResponse = () => {
  const dispatch = useDispatch();
  const { doctorapprovals } = useSelector((state) => state.doctorsApproval);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // user can be agents or super admin bcs in menu-items this page is shown only to agents and superadmin

    if (!userId || userId === "undefined" || userId === null) {
      message.error("Super Admin or Agent ID not found. Please log in again.");
      return;
    }

    dispatch(fetchAllApprovalsAsync());
  }, [dispatch]);

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => (patientId ? patientId.name : "---"),
    },
    {
      title: "Doctor",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => (doctorId ? doctorId.name : "---"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="p-4 w-full">
        <Table columns={columns} dataSource={doctorapprovals} pagination={false} />
      </div>
    </div>
  );
};

export default DoctorsResponse;
