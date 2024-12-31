import Login from "../pages/login.js";
import Home from "../pages/dashboard.js";
import User from "../pages/user.js";
import DoctorDashboard from "../pages/doctordashboard.js";
import ManufacturerDashboard from "../pages/manufacturerdashboard.js";
import ManufacturerResponse from "../pages/manufacturerresponse.js";
import Manufacturer from "../pages/manufacturer.js";
import Doctor from "../pages/doctor.js";
import DoctorsApprovals from "../pages/doctorsapprovals.js";
import chat from "../pages/chat.js";
import Analytics from "../pages/analytics.js";
import patientsapprovals from "../pages/patientsapprovals.js";

const routes = [
  {
    path: "/",
    pages: () => <Home />,
    isPublic: false,
  },
  {
    path: "/login",
    pages: () => <Login />,
    isPublic: true,
  },
  {
    path: "/chat",
    pages: chat,
    isPublic: true,
  },
  {
    path: "/analytics",
    pages: Analytics,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/doctors-approvals",
    pages: DoctorsApprovals,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/manufacturer-response",
    pages: ManufacturerResponse,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/doctor",
    pages: Doctor,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/manufacturer",
    pages: Manufacturer,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/patients-approvals",
    pages: patientsapprovals,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/doctor-dashboard",
    pages: DoctorDashboard,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/manufacturer-dashboard",
    pages: ManufacturerDashboard,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/user",
    pages: User,
    requiredPermission: "manage_users",
    isPublic: true,
  },
];

export default routes;
