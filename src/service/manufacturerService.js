import axios from "../config/Axios";

export const createManufacturer = async (manufacturerData) => {
  return await axios.post(
    "/api/patient-Data-By-The-Agent-For-Manufacturer/",
    manufacturerData
  );
};

export const fetchAllManufacturers = () => {
  return axios.get("/api/patient-Data-By-The-Agent-For-Manufacturer/");
};

export const fetchManufacturerById = (id) => {
  return axios.get(`/api/patient-Data-By-The-Agent-For-Manufacturer/${id}`);
};

export const updateManufacturer = ({ id, manufacturerData }) => {
  return axios.put(
    `/api/patient-Data-By-The-Agent-For-Manufacturer/${id}`,
    manufacturerData
  );
};

export const deleteManufacturer = (id) => {
  return axios.delete(`/api/patient-Data-By-The-Agent-For-Manufacturer/${id}`);
};
