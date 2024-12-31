import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Space,
  Switch,
  Spin,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchFinalStagePreviewByIdAsync } from "../store/FinalStagePreviewForDoctorByAgent/FinalStagePreviewForDoctorByAgentSlice";
import { addapproveOrDenyDoctor } from "../store/doctorApproval/doctorApprovalSlice";
import { SideBar } from "../components/SideBar";
import { toast } from "react-toastify";
import { Svgs } from "../components/Svgs/svg-icons";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const [doctorID, setDoctorID] = useState(null);
  const { finalStagePreviewsById } = useSelector(
    (state) => state.finalStagePreview
  );

  const [status, setStatus] = useState("deny");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getDoctorId = async () => {
      try {
        const ID = localStorage.getItem("userId");
        if (ID) {
          setDoctorID(ID);
        } else {
          console.warn("Doctor ID not found.");
        }
      } catch (error) {
        console.error("Error fetching doctor ID:", error);
      }
    };
    getDoctorId();
  }, [doctorID]);

  useEffect(() => {
    if (doctorID) {
      dispatch(fetchFinalStagePreviewByIdAsync(doctorID));
    }
  }, [doctorID]);

  const handleSaveComment = async () => {
    setLoading(true);

    const payload = {
      doctorId: doctorID,
      status: status,
      comment: comment,
    };
    try {
      const resultAction = await dispatch(addapproveOrDenyDoctor(payload));
      const response = resultAction.payload;

      if (resultAction.error) {
        toast.error(resultAction.error.message || "Failed to send approval.");
      } else if (response) {
        toast.success("Approval Send Successfully!");
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error while sending approval:", error?.message);
      message.error("Failed to send approval.");
    } finally {
      setLoading(false);
      setComment("");
      setVisible(false);
    }
  };

  const handleStatusChange = (checked) => {
    setStatus(checked ? "approve" : "deny");
  };

  const handleDownloadFiles = async (user) => {
    try {
      const zip = new JSZip();
      const patientDocsPromises = user.uploadedFiles.map(async (file) => {
        const response = await fetch(file.fileUrl);
        const blob = await response.blob();
        zip.file(file.fileName, blob);
      });
      await Promise.all(patientDocsPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${user.linkedPatientId.name}_Docs.zip`);
    } catch (error) {
      console.error("Error fetching patient Docs:", error);
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "linkedPatientId",
      key: "linkedPatientId",
      render: (linkedPatientId) =>
        linkedPatientId ? linkedPatientId.name : "---",
    },
    {
      title: "Agent",
      dataIndex: "agentId",
      key: "agentId",
      render: (agentId) => (agentId ? agentId.name : "---"),
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
      // key: "status",
      render: () => (
        <Switch
          checked={status === "approve"}
          onChange={(checked) => handleStatusChange(checked)}
          checkedChildren="Approve"
          unCheckedChildren="Deny"
          style={{
            backgroundColor: status === "approve" ? "#0b3c95" : "#898989",
          }}
        />
      ),
    },
    {
      title: "Actions",
      // key: "actions",
      render: (user) => (
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
            onClick={() => handleDownloadFiles(user)}
          >
            {Svgs.download}
          </Button>
          <Button
            onClick={() => setVisible(true)}
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
            dataSource={finalStagePreviewsById}
            pagination={false}
          />
        </Spin>
        <Modal
          title="Add Comment"
          open={visible}
          onCancel={() => setVisible(false)}
        >
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
