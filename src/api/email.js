import api from "../app/axios";

export const getEmails = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.accounts) {
    queryParams.append("accounts", params.accounts);
  }
  if (params.folder) {
    queryParams.append("folder", params.folder);
  }
  if (params.query) {
    queryParams.append("query", params.query);
  }

  const url = `/email/${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  const response = await api.get(url);
  return response.data;
};

export const getEmailDetail = async (emailMetadataId) => {
  const response = await api.get(`/email/${emailMetadataId}/`);
  return response.data;
};

export const updateEmailMetadata = async (emailMetadataId, data) => {
  const response = await api.patch(`/metadata/${emailMetadataId}/`, data);
  return response.data;
};

export const deleteEmail = async (emailMetadataId) => {
  const response = await api.delete(`/metadata/${emailMetadataId}/`);
  return response.data;
};
