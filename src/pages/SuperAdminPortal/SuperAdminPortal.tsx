import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SuperAdminPortal.css";

const SuperAdminPortal: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      {
        date: "2024-12-01",
        uploaded: 10,
        approvedByPatient: 120,
        rejectedByPatient: 20,
        waitingForPatientApproval: 10,
        approvedByDoctor: 30,
        rejectedByDoctor: 10,
        pendingDoctorReview: 5,
        patient: "John Doe",
        rejectionReason: "Low quality images",
        waitingDuration: "3 days",
      },
      {
        date: "2024-12-02",
        uploaded: 60,
        approvedByPatient: 20,
        rejectedByPatient: 33,
        waitingForPatientApproval: 56,
        approvedByDoctor: 40,
        rejectedByDoctor: 15,
        pendingDoctorReview: 5,
        patient: "Jane Smith",
        rejectionReason: "Incomplete data",
        waitingDuration: "5 days",
      },
      {
        date: "2024-12-03",
        uploaded: 100,
        approvedByPatient: 15,
        rejectedByPatient: 55,
        waitingForPatientApproval: 65,
        approvedByDoctor: 20,
        rejectedByDoctor: 10,
        pendingDoctorReview: 10,
        patient: "Alice Johnson",
        rejectionReason: "Missing documentation",
        waitingDuration: "4 days",
      },
      {
        date: "2024-12-04",
        uploaded: 50,
        approvedByPatient: 20,
        rejectedByPatient: 44,
        waitingForPatientApproval: 87,
        approvedByDoctor: 30,
        rejectedByDoctor: 10,
        pendingDoctorReview: 5,
        patient: "Mark Lee",
        rejectionReason: "Poor image quality",
        waitingDuration: "2 days",
      },
      {
        date: "2024-12-05",
        uploaded: 66,
        approvedByPatient: 50,
        rejectedByPatient: 86,
        waitingForPatientApproval: 54,
        approvedByDoctor: 40,
        rejectedByDoctor: 15,
        pendingDoctorReview: 5,
        patient: "Emily Davis",
        rejectionReason: "Incorrect information",
        waitingDuration: "6 days",
      },
      {
        date: "2024-12-06",
        uploaded: 33,
        approvedByPatient: 75,
        rejectedByPatient: 5,
        waitingForPatientApproval: 34,
        approvedByDoctor: 20,
        rejectedByDoctor: 10,
        pendingDoctorReview: 10,
        patient: "Robert Brown",
        rejectionReason: "Missing medical history",
        waitingDuration: "1 day",
      },
      {
        date: "2024-12-07",
        uploaded: 10,
        approvedByPatient: 22,
        rejectedByPatient: 24,
        waitingForPatientApproval: 88,
        approvedByDoctor: 30,
        rejectedByDoctor: 10,
        pendingDoctorReview: 5,
        patient: "Sophia Clark",
        rejectionReason: "Insufficient details",
        waitingDuration: "7 days",
      },
      {
        date: "2024-12-08",
        uploaded: 60,
        approvedByPatient: 55,
        rejectedByPatient: 78,
        waitingForPatientApproval: 99,
        approvedByDoctor: 40,
        rejectedByDoctor: 15,
        pendingDoctorReview: 5,
        patient: "James Wilson",
        rejectionReason: "Data mismatch",
        waitingDuration: "3 days",
      },
      {
        date: "2024-12-09",
        uploaded: 100,
        approvedByPatient: 12,
        rejectedByPatient: 11,
        waitingForPatientApproval: 1,
        approvedByDoctor: 20,
        rejectedByDoctor: 10,
        pendingDoctorReview: 10,
        patient: "Lily Martinez",
        rejectionReason: "Patient not available",
        waitingDuration: "4 days",
      },
      {
        date: "2024-12-10",
        uploaded: 50,
        approvedByPatient: 5,
        rejectedByPatient: 66,
        waitingForPatientApproval: 110,
        approvedByDoctor: 30,
        rejectedByDoctor: 10,
        pendingDoctorReview: 5,
        patient: "David Moore",
        rejectionReason: "Missing consent",
        waitingDuration: "5 days",
      },
      {
        date: "2024-12-11",
        uploaded: 66,
        approvedByPatient: 34,
        rejectedByPatient: 90,
        waitingForPatientApproval: 4,
        approvedByDoctor: 40,
        rejectedByDoctor: 15,
        pendingDoctorReview: 5,
        patient: "Olivia Taylor",
        rejectionReason: "Inadequate photos",
        waitingDuration: "2 days",
      },
      {
        date: "2024-12-12",
        uploaded: 33,
        approvedByPatient: 26,
        rejectedByPatient: 5,
        waitingForPatientApproval: 3,
        approvedByDoctor: 20,
        rejectedByDoctor: 10,
        pendingDoctorReview: 10,
        patient: "Daniel Anderson",
        rejectionReason: "Patient not reachable",
        waitingDuration: "6 days",
      },
    ]);
  }, []);

  const handleClickGraph = (graphTitle: string, dataPoint: any) => {
    Modal.info({
      title: graphTitle,
      content: (
        <div>
          <p>
            <strong>Patient:</strong> {dataPoint.patient}
          </p>
          <p>
            <strong>Rejection Reason:</strong> {dataPoint.rejectionReason}
          </p>
          <p>
            <strong>Waiting Duration:</strong> {dataPoint.waitingDuration}
          </p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <div className="tpa-container">
      <h2>Treatment Previews Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uploaded" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <Button
        style={{ marginBottom: 30, marginLeft: 60 }}
        onClick={() =>
          handleClickGraph("Total Treatment Previews Uploaded", data[0])
        }
      >
        View Detailed Data
      </Button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="approvedByPatient" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <Button
        style={{ marginBottom: 30, marginLeft: 60 }}
        onClick={() => handleClickGraph("Approved by Patient", data[1])}
      >
        View Detailed Data
      </Button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rejectedByPatient" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
      <Button
        style={{ marginBottom: 30, marginLeft: 60 }}
        onClick={() => handleClickGraph("Rejected by Patient", data[2])}
      >
        View Detailed Data
      </Button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="waitingForPatientApproval"
            stroke="#ff0000"
          />
        </LineChart>
      </ResponsiveContainer>
      <Button
        style={{ marginBottom: 30, marginLeft: 60 }}
        onClick={() => handleClickGraph("Waiting for Approval", data[3])}
      >
        View Detailed Data
      </Button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="approvedByDoctor" stroke="#42afd2" />
        </LineChart>
      </ResponsiveContainer>
      <Button
        style={{ marginBottom: 30, marginLeft: 60 }}
        onClick={() => handleClickGraph("Approved by Doctor", data[4])}
      >
        View Detailed Data
      </Button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rejectedByDoctor" stroke="#ff6347" />
        </LineChart>
      </ResponsiveContainer>
      <Button
        style={{ marginBottom: 30, marginLeft: 60 }}
        onClick={() => handleClickGraph("Rejected by Doctor", data[5])}
      >
        View Detailed Data
      </Button>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pendingDoctorReview"
            stroke="#ffa500"
          />
        </LineChart>
      </ResponsiveContainer>
      <Button
        style={{ marginBottom: 30, marginLeft: 60 }}
        onClick={() => handleClickGraph("Pending Doctor Review", data[6])}
      >
        View Detailed Data
      </Button>
    </div>
  );
};

export default SuperAdminPortal;
