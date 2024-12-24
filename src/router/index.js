import Login from "../pages/login.js";
import Home from "../pages/dashboard.js";
import User from "../pages/user.js";
import DoctorDashboard from "../pages/doctordashboard.js";
import ManufacturerDashboard from "../pages/manufacturerdashboard.js";
import ManufacturerResponse from "../pages/manufacturerresponse.js";
import Manufacturer from "../pages/manufacturer.js";
import Doctor from "../pages/doctor.js";
import DoctorResponse from "../pages/doctorresponse.js";
import chat from "../pages/chat.js";
import Analytics from "../pages/analytics.js";

const routes = [
  {
    path: "/",
    pages: () => <Home />,
    isPublic: true,
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
    path: "/doctor-response",
    pages: DoctorResponse,
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
