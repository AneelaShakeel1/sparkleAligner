import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Space, Switch, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTreatmentPreviewByIdAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { updateTreatmentPreview } from "../service/treatmentpreviewService";
import { SideBar } from "../components/SideBar";
import { toast } from "react-toastify";
import { Svgs } from "../components/Svgs/svg-icons";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { treatmentpreviewsbyid } = useSelector(
    (state) => state.treatmentpreview
  );
  const [specialComments, setSpecialComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedTreatmentID, setSelectedTreatmentID] = useState(null);
  const [treatmentStatus, setTreatmentStatus] = useState({});

  useEffect(() => {
    const doctorId = localStorage.getItem("userId");
    if (doctorId) {
      dispatch(fetchTreatmentPreviewByIdAsync(doctorId));
    }
  }, [dispatch]);

  const handleAddComment = (id) => {
    setSelectedTreatmentID(id);
    setVisible(true);
  };

  const handleSaveComment = async () => {
    if (selectedTreatmentID) {
      const status = treatmentStatus[selectedTreatmentID] || "Rejected";
      setLoading(true);
      try {
        const resultAction = await updateTreatmentPreview({
          id: selectedTreatmentID,
          treatmentpreviewData: { specialComments, status },
        });
        if (resultAction?.status === 200) {
          toast.success("Comments Add Successfully");
        } else if (resultAction?.error?.message) {
          toast.error(resultAction.error.message || "Something went wrong");
        }
      } catch (error) {
        toast.error("Failed to add comments:", error.message || error);
      } finally {
        setLoading(false);
        setVisible(false);
        setSpecialComments("");
      }
    }
  };

  const handleStatusChange = (checked, record) => {
    setTreatmentStatus((prevState) => ({
      ...prevState,
      [record._id]: checked ? "Approved" : "Rejected",
    }));
  };

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
      title: "Approval Status",
      key: "status",
      render: (text, record) => (
        <Switch
          checked={treatmentStatus[record._id] === "Approved"}
          onChange={(checked) => handleStatusChange(checked, record)}
          checkedChildren="Approved"
          unCheckedChildren="Rejected"
        />
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
            onClick={() => handleAddComment(record._id)}
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
          >
            {Svgs.chat}
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
        <Modal
          title="Add Comment"
          visible={visible}
          onCancel={() => setVisible(false)}
        >
          <Input.TextArea
            rows={4}
            value={specialComments}
            onChange={(e) => setSpecialComments(e.target.value)}
            placeholder="Enter your comment here"
            style={{ marginTop: 5 }}
          />
          <div
            style={{ justifyContent: "end", display: "flex", marginTop: 15 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#0b3c95", color: "white" }}
              onClick={handleSaveComment}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DoctorDashboard;
