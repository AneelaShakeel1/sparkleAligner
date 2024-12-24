import React, { useState, useEffect } from "react";
import { Table, Button, Space, Spin, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTreatmentPreviewByIdAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { updateTreatmentPreview } from "../service/treatmentpreviewService";
import { SideBar } from "../components/SideBar";
import { toast } from "react-toastify";
import { Svgs } from "../components/Svgs/svg-icons";

const ManufacturerDashboard = () => {
  const dispatch = useDispatch();
  const { treatmentpreviewsbyid } = useSelector(
    (state) => state.treatmentpreview
  );
  const [loading, setLoading] = useState(false);
  const [selectedTreatmentID, setSelectedTreatmentID] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [file, setFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const manufacturerId = localStorage.getItem("userId");
    if (manufacturerId) {
      dispatch(fetchTreatmentPreviewByIdAsync(manufacturerId));
    }
  }, [dispatch]);

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

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type !== "video/mp4") {
        message.error("Only MP4 files are allowed.");
        return;
      }
      setFile(uploadedFile);
    }
  };
  const handleUploadTP = async () => {
    if (!file) {
      message.error("Please select a file to upload.");
      return;
    }
    if (selectedTreatmentID && selectedAgentId) {
      const uploadedFiles = [
        {
          fileName: file.name,
          fileUrl: "https://picsum.photos/200/300",
          uploadedBy: selectedAgentId,
          uploadedAt: new Date().toISOString(),
        },
      ];
      setLoading(true);
      try {
        const resultAction = await updateTreatmentPreview({
          id: selectedTreatmentID,
          treatmentpreviewData: { uploadedFiles },
        });
        if (resultAction?.status === 200) {
          toast.success("TP Add Successfully");
        } else if (resultAction?.error?.message) {
          toast.error(resultAction.error.message || "Something went wrong");
        }
      } catch (error) {
        toast.error("Failed to add TP:", error.message || error);
      } finally {
        setLoading(false);
        setFile(null);
        setIsModalVisible(false);
      }
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
      title: "Agent",
      dataIndex: "agentId",
      key: "agentId",
      render: (agentId) => (agentId ? agentId.name : "N/A"),
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
          <Button
            onClick={() => {
              setSelectedTreatmentID(record._id);
              setSelectedAgentId(record.agentId._id);
              setIsModalVisible(true);
            }}
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
          >
            Upload TP
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="p-4">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={treatmentpreviewsbyid}
            pagination={false}
          />
        </Spin>
      </div>
      <Modal
        title="Upload TP"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <input type="file" onChange={handleFileUpload} accept="video/mp4" />
        {file && (
          <div
            style={{
              marginTop: "10px",
              justifyContent: "end",
              display: "flex",
            }}
          >
            <Button
              type="primary"
              style={{ backgroundColor: "#0b3c95", color: "white" }}
              loading={loading}
              onClick={handleUploadTP}
            >
              Upload
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManufacturerDashboard;
