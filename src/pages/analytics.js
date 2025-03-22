import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
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
  
  // Moved useSelector inside the component.
  const users = useSelector((state) => (state.user ? state.user.users : []));
  
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
  const [waitingModalVisible, setWaitingModalVisible] = useState(false);
  const [waitingPatientDetails, setWaitingPatientDetails] = useState([]);
  const [waitingDateClicked, setWaitingDateClicked] = useState("");

  // Count metrics based on the users slice.
  const totalUsers = users.length;
  const totalPatients = users.filter((user) => user.role === "Patient").length;
  const totalDoctors = users.filter((user) => user.role === "Doctor").length;
  const totalManufacturers = users.filter(
    (user) => user.role === "Manufacturer"
  ).length;
  const totalAgents = users.filter((user) => user.role === "Agent").length;

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

  const waitingData = treatmentpreviewsbyagent.reduce(
    (acc, { createdAt, linkedPatientId }) => {
      const date = getFormattedDate(createdAt);
      const patientApproval = patientapprovals.find(
        (approval) => approval.patientId._id === linkedPatientId._id
      );
      if (!patientApproval) {
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({ patientName: linkedPatientId.name, createdAt });
      }
      return acc;
    },
    {}
  );

  const waitingChartData = Object.entries(waitingData).map(
    ([date, uploads]) => ({
      date,
      count: uploads.length,
      uploads,
    })
  );

  const statusCounts = {
    "Total Treatment Previews (TP) uploaded": treatmentpreviews.length,
    "TPs waiting for patient approval": treatmentpreviewsbyagent?.filter(
      (treatmentpreviewByAgent) =>
        !patientapprovals.some(
          (patientApproval) =>
            patientApproval.patientId._id ===
            treatmentpreviewByAgent.linkedPatientId._id
        )
    ).length,
    "TPs pending doctor review": finalStagePreviews?.filter(
      (finalStagePreview) =>
        !doctorapprovals.some(
          (doctorapproval) =>
            doctorapproval.patientId._id ===
            finalStagePreview.linkedPatientId._id
        )
    ).length,
  };

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

  const handleWaitingDataPointClick = (date) => {
    setWaitingDateClicked(date);
    const patientsOnDate = waitingData[date];
    if (patientsOnDate) {
      setWaitingPatientDetails(
        patientsOnDate.map((patient, index) => ({
          ...patient,
          order: index + 1,
        }))
      );
      setWaitingModalVisible(true);
    }
  };

  return (
    <div className="h-full min-h-screen grid grid-columns">
      {/* Grid of 8 summary boxes */}
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{totalUsers}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{totalPatients}</p>
          <p className="text-sm text-gray-500">Total Patients</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{totalDoctors}</p>
          <p className="text-sm text-gray-500">Total Doctors</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{totalManufacturers}</p>
          <p className="text-sm text-gray-500">Total Manufacturers</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{totalAgents}</p>
          <p className="text-sm text-gray-500">Total Agents</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">
            {statusCounts["Total Treatment Previews (TP) uploaded"]}
          </p>
          <p className="text-sm text-gray-500">TP Uploaded</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">
            {statusCounts["TPs waiting for patient approval"]}
          </p>
          <p className="text-sm text-gray-500">TPs Waiting Approval</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">
            {statusCounts["TPs pending doctor review"]}
          </p>
          <p className="text-sm text-gray-500">TPs Pending Doctor Review</p>
        </div>
      </div>

      <PerfectScrollbar style={{ height: "100vh" }}>
        <Content className="pr-12 pt-5 pb-5">
          <div style={{ marginBottom: 20 }}>
           
            <div
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
              {`Total Treatment Previews (TP) uploaded: ${statusCounts["Total Treatment Previews (TP) uploaded"]}`}
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
          <div style={{ marginBottom: 20 }}>
            <div
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
              {`Number of TPs waiting for patient approval: ${statusCounts["TPs waiting for patient approval"]}`}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={waitingChartData}
                onClick={(e) => handleWaitingDataPointClick(e.activeLabel)}
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
          <Modal
            title={`Treatment Previews waiting for patient approval from ${waitingDateClicked}`}
            open={waitingModalVisible}
            onCancel={() => setWaitingModalVisible(false)}
            footer={null}
          >
            {waitingPatientDetails.length > 0 ? (
              waitingPatientDetails.map((patient, index) => (
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
              <p>No treatment previews found for this date.</p>
            )}
          </Modal>
        </Content>
      </PerfectScrollbar>
    </div>
  );
}
