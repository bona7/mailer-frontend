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

export const addTemplateToMyTemplates = async (data) => {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  if (!userId) {
    throw new Error("user_id(pk)가 localStorage에 없습니다.");
  }

  console.log("addTemplateToMyTemplates 호출:", {
    userId,
    data,
    requestBody: data,
  });

  const response = await api.post(`/template/viewtemplate/${userId}/`, data);
  console.log("addTemplateToMyTemplates 응답:", response.data);
  return response.data;
};
