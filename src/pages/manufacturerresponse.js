import React, { useEffect } from "react";
import { Table, Space, Button } from "antd";
import { Svgs } from "../components/Svgs/svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTreatmentPreviewAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { SideBar } from "../components/SideBar";

const ManufacturerResponse = () => {
  const dispatch = useDispatch();
  const { treatmentpreviews } = useSelector((state) => state.treatmentpreview);

  useEffect(() => {
    dispatch(fetchAllTreatmentPreviewAsync());
  }, [dispatch]);

  const agentId = localStorage.getItem("userId");

  if (!agentId || agentId === null || agentId === "undefined") return;

  const filteredTreatmentPreviews = treatmentpreviews.filter(
    (preview) => preview.agentId?._id === agentId && preview.manufacturerId?._id
  );

  const handleDownloadFiles = async (files) => {
    for (const file of files) {
      const response = await fetch(file.fileUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", file.fileName || "file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => (patientId ? patientId.name : "N/A"),
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturerId",
      key: "manufacturerId",
      render: (manufacturerId) =>
        manufacturerId ? manufacturerId.name : "N/A",
    },
    {
      title: "Uploaded Files",
      dataIndex: "uploadedFiles",
      key: "uploadedFiles",
      render: (files) => (
        <Space>
          {files.map((file) => (
            <a
              href={file.fileUrl}
              key={file._id}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.fileName}
            </a>
          ))}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
            onClick={() => handleDownloadFiles(record.uploadedFiles)}
          >
            {Svgs.download}
          </Button>
        </Space>
      ),
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

export default ManufacturerResponse;
