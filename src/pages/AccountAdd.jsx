import React from "react";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";

// Checkmark SVG component for success animation
const CheckmarkIcon = () => (
  <svg
    className="w-24 h-24 text-green-500 animate-pop-in"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

function AccountAdded() {
  //const handleMainPageClick 메인 페이지로 이동하는 핸들러

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-primary-light/35 p-4">
      <img
        src={MailerLogoHeader}
        alt="Mailer Header Logo"
        className="absolute top-8 left-8 w-32"
      />

      <div className="w-full max-w-xl p-8 sm:p-12 rounded-2xl shadow-lg bg-white text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <CheckmarkIcon />
        </div>

        <div className="animate-fade-in-delay">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Account Added!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Your account has been successfully added to your mailbox.
          </p>
          <button
            // 메인페이지로 이동하는 핸들러 추가
            className="w-full max-w-xs mx-auto py-3 rounded-xl text-white text-lg sm:text-xl bg-primary-dark hover:bg-primary-dark/90 transition-colors"
          >
            Go to Mailbox
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountAdded;
