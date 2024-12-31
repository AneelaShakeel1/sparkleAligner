import axios from "../config/Axios";

export const approveOrDenyDoctor = async (doctorApproveOrDenyData) => {
  return await axios.post(
    "/api/user/doctor-approval/",
    doctorApproveOrDenyData
  );
};

export const fetchAllApprovals = () => {
  return axios.get("/api/user/doctor-approval/");
};

export const fetchApprovalById = (id) => {
  return axios.get(`/api/user/doctor-approval/${id}`);
};

export const updateApproval = ({ id, doctorApproveOrDenyData }) => {
  return axios.put(`/api/user/doctor-approval/${id}`, doctorApproveOrDenyData);
};

export const deleteApproval = (id) => {
  return axios.delete(`/api/user/doctor-approval/${id}`);
};
