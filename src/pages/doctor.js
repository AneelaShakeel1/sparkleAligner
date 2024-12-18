import React, { useState, useEffect } from "react";
import { SideBar } from "../components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUserAsync } from "../store/user/userSlice";
import { addTreatmentPreview } from "../store/treatmentpreview/treatmentpreviewSlice";
import { Select, Button, Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Doctor() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [specialComments, setSpecialComments] = useState("");
  const [status, setStatus] = useState("Pending");
  const [file, setFile] = useState([]);

  const getAllUsers = useSelector((state) =>
    state.user ? state.user.users : []
  );

  const { Option } = Select;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUserAsync());
  }, [dispatch]);

  const doctors = getAllUsers.filter((user) => user.role === "Doctor");
  const patients = getAllUsers.filter((user) => user.role === "Patient");

  const handleFileChange = (info) => {
    setFile(info.fileList);
    // cloudinary
    // response = url
    // setFileURL(url)
  };

  const handleSend = async () => {
    const agentId = localStorage.getItem("userId");

    if (!selectedDoctor || !selectedPatient || file.length === 0) {
      message.error("Please select both doctor, patient, and upload a file.");
      return;
    }

    if (!agentId || agentId === null || agentId === "undefined") return;

    const doctor = doctors.find((doc) => doc.name === selectedDoctor);
    const patient = patients.find((pat) => pat.name === selectedPatient);

    if (!doctor || !patient) {
      message.error("Selected doctor or patient is not valid.");
      return;
    }

    const uploadedFiles = file.map((fileItem) => ({
      fileName: fileItem.name,
      fileUrl: "https://picsum.photos/200/300",
      uploadedBy: agentId,
      uploadedAt: new Date().toISOString(),
    }));

    const payload = {
      patientId: patient._id,
      doctorId: doctor._id,
      agentId: agentId,
      status: status,
      specialComments: specialComments,
      uploadedFiles: uploadedFiles,
    };

    try {
      const resultAction = await dispatch(addTreatmentPreview(payload));

      const response = resultAction.payload;

      if (resultAction.error) {
        message.error(
          resultAction.error.message || "Failed to send treatment preview."
        );
      } else if (response) {
        message.success("Treatment preview sent successfully!");
      } else {
        message.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error while sending treatment preview:", error?.message);
      message.error("Failed to send treatment preview.");
    }
  };

  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="p-4 w-full flex justify-center">
        <Form
          layout="vertical"
          onFinish={handleSend}
          className="space-y-4 w-full mx-6 my-6"
        >
          <Form.Item label="Upload Treatment Preview" name="file">
            <Upload
              onChange={handleFileChange}
              beforeUpload={() => false}
              fileList={file}
              accept=".pdf, .png, .jpg, .jpeg, .stl"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Select Patient" name="patient">
            <Select
              value={selectedPatient}
              onChange={(value) => setSelectedPatient(value)}
              placeholder="Select a Patient"
              className="w-full"
            >
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <Option key={patient.id} value={patient.name}>
                    {patient.name}
                  </Option>
                ))
              ) : (
                <Option value={null}>No patients available</Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item label="Select Doctor" name="doctor">
            <Select
              value={selectedDoctor}
              onChange={(value) => setSelectedDoctor(value)}
              placeholder="Select a Doctor"
              className="w-full"
            >
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <Option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </Option>
                ))
              ) : (
                <Option value={null}>No doctors available</Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item style={{ justifyContent: "end", display: "flex" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#0b3c95", color: "white" }}
            >
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
