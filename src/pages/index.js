import Login from "../pages/login.js";
import Home from "../pages/dashboard.js";
import User from "./user.js";
import DoctorDashboard from "./doctordashboard.js";
import ManufacturerDashboard from './manufacturerdashboard.js'
import ManufacturerResponse from "./manufacturerresponse.js";
import chat from "./chat.js";
import Doctor from "./doctor.js";
import DoctorsApprovals from "./doctorsapprovals.js";
import Manufacturer from "./manufacturer.js";
import Analytics from "./analytics.js";
import patientsapprovals from "./patientsapprovals.js";

const routes = [
  {
    path: "/",
    pages: () => <Home />,
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
    requiredPermission: "manage_services",
  },
  {
    path: "/doctors-approvals",
    pages: DoctorsApprovals,
    requiredPermission: "manage_services",
  },
  {
    path: "/manufacturer-response",
    pages: ManufacturerResponse,
    requiredPermission: "manage_services",
  },
  {
    path: "/doctor",
    pages: Doctor,
    requiredPermission: "manage_services",
  },
  {
    path: "/manufacturer",
    pages: Manufacturer,
    requiredPermission: "manage_services",
  },
  {
    path: "/doctor-dashboard",
    pages: DoctorDashboard,
    requiredPermission: "manage_services",
  },
  {
    path: "/manufacturer-dashboard",
    pages: ManufacturerDashboard,
    requiredPermission: "manage_services",
  },
  {
    path: "/patients-approvals",
    pages: patientsapprovals,
    requiredPermission: "manage_services",
  },
  {
    path: "/users",
    pages: User,
    requiredPermission: "manage_services",
  }
];

export default routes;
