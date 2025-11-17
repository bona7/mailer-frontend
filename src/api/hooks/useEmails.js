import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmails,
  getEmailDetail,
  updateEmailMetadata,
  deleteEmail,
} from "../email";

export const useEmails = (params = {}) => {
  return useQuery({
    queryKey: ["emails", params],
    queryFn: () => getEmails(params),
  });
};

export const useEmailDetail = (emailMetadataId) => {
  return useQuery({
    queryKey: ["email", emailMetadataId],
    queryFn: () => getEmailDetail(emailMetadataId),
    enabled: !!emailMetadataId,
  });
};

export const useUpdateEmailMetadata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ emailMetadataId, data }) =>
      updateEmailMetadata(emailMetadataId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
  });
};

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
};
