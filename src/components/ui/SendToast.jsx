import React, { useEffect } from "react";

function SendToast({ message, open, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed z-[9999] flex items-center px-6 py-4 rounded-xl shadow-lg bg-secondary text-secondary-light min-w-[220px] font-st2 animate-fadein"
      style={{
        left: 100,
        bottom: 60,
        position: "fixed",
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
      }}
    >
      <span className="mr-4 text-secondary-light">메시지 전송됨</span>
      <a
        href="#"
        className="underline text-secondary-light font-medium hover:text-secondary-dark"
        onClick={onClose}
      >
        메일 보기
      </a>
      <button
        className="ml-4 text-secondary-light hover:text-secondary-dark text-lg font-bold"
        onClick={onClose}
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
}

export default SendToast;
