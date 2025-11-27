import React, { createContext, useContext, useState, useCallback } from "react";
import SendToast from "@/components/ui/SendToast";

const ToastContext = createContext();

export function useSendToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ open: false, duration: 10000 });

  const showToast = useCallback((options = {}) => {
    setToast({
      open: true,
      duration: options.duration || 10000,
      ...options,
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <SendToast
        open={toast.open}
        onClose={closeToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
}
