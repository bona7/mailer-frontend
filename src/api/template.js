import axios from "../app/axios";

export const getViewTemplates = async () => {
  const response = await axios.get("/template/viewtemplate/");
  return response.data;
};

export const getViewTemplateById = async (id) => {
  const response = await axios.get(`/template/viewtemplate/${id}/`);
  return response.data;
};

export const getMyTemplates = async (userId) => {
  const response = await axios.get(`/template/mytemplate/list/${userId}/`); // Corrected to use path parameter
  return response.data;
};

export const createTemplate = async (templateData) => {
  const response = await axios.post(
    "/template/mytemplate/create/",
    templateData,
  );
  return response.data;
};

export const addTemplateToMyTemplates = async (templateId, data) => {
  const response = await axios.post(
    `/template/viewtemplate/${templateId}/`,
    data,
  );
  return response.data;
};

export const deleteMyTemplate = async (templateId) => {
  const response = await axios.delete(`/template/mytemplate/${templateId}/`);
  return response.data;
};
