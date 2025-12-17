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
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["email", emailMetadataId],
    queryFn: () => getEmailDetail(emailMetadataId),
    enabled: !!emailMetadataId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          console.log("🔍 checking queryKey:", query.queryKey);
          const match =
            Array.isArray(query.queryKey) && query.queryKey[0] === "emails";

          if (match) {
            console.log("🧨 invalidated query:", query.queryKey);
          }

          return match;
        },
        // Array.isArray(query.queryKey) && query.queryKey[0] === "emails",
      });
    },
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
