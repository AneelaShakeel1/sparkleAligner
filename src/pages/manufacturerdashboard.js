import React, { useState, useEffect } from "react";
import { Table, Button, Space, Spin, Modal, message, Upload } from "antd";
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
  const [file, setFile] = useState([]);
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

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    debugger;
    console.log(uploadedFile, "=============gggg");
    // const file = info.fileList[info.fileList.length - 1].originFileObj;

    try {
      message.loading({ content: "Uploading file...", key: "upload" });

      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("upload_preset", "aneela");
      formData.append("cloud_name", "aneelacloud"); // Add cloud_name

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/aneelacloud/auto/upload", // Correct URL for Cloudinary upload
        {
          method: "POST",
          body: formData, // Send the FormData object as the request body
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }

      // Get the response data from Cloudinary
      const data = await response.json();
      console.log(data, "===================");
      // Get the uploaded file URL from Cloudinary response
      const fileUrl = data.secure_url;
      setFile((prevFiles) => [
        ...prevFiles,
        {
          name: uploadedFile.name,
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
    // if (uploadedFile) {
    //   if (uploadedFile.type !== "video/mp4") {
    //     message.error("Only MP4 files are allowed.");
    //     return;
    //   }
    //   // setFile(uploadedFile);
    // }
  };
  // console.log(file, "======file");
  const handleUploadTP = async () => {
    if (!file) {
      message.error("Please select a file to upload.");
      return;
    }

    if (selectedTreatmentID && selectedAgentId) {
      const uploadedFiles = file.map((fileItem) => ({
        fileName: fileItem.name,
        fileUrl: fileItem.url,
        uploadedBy: selectedAgentId,
        uploadedAt: fileItem.uploadedAt,
      }));

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
        setFile([]);
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
        <Upload
          onChange={handleFileUpload}
          beforeUpload={() => false}
          fileList={file}
          accept=".mp4"
        >
          <Button onClick={handleUploadTP}>Upload</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default ManufacturerDashboard;
