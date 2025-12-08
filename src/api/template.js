import api from "../app/axios";

export const getViewTemplates = async () => {
  const response = await api.get("/template/viewtemplate/");
  return response.data;
};

export const getViewTemplateById = async (id) => {
  const response = await api.get(`/template/viewtemplate/${id}/`);
  return response.data;
};

export const getMyTemplates = async (userId) => {
  const response = await api.get(`/template/mytemplate/list/${userId}/`);
  return response.data;
};

export const addTemplateToMyTemplates = async (templateId, data) => {
  if (!templateId) {
    throw new Error("templateId가 제공되지 않았습니다.");
  }

  console.log("addTemplateToMyTemplates 호출:", {
    templateId,
    requestBody: data,
  });

  const response = await api.post(
    `/template/viewtemplate/${templateId}/`,
    data,
  );
  console.log("addTemplateToMyTemplates 응답:", response.data);
  return response.data;
};

export const deleteMyTemplate = async (templateId) => {
  if (!templateId) {
    throw new Error("templateId가 제공되지 않았습니다.");
  }
  const response = await api.delete(`/template/mytemplate/${templateId}/`);
  return response.data;
};
