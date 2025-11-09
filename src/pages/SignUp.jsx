import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import MailerLogo from "../assets/mailer-logo.svg";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";

function SignUp() {
  const navigate = useNavigate();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSignInClick = () => {
    navigate("/signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // 이메일 인증 코드 전송
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError(err.errors?.[0]?.message || "회원가입에 실패했습니다.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate("/"); // 회원가입 성공 시 메인 페이지로 이동
      } else {
        console.log("추가 단계 필요:", completeSignUp);
      }
    } catch (err) {
      console.error("인증 오류:", err);
      setError(err.errors?.[0]?.message || "인증에 실패했습니다.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <img
        src={MailerLogoHeader}
        alt="Mailer Header Logo"
        className="absolute top-8 left-8 w-28 h-6"
      />
      <div className="w-full max-w-xl p-8 sm:p-12 rounded-2xl shadow-lg bg-white">
        <div className="flex justify-center mb-6 sm:mb-8">
          <img src={MailerLogo} alt="Mailer Logo" className="w-48" />
        </div>

        <div className="flex justify-center space-x-2 mb-6 sm:mb-8">
          <button
            className="w-1/2 py-2 px-4 sm:py-3 rounded-xl border-2 text-base sm:text-lg border-primary-dark text-primary-dark hover:bg-[#A5BDE4]/20 transition-colors"
            onClick={handleSignInClick}
          >
            Sign IN
          </button>
          <button className="w-1/2 py-2 px-4 sm:py-3 rounded-xl border-2 text-base sm:text-lg text-white bg-primary-dark border-primary-dark">
            Sign Up
          </button>
        </div>

        {!pendingVerification ? (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 sm:py-4 border rounded-xl text-right placeholder-gray-400 border-primary-dark"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 sm:py-4 border rounded-xl placeholder-gray-400 border-primary-dark"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 sm:py-4 border rounded-xl placeholder-gray-400 border-primary-dark"
            />
            <button
              type="submit"
              disabled={!isLoaded}
              className="w-full mt-6 sm:mt-8 py-3 rounded-xl text-white text-lg sm:text-xl bg-primary-dark disabled:opacity-50"
            >
              sign up
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                이메일로 전송된 인증 코드를 입력하세요
              </p>
            </div>
            <input
              type="text"
              placeholder="인증 코드"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-3 sm:py-4 border rounded-xl placeholder-gray-400 border-primary-dark"
            />
            <button
              type="submit"
              disabled={!isLoaded}
              className="w-full mt-6 sm:mt-8 py-3 rounded-xl text-white text-lg sm:text-xl bg-primary-dark disabled:opacity-50"
            >
              인증 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignUp;
