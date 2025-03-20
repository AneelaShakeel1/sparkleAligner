import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Table,
  Pagination,
  Row,
  Modal,
  Form,
  Input,
  Button,
  message,
} from "antd";
import EditUser from "./edit-user";
import DeleteUser from "./delete-user";
import { Svgs } from "../Svgs/svg-icons";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { updateUserAsync, fetchAllUserAsync } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const { Text } = Typography;

function UserCategory({ data, role }) {
  const [selectedEditUser, setSelectedEditUser] = useState(null);
  const [selectedViewUser, setSelectedViewUser] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // New state for treatment preview upload
  const [isTreatmentPreviewModalOpen, setIsTreatmentPreviewModalOpen] =
    useState(false);
  const [selectedPatientForTreatment, setSelectedPatientForTreatment] =
    useState(null);
  const [treatmentFile, setTreatmentFile] = useState(null);
  const [uploadingTreatment, setUploadingTreatment] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setFilteredData(data);
    if (role !== "All") {
      setCurrentPage(1);
      setPageSize(6);
    }
  }, [data, role]);

  const handleEditClick = (user) => {
    setSelectedEditUser(user);
  };

  const handleViewClick = (user) => {
    setSelectedViewUser(user);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleGetMediaClick = async (user) => {
    try {
      const zip = new JSZip();
      const mediaPromises = user.media.map(async (media, index) => {
        const response = await fetch(media.fileUrl);
        const blob = await response.blob();
        const fileExtension =
          media.fileUrl.split(".").pop().split("?")[0] || "unknown";
        zip.file(`media_${index + 1}.${fileExtension}`, blob);
      });
      await Promise.all(mediaPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${user.name}_media.zip`);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const handleDeleteMediaClick = async (user) => {
    try {
      let id = user._id;
      const resultAction = await dispatch(
        updateUserAsync({ id, ...{ media: [] } })
      );
      if (resultAction?.payload) {
        await dispatch(fetchAllUserAsync());
        toast.success("Media has been deleted successfully");
      } else if (resultAction?.error?.message) {
        toast.error(resultAction.error.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error deleting patient media:", error);
      toast.error("Error deleting patient media. Please try again.");
    }
  };

  // Opens the treatment preview modal and sets the current patient
  const openTreatmentPreviewModal = (user) => {
    setSelectedPatientForTreatment(user);
    console.log(user);
    setIsTreatmentPreviewModalOpen(true);
  };

  // Handle file selection change using a native input element
  const handleTreatmentFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTreatmentFile(e.target.files[0]);
    }
  };

  // Handle the treatment preview upload process
  const handleTreatmentPreviewUpload = async () => {
    if (!treatmentFile) {
      message.error("Please select a file to upload.");
      return;
    }

    const agentId = localStorage.getItem("userId");
    if (!agentId) {
      message.error("Agent ID not found. Please log in again.");
      return;
    }

    try {
      setUploadingTreatment(true);
      message.loading({
        content: "Uploading treatment preview...",
        key: "uploadTP",
      });

      // Upload file to Cloudinary using unsigned upload
      const formData = new FormData();
      formData.append("file", treatmentFile);
      // Set your upload preset here (ensure it matches the one configured in your Cloudinary account)
      formData.append("upload_preset", "aneela");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/aneelacloud/upload",
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

      // Prepare the payload for treatment preview endpoint
      const payload = {
        agentId: agentId,
        linkedPatientId: selectedPatientForTreatment._id,
        uploadedFiles: [
          {
            fileName: treatmentFile.name,
            fileUrl: fileUrl,
            uploadedBy: agentId,
            uploadedAt: new Date().toISOString(),
          },
        ],
      };

      // Call the treatment preview API endpoint
      const treatmentResponse = await fetch(
        "http://localhost:8000/api/user/treatment-preview-by-agent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!treatmentResponse.ok) {
        throw new Error(
          `Failed to upload treatment preview: ${treatmentResponse.statusText}`
        );
      }

      message.success({
        content: "Treatment preview uploaded successfully!",
        key: "uploadTP",
      });
      // Clear the file and close the modal
      setTreatmentFile(null);
      setIsTreatmentPreviewModalOpen(false);
    } catch (error) {
      console.error("Error uploading treatment preview:", error);
      message.error({
        content: `Failed to upload treatment preview: ${error.message}`,
        key: "uploadTP",
      });
    } finally {
      setUploadingTreatment(false);
    }
  };

  // Define the base columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text, user) => (
        <div onClick={() => handleViewClick(user)}>{Svgs.viewgray}</div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <Row className="gap-5 flex items-center">
          <div onClick={() => handleEditClick(user)}>
            {selectedEditUser ? <EditUser data={user} /> : Svgs.editg}
          </div>
          <DeleteUser data={user} goBack={() => setSelectedEditUser(null)} />
          {role === "Patient" && user.media.length > 0 && (
            <>
              <Button
                onClick={() => handleGetMediaClick(user)}
                style={{
                  backgroundColor: "#0b3c95",
                  color: "white",
                }}
              >
                Get Media
              </Button>
              <Button
                onClick={() => handleDeleteMediaClick(user)}
                style={{
                  backgroundColor: "#0b3c95",
                  color: "white",
                }}
              >
                Delete Media
              </Button>
            </>
          )}
        </Row>
      ),
    },
  ];

  // Add the treatment preview column only if role is "Patient"
  if (role === "Patient") {
    columns.push({
      title: "Patient treatmentPreview",
      key: "treatmentPreview",
      render: (user) => (
        <Button onClick={() => openTreatmentPreviewModal(user)}>
          Click to upload the treatment Preview
        </Button>
      ),
    });
  }

  return (
    <Layout>
      <div>
        {filteredData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
          />
        ) : (
          <div className="lg:py-20 py-10 px-8 flex flex-col justify-center items-center">
            <Text className="text-[#2C2C2E] md:text-2xl text-xl font-normal mt-2 mb-2">
              No Data Match
            </Text>
          </div>
        )}
      </div>
      {selectedViewUser && (
        <Modal
          title="USER DETAILS"
          open={true}
          onCancel={() => setSelectedViewUser(null)}
          footer={null}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input value={selectedViewUser.name} disabled />
            </Form.Item>
            <Form.Item label="Email" style={{ marginTop: 10 }}>
              <Input value={selectedViewUser.email} disabled />
            </Form.Item>
          </Form>
        </Modal>
      )}
      {filteredData.length > 0 && (
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          className="center-pagination"
          style={{ marginTop: 20 }}
        />
      )}
      <Modal
        title="Upload Treatment Preview"
        open={isTreatmentPreviewModalOpen}
        onCancel={() => setIsTreatmentPreviewModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Select File">
            <input type="file" onChange={handleTreatmentFileChange} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleTreatmentPreviewUpload}
              loading={uploadingTreatment}
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default UserCategory;
