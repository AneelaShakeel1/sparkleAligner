import React, { useEffect } from "react";
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SideBar } from "../components/SideBar";
import { fetchAllPatientsApprovalsAsync } from "../store/patientsApprovals/patientsApprovalsSlice";

const PatientsResponse = () => {
  const dispatch = useDispatch();

  const { patientapprovals, loading } = useSelector(
    (state) => state.patientsApprovals
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // user can be agents or super admin bcs in menu-items this page is shown only to agents and superadmin

    if (!userId || userId === "undefined" || userId === null) {
      message.error("Super Admin or Agent ID not found. Please log in again.");
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
          dataSource={patientapprovals || []}
          pagination={false}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PatientsResponse;
