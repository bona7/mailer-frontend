import React, { useEffect } from "react";

function SendToast({ message, open, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration); // duration 값 사용
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <div
      className="fixed z-[9999] flex items-center pr-7 pl-6 py-[14px] rounded-lg shadow-lg bg-primary text-gray-fa font-st2 animate-fadein"
      style={{
        left: 64,
        bottom: 40,
        position: "fixed",
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
      }}
    >
      <span className="pr-[68px] text-gray-fa">메시지 전송됨</span>
      <a
        href="#"
        className="underline text-gray-fa font-medium hover:text-primary-dark"
        onClick={onClose}
      >
        메일 보기
      </a>
      <button
        className="ml-3 text-gray-fa hover:text-primary-dark text-lg font-medium"
        onClick={onClose}
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
}

export default SendToast;
