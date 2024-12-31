import axios from "../config/Axios";

export const fetchAllPatientsApprovals = () => {
  return axios.get("/api/user/patient-approval/");
};
