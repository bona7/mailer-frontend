import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccounts,
  addAccount,
  deleteAccount,
  syncAccount,
  updateAccountProfile,
} from "../account";

export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      // 계정 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
};

export const useSyncAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId) => syncAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useUpdateAccountProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, profileData }) =>
      updateAccountProfile(accountId, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
