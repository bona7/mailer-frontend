import { useMutation, useQueryClient } from "@tanstack/react-query";
import { summarizeEmail, resummarizeEmail } from "../summary";

export const useSummarizeEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: summarizeEmail,
    onSuccess: (data, variables) => {
      // 요약된 특정 이메일의 상세 쿼리를 무효화하여 최신 요약 정보를 가져오도록 하기
      queryClient.invalidateQueries({ queryKey: ["email", { id: variables }] });
      // 이메일 목록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: (error) => {
      console.error("Failed to summarize email:", error);
      // 에러 처리 로직 추가 (예: 토스트 메시지 표시)
    },
  });
};

export const useResummarizeEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resummarizeEmail,
    onSuccess: (data, variables) => {
      // 다시 요약된 특정 이메일의 상세 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["email", { id: variables }] });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: (error) => {
      console.error("Failed to resummarize email:", error);
      // 에러 처리 로직 추가
    },
  });
};
