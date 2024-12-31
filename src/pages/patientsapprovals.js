import React, { useEffect } from "react";
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SideBar } from "../components/SideBar";
import { fetchAllPatientsApprovalsAsync } from "../store/patientsApprovals/patientsApprovalsSlice";

const PatientsApprovals = () => {
  const dispatch = useDispatch();

  const { approvals, loading } = useSelector(
    (state) => state.patientsApprovals
  );

  useEffect(() => {
    const agentId = localStorage.getItem("userId");

    if (!agentId || agentId === "undefined" || agentId === null) {
      message.error("Agent ID not found. Please log in again.");
      return;
    }
    dispatch(fetchAllPatientsApprovalsAsync());
  }, [dispatch]);

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) =>
        patientId && patientId.name ? patientId.name : "---",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Comments",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="p-4">
        <Table
          columns={columns}
          dataSource={approvals || []}
          pagination={false}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PatientsApprovals;
