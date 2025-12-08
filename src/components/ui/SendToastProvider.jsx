import React, { createContext, useContext, useState, useCallback } from "react";
import SendToast from "@/components/ui/SendToast";

const ToastContext = createContext();

export function useSendToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ open: false });

  const showToast = useCallback((options = {}) => {
    setToast({
      open: true,
      duration: options.duration || 5000, // 기본 지속 시간을 5초로 변경
      ...options,
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false })); // 닫기 버튼으로 Toast 닫기
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <SendToast
        open={toast.open}
        onClose={closeToast}
        duration={toast.duration} // 지속 시간 전달
      />
    </ToastContext.Provider>
  );
}
