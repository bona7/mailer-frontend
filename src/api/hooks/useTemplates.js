import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getViewTemplates,
  getViewTemplateById,
  getMyTemplates,
  addTemplateToMyTemplates,
  deleteMyTemplate,
} from "../template";

export const useViewTemplates = () => {
  return useQuery({
    queryKey: ["viewTemplates"],
    queryFn: getViewTemplates,
  });
};

export const useViewTemplateById = (id) => {
  return useQuery({
    queryKey: ["viewTemplate", id],
    queryFn: () => getViewTemplateById(id),
    enabled: !!id,
  });
};

export const useMyTemplates = (userId) => {
  return useQuery({
    queryKey: ["myTemplates", userId],
    queryFn: () => getMyTemplates(userId),
    enabled: !!userId,
  });
};

export const useAddTemplateToMyTemplates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, templateId, accountIds }) =>
      addTemplateToMyTemplates(userId, {
        template_id: templateId,
        email_account_ids: accountIds,
      }),
    onSuccess: (data, variables) => {
      // 내 템플릿 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ["myTemplates", variables.userId],
      });
    },
  });
};

export const useDeleteMyTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMyTemplate, // templateId를 직접 받음
    onSuccess: (data, templateId) => {
      // 'myTemplates' 관련 모든 쿼리를 무효화하여 전체 목록을 새로고침
      queryClient.invalidateQueries({ queryKey: ["myTemplates"] });
    },
  });
};
