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
  console.log("addTemplateToMyTemplates 호출:", {
    templateId,
    data,
    requestBody: data,
    queryParams: { user_id: data.user_id },
  });

  const config = {
    params: {
      user_id: data.user_id,
    },
  };

  console.log("axios config:", config);

  const response = await api.post(
    `/template/viewtemplate/${templateId}/`,
    data,
    config,
  );
  console.log("addTemplateToMyTemplates 응답:", response.data);
  return response.data;
};
