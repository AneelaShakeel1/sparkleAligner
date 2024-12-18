import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Content } from "antd/es/layout/layout";
import { SideBar } from "../components/SideBar";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTreatmentPreviewAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { Radio, Table, Card } from "antd";

export default function Analytics() {
  const [filteredTreatmentPreviews, setFilteredTreatmentPreviews] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Uploaded");
  const dispatch = useDispatch();
  const { treatmentpreviews } = useSelector((state) => state.treatmentpreview);
  const [treatmentpreviewsByID, setTreatmentPreviewsByID] = useState([]);

  const role = localStorage.getItem("role");

  const ID = localStorage.getItem("userId");

  useEffect(() => {
    let filtered;
    if (role === "Agent") {
      filtered = treatmentpreviews.filter(
        (treatmentpreview) => treatmentpreview.agentId._id === ID
      );
    } else if (role === "Doctor") {
      filtered = treatmentpreviews.filter(
        (treatmentpreview) => treatmentpreview.doctorId._id === ID
      );
    }
    setTreatmentPreviewsByID(filtered);
  }, [treatmentpreviews, role, ID]);

  useEffect(() => {
    dispatch(fetchAllTreatmentPreviewAsync());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [];
    if (selectedStatus === "Uploaded") {
      filtered =
        role === "Agent" || role == "Doctor"
          ? treatmentpreviewsByID
          : treatmentpreviews;
    } else {
      filtered = (
        role === "Agent" || role == "Doctor"
          ? treatmentpreviewsByID
          : treatmentpreviews
      ).filter(
        (treatmentpreview) => treatmentpreview.status === selectedStatus
      );
    }
    setFilteredTreatmentPreviews(filtered);
  }, [treatmentpreviews, selectedStatus, role, treatmentpreviewsByID]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => (patientId ? patientId.name : "---"),
    },
    role !== "Agent"
      ? {
          title: "Agent Name",
          dataIndex: "agentId",
          key: "agentId",
          render: (agentId) => (agentId ? agentId.name : "---"),
        }
      : null,
    role !== "Doctor"
      ? {
          title: "Doctor Name",
          dataIndex: "doctorId",
          key: "doctorId",
          render: (doctorId) => (doctorId ? doctorId.name : "---"),
        }
      : null,
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created By",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        const date = new Date(createdAt);
        return new Intl.DateTimeFormat("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
      },
    },
  ].filter(Boolean);

  const statusCounts = {
    TPs_Uploaded: (role === "Agent" || role == "Doctor"
      ? treatmentpreviewsByID
      : treatmentpreviews
    ).length,
    TPs_Approved: (role === "Agent" || role == "Doctor"
      ? treatmentpreviewsByID
      : treatmentpreviews
    ).filter((treatmentpreview) => treatmentpreview.status === "Approved")
      .length,
    TPs_Rejected: (role === "Agent" || role == "Doctor"
      ? treatmentpreviewsByID
      : treatmentpreviews
    ).filter((treatmentpreview) => treatmentpreview.status === "Rejected")
      .length,
    TPs_Pending: (role === "Agent" || role == "Doctor"
      ? treatmentpreviewsByID
      : treatmentpreviews
    ).filter((treatmentpreview) => treatmentpreview.status === "Pending")
      .length,
  };

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="relative flex flex-col">
        <Header />
        <PerfectScrollbar style={{ height: "100vh" }}>
          <Content className="px-4 pt-28 pb-6">
            <div className="justify-between flex mb-5 mr-2">
              {Object.entries(statusCounts).map(([key, count]) => (
                <Card
                  key={key}
                  title={
                    <span
                      style={{ color: "#0b3c95" }}
                    >{`${key} : ${count}`}</span>
                  }
                  style={{
                    backgroundColor: "white",
                    boxShadow: "4px 4px 8px 4px rgba(0, 0, 0, 0.1)",
                    height: 50,
                  }}
                />
              ))}
            </div>
            <Radio.Group
              onChange={handleStatusChange}
              value={selectedStatus}
              className="justify-between flex mx-4"
            >
              {["Uploaded", "Approved", "Rejected", "Pending"].map((status) => (
                <Radio
                  key={status}
                  value={status}
                  className={selectedStatus === status ? "checked-radio" : ""}
                >
                  {status}
                </Radio>
              ))}
            </Radio.Group>

            <style>
              {`.checked-radio .ant-radio-inner { border-color: white !important; background-color: #0b3c95 !important; }`}
            </style>
            <div className="mt-6">
              <Table
                columns={columns}
                dataSource={filteredTreatmentPreviews}
                pagination={false}
              />
            </div>
          </Content>
        </PerfectScrollbar>
      </div>
    </div>
  );
}
