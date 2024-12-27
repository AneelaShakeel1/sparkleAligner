import axios from "../config/Axios";

export const createTreatmentPreviewByAgent = async (
  treatmentPreviewByAgentData
) => {
  return await axios.post(
    "/api/user/treatment-preview-by-agent/",
    treatmentPreviewByAgentData
  );
};

export const fetchAllTreatmentPreviewByAgent = () => {
  return axios.get("/api/user/treatment-preview-by-agent/");
};

export const fetchTreatmentPreviewByAgentById = (id) => {
  return axios.get(`/api/user/treatment-preview-by-agent/${id}`);
};

export const updateTreatmentPreviewByAgent = ({
  id,
  treatmentPreviewByAgentData,
}) => {
  return axios.put(
    `/api/user/treatment-preview-by-agent/${id}`,
    treatmentPreviewByAgentData
  );
};

export const deleteTreatmentPreviewByAgent = (id) => {
  return axios.delete(`/api/user/treatment-preview-by-agent/${id}`);
};
