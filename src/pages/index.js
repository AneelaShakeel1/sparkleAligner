import Login from "../pages/login.js";
import Home from "../pages/dashboard.js";
import User from "./user.js";
import DoctorDashboard from "./doctordashboard.js";
import ManufacturerDashboard from './manufacturerdashboard.js'
import chat from "./chat.js";
import Doctor from "./doctor.js";
import DoctorResponse from "./doctorresponse.js";
import Analytics from "./analytics.js";

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
    path: "/doctor-response",
    pages: DoctorResponse,
    requiredPermission: "manage_services",
  },
  {
    path: "/doctor",
    pages: Doctor,
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
    path: "/users",
    pages: User,
    requiredPermission: "manage_services",
  }
];

export default routes;
