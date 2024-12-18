import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTreatmentPreviewAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { SideBar } from "../components/SideBar";

const DoctorResponse = () => {
  const dispatch = useDispatch();
  const { treatmentpreviews } = useSelector((state) => state.treatmentpreview);

  useEffect(() => {
    dispatch(fetchAllTreatmentPreviewAsync());
  }, [dispatch]);

  const agentId = localStorage.getItem("userId");

  if (!agentId || agentId === null || agentId === "undefined") return;

  const filteredTreatmentPreviews = treatmentpreviews.filter(
    (preview) => preview.agentId?._id === agentId
  );

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => (patientId ? patientId.name : "N/A"),
    },
    {
      title: "Doctor",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (doctorId) => (doctorId ? doctorId.name : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Special Comments",
      dataIndex: "specialComments",
      key: "specialComments",
      render: (specialComments) =>
        specialComments ? specialComments : "- - -",
    },
  ];

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="p-4 w-full">
        <Table
          columns={columns}
          dataSource={filteredTreatmentPreviews}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default DoctorResponse;
