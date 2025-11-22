import api from "../app/axios";

export const getAccounts = async () => {
  console.log("getAccounts API 호출");
  const response = await api.get("/account/");
  console.log("getAccounts 응답:", response);
  console.log("getAccounts response.data:", response.data);
  console.log("getAccounts response.data 타입:", typeof response.data);
  console.log("getAccounts Array.isArray:", Array.isArray(response.data));
  return response.data;
};

export const addAccount = async (accountData) => {
  console.log("addAccount API 호출 - 요청 데이터:", accountData);
  const response = await api.post("/account/", accountData);
  console.log("addAccount API 응답 - response:", response);
  console.log("addAccount API 응답 - response.data:", response.data);
  console.log(
    "addAccount API 응답 - response.data 타입:",
    typeof response.data,
  );
  console.log("addAccount API 응답 - response.data.id:", response.data?.id);
  return response.data;
};

export const deleteAccount = async (accountId) => {
  const response = await api.delete(`/account/${accountId}/`);
  return response.data;
};

export const syncAccount = async (accountId) => {
  const response = await api.post(`/account/${accountId}/sync/`);
  return response.data;
};

export const updateAccountProfile = async (accountId, profileData) => {
  const response = await api.patch(
    `/account/${accountId}/profile/`,
    profileData,
  );
  return response.data;
};
