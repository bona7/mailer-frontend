import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccounts,
  addAccount,
  deleteAccount,
  syncAccount,
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
