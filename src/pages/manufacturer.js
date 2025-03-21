import React, { useState, useEffect } from "react";
import { SideBar } from "../components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUserAsync } from "../store/user/userSlice";
import { addManufacturer } from "../store/manufacturer/manufacturerSlice";
import { Select, Button, Form, Upload, message,Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Manufacturer() {
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [file, setFile] = useState([]);
  const [specialComments, setSpecialComments] = useState("");

  const getAllUsers = useSelector((state) =>
    state.user ? state.user.users : []
  );

  const { Option } = Select;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUserAsync());
  }, [dispatch]);

  const manufacturers = getAllUsers.filter(
    (user) => user.role === "Manufacturer"
  );
  const patients = getAllUsers.filter((user) => user.role === "Patient");

  const handleFileChange = async (info) => {
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
    if (!selectedManufacturer || !selectedPatient || file.length === 0) {
      message.error(
        "Please select both manufacturer, patient, and upload a file."
      );
      return;
    }

    const agentId = localStorage.getItem("userId");

    if (!agentId || agentId === null || agentId === "undefined") {
      message.error("Agent ID not found. Please log in again.");
      return;
    }

    const manufacturer = manufacturers.find(
      (manu) => manu.name === selectedManufacturer
    );
    const patient = patients.find((pat) => pat.name === selectedPatient);

    if (!manufacturer || !patient) {
      message.error("Selected manufacturer or patient is not valid.");
      return;
    }
    const uploadedFiles = file.map((fileItem) => ({
      fileName: fileItem.name,
      fileUrl: fileItem.url,
      uploadedBy: agentId,
      uploadedAt: fileItem.uploadedAt,
    }));

    const payload = {
      agentId: agentId,
      linkedPatientId: patient._id,
      uploadedFiles: uploadedFiles,
      specialComments: specialComments,
    };

    try {
      const resultAction = await dispatch(addManufacturer(payload));
      const response = resultAction.payload;

      if (resultAction.error) {
        message.error(
          resultAction.error.message ||
            "Failed to send patient media to manufacturer."
        );
      } else if (response) {
        message.success("Patient Media Sent Successfully to Maufacturer!");
      } else {
        message.error(response?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(
        "Error while sending patient media to maufacturer:",
        error?.message
      );
      message.error("Failed to send patient media to maufacturer.");
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
          <Form.Item label="Upload Patient Media To Manufacturer" name="file">
            <Upload
              onChange={handleFileChange}
              beforeUpload={() => false}
              fileList={file}
              accept=".pdf, .png, .jpg, .jpeg, .doc, .docx, .mp4, .avi, .mov , .stl"
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
          <Form.Item label="Select Manufacturer" name="manufacturer">
            <Select
              value={selectedManufacturer}
              onChange={(value) => setSelectedManufacturer(value)}
              placeholder="Select a Manufacturer"
              className="w-full"
            >
              {manufacturers.length > 0 ? (
                manufacturers.map((manufacturer) => (
                  <Option key={manufacturer.id} value={manufacturer.name}>
                    {manufacturer.name}
                  </Option>
                ))
              ) : (
                <Option value={null}>No Manufacturers available</Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item label="Special Comments" name="specialComments">
            <Input.TextArea
              rows={1}
              value={specialComments}
              onChange={(e) => setSpecialComments(e.target.value)}
              placeholder="Add special comments."
            />
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
