import axios from "../config/Axios";

export const createTreatmentPreview = async (treatmentpreviewData) => {
  return await axios.post(
    "/api/auth/treatment-previews/",
    treatmentpreviewData
  );
};

export const fetchAllTreatmentPreviews = () => {
  return axios.get("/api/auth/treatment-previews/");
};

export const fetchTreatmentPreviewById = (id) => {
  return axios.get(`/api/auth/treatment-previews/${id}`);
};

export const updateTreatmentPreview = ({ id, treatmentpreviewData }) => {
  return axios.put(`/api/auth/treatment-previews/${id}`, treatmentpreviewData);
};
