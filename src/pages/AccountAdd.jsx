import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import { useAddAccount } from "@/api/hooks/useAccounts";

function AddAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const addAccountMutation = useAddAccount();

  const handleConnect = async () => {
    setError(""); // Reset error message
    if (!email || !password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await addAccountMutation.mutateAsync({
        address: email,
        password: password,
      });
      navigate("/"); // Redirect to main page on success
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          "입력 정보를 확인해주세요. 이메일 또는 비밀번호가 올바르지 않습니다.",
        );
      } else if (err.response?.status === 409) {
        setError("이미 연동된 계정입니다.");
      } else {
        setError(
          "계정 연동 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    }
  };

  const handleCancel = () => {
    navigate("/"); // Go back to the main page
  };

  const isFormValid = email && password;

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <img
        src={MailerLogoHeader}
        alt="Mailer Header Logo"
        className="absolute top-8 left-8 w-28 h-6 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
        <h1 className="font-h7 text-primary-dark mb-6 text-center">
          이메일 계정 연동
        </h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 주소
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-3 border rounded-xl placeholder-gray-bf border-primary-dark h-11"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-xl placeholder-gray-bf border-primary-dark h-11"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleCancel}
            className="py-2 px-8 rounded-xl text-primary-dark font-b1 bg-gray-200 hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleConnect}
            disabled={!isFormValid || addAccountMutation.isPending}
            className={`py-2 px-8 rounded-xl text-gray-fa font-b1 ${
              isFormValid && !addAccountMutation.isPending
                ? "bg-primary-dark hover:bg-primary cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {addAccountMutation.isPending ? "연동 중..." : "연동하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAccountPage;
