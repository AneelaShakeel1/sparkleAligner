import React, { useState, useEffect } from "react";
import { SideBar } from "../components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUserAsync } from "../store/user/userSlice";
import { addFinalStagePreview } from "../store/FinalStagePreviewForDoctorByAgent/FinalStagePreviewForDoctorByAgentSlice";
import { Select, Button, Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Doctor() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
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
      fileUrl: fileItem.url,
      uploadedBy: agentId,
      uploadedAt: new Date().toISOString(),
    }));

    const payload = {
      agentId: agentId,
      doctorId: doctor._id,
      linkedPatientId: patient._id,
      uploadedFiles: uploadedFiles,
    };

    try {
      const resultAction = await dispatch(addFinalStagePreview(payload));

      const response = resultAction.payload;

      if (resultAction.error) {
        message.error(
          resultAction.error.message ||
            "Failed to send final stage preview to doctor."
        );
      } else if (response) {
        message.success("Final Stage Preview sent successfully!");
      } else {
        message.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(
        "Error while sending final stage preview to doctor:",
        error?.message
      );
      message.error("Failed to send final stage preview to doctor.");
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
          <Form.Item label="Upload Final Stage Preview To Doctor" name="file">
            <Upload
              onChange={handleFileUpload}
              beforeUpload={() => false}
              fileList={file}
              accept=".pdf, .png, .jpg, .jpeg, .doc, .docx, .mp4, .avi, .mov , .stl"
            >
              <Button icon={<UploadOutlined />}>Click to Upload Files</Button>
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
