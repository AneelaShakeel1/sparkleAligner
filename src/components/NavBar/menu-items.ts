export interface NavMenuItem {
  label: string;
  key: string;
  link: string;
  className: string;
}

export const menuItems: NavMenuItem[] = [
  {
    label: "Dashboard",
    key: "dashboard",
    link: "/",
    className: "item__hover sideBarLinks",
  },
  {
    label: "Management",
    key: "management",
    className: "item__hover sideBarLinks",
    link: "/management",
  },
];
