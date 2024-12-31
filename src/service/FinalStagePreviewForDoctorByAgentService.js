import axios from "../config/Axios";

export const createFinalStagePreview = async (finalStagePreviewData) => {
  return await axios.post("/api/final-stage-preview/", finalStagePreviewData);
};

export const fetchAllFinalStagePreviews = () => {
  return axios.get("/api/final-stage-preview/");
};

export const fetchFinalStagePreviewById = (id) => {
  return axios.get(`/api/final-stage-preview/${id}`);
};

export const updateFinalStagePreview = ({ id, finalStagePreviewData }) => {
  return axios.put(`/api/final-stage-preview/${id}`, finalStagePreviewData);
};

export const deleteFinalStagePreview = (id) => {
  return axios.delete(`/api/final-stage-preview/${id}`);
};
