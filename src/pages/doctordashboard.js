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

  // Row-specific toggle state (keyed by row/preview _id)
  const [rowStatuses, setRowStatuses] = useState({});
  // Row-specific comment input (keyed by row id)
  const [rowComments, setRowComments] = useState({});
  const [loading, setLoading] = useState(false);

  // This state stores the final decision (status, comment, timestamp) per row.
  const [finalDecisions, setFinalDecisions] = useState({});

  useEffect(() => {
    const getDoctorId = () => {
      const ID = localStorage.getItem("userId");
      if (ID) {
        setDoctorID(ID);
      } else {
        console.warn("Doctor ID not found.");
      }
    };
    getDoctorId();
  }, []);

  useEffect(() => {
    if (doctorID) {
      dispatch(fetchFinalStagePreviewByIdAsync(doctorID));
    }
  }, [doctorID, dispatch]);

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

  // When "Submit" is clicked in a row.
  // If the row is rejected, a comment must be filled.
  // On success, we store the final decision for that row.
  const handleSubmitDecision = async (row) => {
    const status = rowStatuses[row._id] ? "approve" : "deny";
    if (status === "deny" && (!rowComments[row._id] || rowComments[row._id].trim() === "")) {
      message.error("Please enter a comment for rejection.");
      return;
    }
    const payload = {
      doctorId: localStorage.getItem("userId"),
      status: status,
      comment:
        status === "approve"
          ? "Patient's request is approved after a full review of the documents."
          : rowComments[row._id],
      patientId: row.linkedPatientId._id,
    };
    setLoading(true);
    try {
      const resultAction = await dispatch(addapproveOrDenyDoctor(payload));
      const response = resultAction.payload;
      if (resultAction.error) {
        toast.error(resultAction.error.message || "Failed to send approval.");
      } else if (response) {
        toast.success("Approval sent successfully!");
        const decision = {
          status: status,
          comment: status === "deny" ? rowComments[row._id] : "",
          timestamp: new Date().toLocaleString(),
        };
        setFinalDecisions((prev) => ({ ...prev, [row._id]: decision }));
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error while sending approval:", error?.message);
      message.error("Failed to send approval.");
    } finally {
      setLoading(false);
      // Clear toggle and comment for the row (optional, if you wish to allow re-submission later)
      setRowStatuses((prev) => ({ ...prev, [row._id]: false }));
      setRowComments((prev) => ({ ...prev, [row._id]: "" }));
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
      render: (files) => {
        const showMore = files.length > 2;
        const displayedFiles = files.slice(0, 2).map((file, index) => (
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
      title: "Approval Status",
      render: (text, record) =>
        finalDecisions[record._id] ? (
          <span>
            {finalDecisions[record._id].status === "approve"
              ? `Approved on ${finalDecisions[record._id].timestamp}`
              : `Rejected on ${finalDecisions[record._id].timestamp}: ${finalDecisions[record._id].comment}`}
          </span>
        ) : (
          <Switch
            checked={rowStatuses[record._id] || false}
            onChange={(checked) =>
              setRowStatuses((prev) => ({ ...prev, [record._id]: checked }))
            }
            checkedChildren="Approve"
            unCheckedChildren="Deny"
            style={{
              backgroundColor: rowStatuses[record._id] ? "#0b3c95" : "#898989",
            }}
          />
        ),
    },
    {
      title: "Comment",
      render: (text, record) =>
        !rowStatuses[record._id] && !finalDecisions[record._id] && (
          <Input.TextArea
            rows={2}
            value={rowComments[record._id] || ""}
            onChange={(e) =>
              setRowComments((prev) => ({
                ...prev,
                [record._id]: e.target.value,
              }))
            }
            placeholder="Enter comment if rejecting"
          />
        ),
    },
    {
      title: "Actions",
      render: (row) => (
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: "#0b3c95", color: "white" }}
            onClick={() => handleDownloadFiles(row)}
          >
            {Svgs.download}
          </Button>
          {finalDecisions[row._id] ? (
            // If final decision exists, hide Submit button.
            null
          ) : (
            <Button
              type="primary"
              style={{ backgroundColor: "#0b3c95", color: "white" }}
              onClick={() => handleSubmitDecision(row)}
              disabled={loading}
            >
              Submit
            </Button>
          )}
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
      </div>
    </div>
  );
};

export default DoctorDashboard;
