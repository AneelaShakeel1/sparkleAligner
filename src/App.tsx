import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import SuperAdminPortal from "./pages/SuperAdminPortal/SuperAdminPortal";
import DoctorPortal from "./pages/DoctorPortal/DoctorPortal";
import AgentPortalSidebar from "./components/AgentPortalSidebar/AgentPortalSidebar";
import AddUser from "./pages/AddUser/AddUser";
import Patients from "./pages/Patients/Patients";
import Login from "./pages/Login/Login";
import Agents from "./pages/Agents/Agents";
import Doctors from "./pages/Doctors/Doctors";
import EditAgent from "./components/EditAgent/EditAgent";
import EditPatient from "./components/EditPatient/EditPatient";
import EditDoctor from "./components/EditDoctor/EditDoctor";
import UploadTeethImages from "./pages/UploadTeethImages/UploadTeethImages";
import ManageCustomer from "./pages/ManageCustomer/ManageCustomer";
import UploadSTLFiles from "./pages/UploadSTLFiles/UploadSTLFiles";
import UploadTreatmentPreview from "./pages/UploadTreatmentPreview/UploadTreatmentPreview";
import UploadDocuments from "./pages/UploadDocuments/UploadDocuments";
import EditCustomer from "./components/EditCustomer/EditCustomer";
import "./App.css";

const App: React.FC = () => {
  const location = useLocation();

  const noSidebarPages = [
    "/",
    "/doctor-portal",
    "/super-admin-dashboard",
    "/agent-portal",
    "/teeth-images",
    "/customers",
    "/stl-files",
    "/documents",
    "/treatment-preview",
    "/customers/edit/:key",
  ];
  const isNoSidebarPage = noSidebarPages.includes(location.pathname);

  return (
    <>
      {!isNoSidebarPage && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Super Admin Routes */}
        <Route path="/super-admin-dashboard" element={<SuperAdminPortal />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/agents/edit/:key" element={<EditAgent />} />
        <Route path="/patients/edit/:key" element={<EditPatient />} />
        <Route path="/doctors/edit/:key" element={<EditDoctor />} />
        {/* Doctor Portal Route */}
        <Route path="/doctor-portal" element={<DoctorPortal />} />
        {/* Agent Portal Route - includes sub-routes for agent features */}
        <Route path="/agent-portal" element={<AgentPortalSidebar />} />
        <Route path="/teeth-images" element={<UploadTeethImages />} />
        <Route path="/customers" element={<ManageCustomer />} />
        <Route path="/stl-files" element={<UploadSTLFiles />} />
        <Route path="/documents" element={<UploadDocuments />} />
        <Route path="/treatment-preview" element={<UploadTreatmentPreview />} />
        <Route path="/customers/edit/:key" element={<EditCustomer />} />
      </Routes>
    </>
  );
};

export default App;
