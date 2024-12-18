import axios from "../config/Axios";

export const createUser = async (userData) => {
  return await axios.post("/api/auth/signup", userData);
};

export const loginUser = ({ email, password }) => {
  return axios.post("/api/auth/login", { email, password });
};

export const loginAdminUser = ({ email, password }) => {
  return axios.post("/api/auth/admin", { email, password });
};

export const fetchAllUsers = () => {
  return axios.get("/api/auth/users");
};

export const updateUser = ({ id, userData }) => {
  return axios.put(`/api/auth/user/${id}`, userData);
};

export const deleteUser = (id) => {
  return axios.delete(`/api/auth/user/${id}`);
};
