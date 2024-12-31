import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllApprovalsAsync } from "../store/doctorApproval/doctorApprovalSlice";
import { SideBar } from "../components/SideBar";

const DoctorsApprovals = () => {
  const dispatch = useDispatch();
  const { approvals } = useSelector((state) => state.doctorsApproval);

  useEffect(() => {
    const agentId = localStorage.getItem("userId");

    if (!agentId || agentId === null || agentId === "undefined") return;

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
        <Table columns={columns} dataSource={approvals} pagination={false} />
      </div>
    </div>
  );
};

export default DoctorsApprovals;
