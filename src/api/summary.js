import api from "../app/axios";

export const summarizeEmail = async (emailMetadataId) => {
  const response = await api.post(`/email/${emailMetadataId}/summarize/`);
  return response.data;
};

export const resummarizeEmail = async (emailMetadataId) => {
  const response = await api.post(`/email/${emailMetadataId}/resummarize/`);
  return response.data;
};
