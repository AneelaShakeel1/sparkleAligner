import { Svgs } from "../Svgs/svg-icons";

const SIDEBAR_CLASS = "item__hover sideBarLinks";

const MENU_CONFIG = {
  Doctor: [
    {
      label: "Doctor Dashboard",
      key: "doctor-dashboard",
      icon: Svgs.adminprofile,
      className: SIDEBAR_CLASS,
      link: "/doctor-dashboard",
    },
    {
      label: "Terms And Conditions",
      key: "termsandconditions",
      icon: Svgs.exportcsv,
      link: "/terms-and-conditions",
      className: SIDEBAR_CLASS,
    },
  ],
  SuperAdmin: [
    {
      label: "Dashboard",
      key: "dashboard",
      icon: Svgs.dashboard,
      link: "/",
      className: SIDEBAR_CLASS,
    },
    {
      label: "Analytics",
      key: "analytics",
      icon: Svgs.analytics,
      link: "/analytics",
      className: SIDEBAR_CLASS,
    },
    {
      label: "User Management",
      key: "user-management",
      icon: Svgs.servicecategory,
      className: SIDEBAR_CLASS,
      children: [
        {
          label: "User",
          key: "User",
          link: "/user",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
        {
          label: "Patients Response",
          key: "Patients Response",
          link: "/patients-response",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
      ],
    },
    {
      label: "Doctor Management",
      key: "doctor-management",
      icon: Svgs.adminprofile,
      className: SIDEBAR_CLASS,
      children: [
        {
          label: "Doctor",
          key: "Doctor",
          link: "/doctor",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
        {
          label: "Doctors Response",
          key: "Doctors Response",
          link: "/doctors-response",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
      ],
    },
    {
      label: "Manufacturer Management",
      key: "manufacturer-management",
      icon: Svgs.vendormanagement,
      className: SIDEBAR_CLASS,
      children: [
        {
          label: "Manufacturer",
          key: "Manufacturer",
          link: "/manufacturer",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
        ,
        {
          label: "Manufacturers Response",
          key: "Manufacturers Response",
          link: "/manufacturers-response",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
      ],
    },
    {
      label: "Chat Support",
      key: "chat-support",
      icon: Svgs.chat,
      link: "/chat",
      className: SIDEBAR_CLASS,
    },
  ],
  Agent: [
    {
      label: "Dashboard",
      key: "dashboard",
      icon: Svgs.dashboard,
      link: "/",
      className: SIDEBAR_CLASS,
    },
    {
      label: "User Management",
      key: "user-management",
      icon: Svgs.servicecategory,
      className: SIDEBAR_CLASS,
      children: [
        {
          label: "User",
          key: "User",
          link: "/user",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
        {
          label: "Patients Response",
          key: "Patients Response",
          link: "/patients-response",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
      ],
    },
    {
      label: "Doctor Management",
      key: "doctor-management",
      icon: Svgs.adminprofile,
      className: SIDEBAR_CLASS,
      children: [
        {
          label: "Doctor",
          key: "Doctor",
          link: "/doctor",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
        {
          label: "Doctors Response",
          key: "Doctors Response",
          link: "/doctors-response",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
      ],
    },
    {
      label: "Manufacturer Management",
      key: "manufacturer-management",
      icon: Svgs.vendormanagement,
      className: SIDEBAR_CLASS,
      children: [
        {
          label: "Manufacturer",
          key: "Manufacturer",
          link: "/manufacturer",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
        {
          label: "Manufacturers Response",
          key: "Manufacturers Response",
          link: "/manufacturers-response",
          className: SIDEBAR_CLASS,
          icon: Svgs.ellipse,
        },
      ],
    },
    {
      label: "Chat Support",
      key: "chat-support",
      icon: Svgs.chat,
      link: "/chat",
      className: SIDEBAR_CLASS,
    },
  ],
  Manufacturer: [
    {
      label: "Manufacturer Dashboard",
      key: "manufacturer-dashboard",
      icon: Svgs.vendormanagement,
      className: SIDEBAR_CLASS,
      link: "/manufacturer-dashboard",
    },
  ],
};

export const getMenuItems = () => {
  const role = localStorage.getItem("role");
  return MENU_CONFIG[role] || [];
};
