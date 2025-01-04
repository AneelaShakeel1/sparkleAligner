import React, { useState, useEffect } from "react";
import { Table, Button, Space, Spin, Modal, message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllManufacturerAsync } from "../store/manufacturer/manufacturerSlice";
import { addTreatmentPreview } from "../store/treatmentpreview/treatmentpreviewSlice";
import { UploadOutlined } from "@ant-design/icons";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { SideBar } from "../components/SideBar";
import { toast } from "react-toastify";
import { Svgs } from "../components/Svgs/svg-icons";

const ManufacturerDashboard = () => {
  const dispatch = useDispatch();
  const { manufacturers } = useSelector((state) => state.manufacturer);
  const [loading, setLoading] = useState(false);
  const [manufacturerTreatmentPreviewID, setManufacturerTreatmentPreviewID] =
    useState(null);
  const [agentID, setAgentID] = useState(null);
  const [patientID, setPatientID] = useState(null);
  const [specialComments, setSpecialComments] = useState("");
  const [status, setStatus] = useState("Pending");
  const [file, setFile] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllManufacturerAsync());
  }, [dispatch]);

  const handleGetMediaClick = async (user) => {
    try {
      const zip = new JSZip();
      const uploadedFilesPromises = user.uploadedFiles.map(async (file) => {
        const response = await fetch(file.fileUrl);
        const blob = await response.blob();
        zip.file(file.fileName, blob);
      });
      await Promise.all(uploadedFilesPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${user.linkedPatientId.name}_media.zip`);
    } catch (error) {
      console.error("Error fetching patient media:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
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

  const handleUploadTP = async () => {
    if (!file) {
      message.error("Please select a file to upload.");
      return;
    }

    const manufacturerID = localStorage.getItem("userId");

    if (
      !manufacturerID ||
      manufacturerID === null ||
      manufacturerID === "undefined"
    ) {
      message.error("Manufacturer ID not found. Please log in again.");
      return;
    }
    const uploadedFiles = file.map((fileItem) => ({
      fileName: fileItem.name,
      fileUrl: fileItem.url,
      uploadedBy: manufacturerID,
      uploadedAt: fileItem.uploadedAt,
    }));

    setLoading(true);

    const payload = {
      patientId: patientID,
      agentId: agentID,
      manufacturerId: manufacturerID,
      manufacturerTreatmentPreviewId: manufacturerTreatmentPreviewID,
      status: status,
      specialComments: specialComments,
      uploadedFiles: uploadedFiles,
    };

    try {
      const resultAction = await dispatch(addTreatmentPreview(payload));
      const response = resultAction.payload;

      if (resultAction.error) {
        toast.error(
          resultAction.error.message || "Failed to upload treatment preview."
        );
      } else if (response) {
        toast.success("Treatment Preview Uploaded Successfully!");
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error while uploading treatment preview:", error?.message);
      message.error("Failed to upload treatment preview.");
    } finally {
      setLoading(false);
      setFile([]);
      setIsModalVisible(false);
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "linkedPatientId",
      key: "linkedPatientId",
      render: (linkedPatientId) =>
        linkedPatientId ? linkedPatientId.name : "N/A",
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
      render: (files) => {
        const showMore = files.length > 1;
        const displayedFiles = files.slice(0, 1).map((file, index) => (
          <a
            href={file.fileUrl}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.fileName}
          </a>
        ));
        return (
          <Space>
            {displayedFiles.reduce((prev, curr, index) => {
              if (index === 0) return [curr];
              return [...prev, ",", curr];
            }, [])}
            {showMore && (
              <span
                style={{ color: "#0b3c95", cursor: "pointer", fontSize: 10 }}
              >
                More media...
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Special Comments",
      dataIndex: "specialComments",
      key: "specialComments",
      render: (specialComments) => {
        if (specialComments && specialComments.length > 15) {
          return specialComments.slice(0, 15) + "...";
        }
        return specialComments || "---";
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text, user) => (
        <Button
          type="primary"
          htmlType="submit"
          style={{ backgroundColor: "#0b3c95", color: "white" }}
          onClick={() => {
            setSelectedUser(user);
            setIsViewModalVisible(true);
          }}
        >
          {Svgs.view}
        </Button>
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
            onClick={() => handleGetMediaClick(user)}
          >
            {Svgs.download}
          </Button>
          <Button
            onClick={() => {
              setManufacturerTreatmentPreviewID(user._id);
              setPatientID(user.linkedPatientId._id);
              setAgentID(user.agentId._id);
              setIsModalVisible(true);
            }}
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
          >
            <UploadOutlined />
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
            dataSource={manufacturers}
            pagination={false}
          />
        </Spin>
      </div>
      <Modal
        title="Upload Treatment Preview"
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
            onClick={handleUploadTP}
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
          >
            Upload Treatment Preview
          </Button>
        </div>
      </Modal>
      <Modal
        title="Patient Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedUser && (
          <div>
            <p>
              <strong>Patient:</strong>{" "}
              {selectedUser.linkedPatientId?.name || "---"}
            </p>
            <p>
              <strong>Agent:</strong> {selectedUser.agentId?.name || "---"}
            </p>
            <p>
              <strong>Special Comments:</strong>{" "}
              {selectedUser.specialComments || "No comments available."}
            </p>
            <p>
              <strong>Uploaded Files:</strong>
            </p>
            <Space>
              {selectedUser.uploadedFiles?.map((file, index) => (
                <React.Fragment key={index}>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.fileName}
                  </a>
                  {index < selectedUser.uploadedFiles.length - 1 && ", "}
                </React.Fragment>
              ))}
            </Space>
            <p>
              <strong>Date:</strong> {formatDate(selectedUser.createdAt)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManufacturerDashboard;
