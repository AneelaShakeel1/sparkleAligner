import Login from "../pages/login.js";
import Home from "../pages/dashboard.js";
import User from "./user.js";
import DoctorDashboard from "./doctordashboard.js";
import ManufacturerDashboard from './manufacturerdashboard.js'
import ManufacturersResponse from "./manufacturersresponse.js";
import chat from "./chat.js";
import Doctor from "./doctor.js";
import Manufacturer from "./manufacturer.js";
import Analytics from "./analytics.js";
import TermsAndConditions from "./termsandconditions.js";
import PatientsResponse from "./patientsresponse.js";
import DoctorsResponse from "./doctorsresponse.js";

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
    path: "/terms-and-conditions",
    pages: TermsAndConditions,
    requiredPermission: "manage_services",
  },
  {
    path: "/analytics",
    pages: Analytics,
    requiredPermission: "manage_services",
  },
  {
    path: "/doctors-response",
    pages: DoctorsResponse,
    requiredPermission: "manage_services",
  },
  {
    path: "/manufacturers-response",
    pages: ManufacturersResponse,
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
    path: "/patients-response",
    pages: PatientsResponse,
    requiredPermission: "manage_services",
  },
  {
    path: "/users",
    pages: User,
    requiredPermission: "manage_services",
  }
];

export default routes;
