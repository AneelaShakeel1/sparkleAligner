import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import { SideBar } from "../components/SideBar";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTreatmentPreviewAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { fetchAllPatientsApprovalsAsync } from "../store/patientsApprovals/patientsApprovalsSlice";
import { fetchAllApprovalsAsync } from "../store/doctorApproval/doctorApprovalSlice";
import { fetchAllTreatmentPreviewByAgentAsync } from "../store/treatmentPreviewByAgent/treatmentPreviewByAgentSlice";
import { fetchAllFinalStagePreviewsAsync } from "../store/FinalStagePreviewForDoctorByAgent/FinalStagePreviewForDoctorByAgentSlice";
import { Modal } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Svgs } from "../components/Svgs/svg-icons";

export default function Analytics() {
  const dispatch = useDispatch();
  const { treatmentpreviews } = useSelector((state) => state.treatmentpreview);
  const { patientapprovals } = useSelector((state) => state.patientsApprovals);
  const { doctorapprovals } = useSelector((state) => state.doctorsApproval);
  const { treatmentpreviewsbyagent } = useSelector(
    (state) => state.treatmentpreviewbyagent
  );
  const { finalStagePreviews } = useSelector(
    (state) => state.finalStagePreview
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [patientDetails, setPatientDetails] = useState([]);
  const [dateClicked, setDateClicked] = useState("");

  useEffect(() => {
    dispatch(fetchAllTreatmentPreviewAsync());
    dispatch(fetchAllPatientsApprovalsAsync());
    dispatch(fetchAllApprovalsAsync());
    dispatch(fetchAllTreatmentPreviewByAgentAsync());
    dispatch(fetchAllFinalStagePreviewsAsync());
  }, [dispatch]);

  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const uploadData = treatmentpreviews.reduce(
    (acc, { createdAt, patientId }) => {
      const date = getFormattedDate(createdAt);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ patientName: patientId.name, createdAt });
      return acc;
    },
    {}
  );

  const chartData = Object.entries(uploadData).map(([date, uploads]) => ({
    date,
    count: uploads.length,
    uploads,
  }));

  const handleDataPointClick = (date) => {
    setDateClicked(date);
    const patientsOnDate = uploadData[date];
    if (patientsOnDate) {
      setPatientDetails(
        patientsOnDate.map((patient, index) => ({
          ...patient,
          order: index + 1,
        }))
      );
      setModalVisible(true);
    }
  };

  const statusCounts = {
    "Total Treatment Previews (TP) uploaded": treatmentpreviews.length,
    "Number of TPs waiting for patient approval":
      treatmentpreviewsbyagent?.filter(
        (treatmentpreviewByAgent) =>
          !patientapprovals.some(
            (patientApproval) =>
              patientApproval.patientId._id ===
              treatmentpreviewByAgent.linkedPatientId._id
          )
      ).length,
    "Number of TPs pending doctor review": finalStagePreviews?.filter(
      (finalStagePreview) =>
        !doctorapprovals.some(
          (doctorapproval) =>
            doctorapproval.patientId._id ===
            finalStagePreview.linkedPatientId._id
        )
    ).length,
    "Number of TPs approved by patients": patientapprovals?.filter(
      (treatmentpreview) => treatmentpreview.status === "approve"
    ).length,
    "Number of TPs rejected by patients": patientapprovals?.filter(
      (treatmentpreview) => treatmentpreview.status === "deny"
    ).length,
    "Number of TPs rejected by doctors": doctorapprovals?.filter(
      (treatmentpreview) => treatmentpreview.status === "approve"
    ).length,
    "Number of TPs rejected by doctors": doctorapprovals?.filter(
      (treatmentpreview) => treatmentpreview.status === "deny"
    ).length,
  };

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <PerfectScrollbar style={{ height: "100vh" }}>
        <Content className="pr-12 pt-5 pb-5">
          {Object.entries(statusCounts).map(([key, count]) => (
            <div style={{ marginBottom: 20 }}>
              <div
                key={key}
                style={{
                  backgroundColor: "white",
                  borderWidth: 0.5,
                  borderColor: "lightgray",
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "lighter",
                  color: "#0b3c95",
                  borderRadius: 15,
                  marginLeft: 60,
                  marginBottom: 20,
                }}
              >
                {`${key} : ${count}`}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartData}
                  onClick={(e) => handleDataPointClick(e.activeLabel)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    domain={[1, "auto"]}
                    tickFormatter={(tick) => (tick % 1 === 0 ? tick : "")}
                  />
                  <Line type="bump" dataKey="count" stroke="#0b3c95" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
          <Modal
            title={`Treatment Previews uploaded on ${dateClicked}`}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
          >
            {patientDetails.length > 0 ? (
              patientDetails.map((patient, index) => (
                <p
                  key={index}
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  {Svgs.ellipseblack}
                  {`Patient ${patient.order}: ${patient.patientName}`}
                </p>
              ))
            ) : (
              <p>No TPs uploaded on this date.</p>
            )}
          </Modal>
        </Content>
      </PerfectScrollbar>
    </div>
  );
}
