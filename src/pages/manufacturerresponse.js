import React, { useEffect, useState } from "react";
import { Table, Space, Button, message, Modal, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTreatmentPreviewByIdAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { addTreatmentPreviewByAgent } from "../store/treatmentPreviewByAgent/treatmentPreviewByAgentSlice";
import { SideBar } from "../components/SideBar";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ManufacturerResponse = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [patientID, setPatientID] = useState(null);

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState([]);

  const { treatmentpreviewsbyid } = useSelector(
    (state) => state.treatmentpreview
  );

  useEffect(() => {
    const agentId = localStorage.getItem("userId");

    if (!agentId || agentId === null || agentId === "undefined") {
      message.error("agent ID not found. Please log in again.");
      return;
    }
    dispatch(fetchTreatmentPreviewByIdAsync(agentId));
  }, [dispatch]);

  const handleGetTPsClick = async (user) => {
    try {
      const zip = new JSZip();
      const tpsPromises = user.uploadedFiles.map(async (file, index) => {
        const response = await fetch(file.fileUrl);
        const blob = await response.blob();
        const fileExtension =
          file.fileUrl.split(".").pop().split("?")[0] || "unknown";
        zip.file(`TP_${index + 1}.${fileExtension}`, blob);
      });
      await Promise.all(tpsPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${user.patientId.name}_TPs.zip`);
    } catch (error) {
      console.error("Error fetching treatment previews:", error);
    }
  };

  const handleFileUpload = async (info) => {
    if (!info.fileList || info.fileList.length === 0) {
      message.error("No file selected.");
      return;
    }

    const file = info.fileList[info.fileList.length - 1].originFileObj;
    try {
      message.loading({ content: "Uploading file...", key: "upload" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "aneela");
      formData.append("cloud_name", "aneelacloud");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/aneelacloud/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }
      const data = await response.json();

      const fileUrl = data.secure_url;
      setFile((prevFiles) => [
        ...prevFiles,
        {
          name: file.name,
          url: fileUrl,
          uploadedAt: new Date().toISOString(),
        },
      ]);

      message.success({
        content: "File uploaded successfully!",
        key: "upload",
      });
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      message.error({
        content: `Failed to upload file: ${error.message}`,
        key: "upload",
      });
    }
  };

  const handleUploadTPs = async () => {
    if (!file) {
      message.error("Please select a file to upload.");
      return;
    }

    const agentID = localStorage.getItem("userId");

    if (!agentID || agentID === null || agentID === "undefined") {
      message.error("agent ID not found. Please log in again.");
      return;
    }
    const uploadedFiles = file.map((fileItem) => ({
      fileName: fileItem.name,
      fileUrl: fileItem.url,
      uploadedBy: agentID,
      uploadedAt: fileItem.uploadedAt,
    }));

    setLoading(true);

    const payload = {
      agentId: agentID,
      linkedPatientId: patientID,
      uploadedFiles: uploadedFiles,
    };

    try {
      const resultAction = await dispatch(addTreatmentPreviewByAgent(payload));
      const response = resultAction.payload;

      if (resultAction.error) {
        toast.error(
          resultAction.error.message ||
            "Failed to upload treatment preview by agent."
        );
      } else if (response) {
        toast.success("Treatment Preview  By Agent Uploaded Successfully!");
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(
        "Error while uploading treatment preview by agent:",
        error?.message
      );
      message.error("Failed to upload treatment preview by agent.");
    } finally {
      setLoading(false);
      setFile([]);
      setIsModalVisible(false);
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientId",
      key: "patientId",
      render: (patientId) => (patientId ? patientId.name : "---"),
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturerId",
      key: "manufacturerId",
      render: (manufacturerId) =>
        manufacturerId ? manufacturerId.name : "---",
    },
    {
      title: "Uploaded Files",
      dataIndex: "uploadedFiles",
      key: "uploadedFiles",
      render: (files) => (
        <div className="flex flex-col">
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
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
            onClick={() => handleGetTPsClick(user)}
          >
            Get TPs
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
            onClick={() => {
              setPatientID(user.patientId._id);
              setIsModalVisible(true);
            }}
          >
            Upload TPs
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
          dataSource={treatmentpreviewsbyid}
          pagination={false}
        />
      </div>
      <Modal
        title="Upload Treatment Previews For Patient"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Upload
          onChange={handleFileUpload}
          beforeUpload={() => false}
          fileList={file}
          accept=".mp4"
        >
          <Button icon={<UploadOutlined />}>Click to Upload Files</Button>
        </Upload>
        <div style={{ justifyContent: "end", display: "flex" }}>
          <Button
            onClick={handleUploadTPs}
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
          >
            Upload Treatment Previews
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManufacturerResponse;
