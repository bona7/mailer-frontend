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
