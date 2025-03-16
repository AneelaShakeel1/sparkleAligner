import Login from "../pages/login.js";
import Home from "../pages/dashboard.js";
import User from "../pages/user.js";
import DoctorDashboard from "../pages/doctordashboard.js";
import ManufacturerDashboard from "../pages/manufacturerdashboard.js";
import ManufacturersResponse from "../pages/manufacturersresponse.js";
import Manufacturer from "../pages/manufacturer.js";
import Doctor from "../pages/doctor.js";
import ChatMain from "../pages/chatMain.js";
import Analytics from "../pages/analytics.js";
import TermsAndConditions from "../pages/termsandconditions.js";
import PatientsResponse from "../pages/patientsresponse.js";
import DoctorsResponse from "../pages/doctorsresponse.js";

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
    pages: ChatMain,
    isPublic: true,
  },
  {
    path: "/terms-and-conditions",
    pages: TermsAndConditions,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/analytics",
    pages: Analytics,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/doctors-response",
    pages: DoctorsResponse,
    requiredPermission: "manage_users",
    isPublic: true,
  },
  {
    path: "/manufacturers-response",
    pages: ManufacturersResponse,
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
    path: "/patients-response",
    pages: PatientsResponse,
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
