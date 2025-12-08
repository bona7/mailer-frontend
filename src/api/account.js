import api from "../app/axios";

export const getAccounts = async () => {
  const response = await api.get("/account/");
  return response.data;
};

export const addAccount = async (accountData) => {
  const response = await api.post("/account/", accountData);
  return response.data;
};

export const deleteAccount = async (accountId) => {
  const response = await api.delete(`/account/${accountId}/`);
  return response.data;
};

export const syncAccount = async (accountId) => {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  if (!userId) {
    throw new Error("user_id(pk)가 localStorage에 없습니다.");
  }

  const response = await api.post(`/account/${accountId}/sync/`, {
    user_id: userId,
  });
  return response.data;
};

export const updateAccountProfile = async (accountId, profileData) => {
  const response = await api.patch(
    `/account/${accountId}/profile/`,
    profileData,
  );
  return response.data;
};
