import { createContext, useContext, useState, useMemo } from "react";

// 1. 컨텍스트 생성
const AISummaryContext = createContext();

// 2. 컨텍스트를 사용하기 위한 Provider 컴포넌트 생성
export const AISummaryProvider = ({ children }) => {
  const [aiSumSelectedId, setAiSumSelectedId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false); // 로딩 상태 추가

  // useMemo를 사용해 매번 새로운 객체가 생성되는 것을 방지 (성능 최적화)
  const value = useMemo(
    () => ({
      aiSumSelectedId,
      setAiSumSelectedId,
      selectedEmail,
      setSelectedEmail,
      isSummaryLoading, // 로딩 상태와
      setIsSummaryLoading, // 세터를 value에 추가
    }),
    [aiSumSelectedId, selectedEmail, isSummaryLoading],
  );

  return (
    <AISummaryContext.Provider value={value}>
      {children}
    </AISummaryContext.Provider>
  );
};

// 3. 컨텍스트를 쉽게 사용하기 위한 커스텀 훅
export const useAISummary = () => {
  const context = useContext(AISummaryContext);
  if (context === undefined) {
    throw new Error("useAISummary must be used within a AISummaryProvider");
  }
  return context;
};
