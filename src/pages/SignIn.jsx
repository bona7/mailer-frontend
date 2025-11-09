import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import MailerLogo from "../assets/mailer-logo.svg";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";

function SignIn() {
  const navigate = useNavigate();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/"); // 로그인 성공 시 메인 페이지로 이동
      } else {
        console.log("추가 인증 필요:", result);
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError(err.errors?.[0]?.message || "로그인에 실패했습니다.");
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
          <button className="w-1/2 py-2 px-4 sm:py-3 rounded-xl border-2 text-base sm:text-lg text-white bg-primary-dark border-primary-dark">
            Sign IN
          </button>
          <button
            className="w-1/2 py-2 px-4 sm:py-3 rounded-xl border-2 text-base sm:text-lg border-primary-dark text-primary-dark hover:bg-[#A5BDE4]/20 transition-colors"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>

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
        </form>

        <button
          onClick={handleSubmit}
          disabled={!isLoaded}
          className="w-full mt-6 sm:mt-8 py-3 rounded-xl text-white text-lg sm:text-xl bg-primary-dark disabled:opacity-50"
        >
          sign in
        </button>
      </div>
    </div>
  );
}

export default SignIn;
