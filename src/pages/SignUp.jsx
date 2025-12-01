import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import MailerLogo from "../assets/mailer-logo.svg";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import api from "../app/axios";

function SignUp() {
  const navigate = useNavigate();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [username, setUsername] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  // New state for verification
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const domains = [
    "gmail.com",
    "naver.com",
    "daum.net",
    "snu.ac.kr",
    "직접 입력",
  ];

  const handleSignInClick = () => {
    navigate("/signin");
  };

  const handleDomainSelect = (domain) => {
    if (domain === "직접 입력") {
      setIsDirectInput(true);
      setSelectedDomain("");
    } else {
      setIsDirectInput(false);
      setSelectedDomain(domain);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCodeSent) {
      await handleVerifyAndSignIn();
    } else {
      await handleSignUpAndSendCode();
    }
  };

  const handleSignUpAndSendCode = async () => {
    setError("");

    if (!isLoaded) {
      console.log("Clerk가 아직 로드되지 않았습니다.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const fullEmail = `${emailPrefix}@${selectedDomain}`;
    console.log("회원가입 시도:", fullEmail);

    try {
      await signUp.create({
        emailAddress: fullEmail,
        password,
        firstName: username, // firstName으로 저장
      });

      console.log("회원가입 성공, 인증 코드 전송 중...");
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setIsCodeSent(true);
      setError(""); // Clear previous errors
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError(err.errors?.[0]?.message || "회원가입에 실패했습니다.");
    }
  };

  const handleVerifyAndSignIn = async () => {
    setError("");

    if (!isLoaded || !signUp) {
      setError("회원가입 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        console.log("인증 성공, user_id 가져오는 중...");

        // 회원가입 성공 후 user_id 가져오기
        try {
          console.log("📞 /api/user/me/ 호출 중...");
          const userResponse = await api.get("/user/me/");
          console.log("📥 /api/user/me/ 응답:", userResponse.data);
          const userPk = userResponse.data.id;
          if (!userPk) {
            console.error("❌ id(pk)가 응답에 없습니다:", userResponse.data);
          } else {
            localStorage.setItem("user_id", userPk);
            console.log("✅ user_id(pk) 저장 완료:", userPk);
          }
        } catch (err) {
          console.error("❌ user_id 가져오기 실패:", err);
          console.error("에러 상세:", err.response?.data);
        }

        navigate("/"); // Navigate to main page on success
      } else {
        console.log("추가 단계 필요:", completeSignUp);
        setError("인증이 완료되지 않았습니다. 다시 시도해주세요.");
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
      <div className="w-[540px] min-h-[630px] p-8 sm:p-12 rounded-2xl shadow-lg bg-white">
        <div className="flex justify-center mt-8 mb-6 sm:mb-8">
          <img src={MailerLogo} alt="Mailer Logo" className="w-34 p-4" />
        </div>

        <div className="flex justify-center gap-7 mb-6 sm:mb-8">
          <button
            className="w-52 h-9 rounded-[20px] border-2 text-base sm:text-lg border-primary-dark text-primary-dark hover:bg-[#A5BDE4]/20 transition-colors"
            onClick={handleSignInClick}
          >
            Sign In
          </button>
          <button className="w-52 h-9 rounded-[20px] border-2 text-base sm:text-lg text-white bg-primary-dark border-primary-dark">
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-[444px] h-10 px-2 border rounded-lg placeholder-gray-500 border-primary-dark text-sm focus:outline-none"
            disabled={isCodeSent}
          />
          <div className="flex items-center gap-0 w-[444px]">
            <input
              type="text"
              placeholder=""
              value={emailPrefix}
              onChange={(e) => setEmailPrefix(e.target.value)}
              required
              className="flex-1 h-10 px-2 border border-r-0 rounded-l-lg placeholder-gray-500 border-primary-dark text-sm focus:outline-none"
              disabled={isCodeSent}
            />
            <span className="h-10 flex items-center border-t border-b border-primary-dark text-gray-500 bg-white">
              @
            </span>
            {isDirectInput ? (
              <div className="relative w-32">
                <input
                  type="text"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  placeholder="domain.com"
                  className="w-full h-10 pl-2 pr-6 border rounded-r-lg border-primary-dark placeholder-gray-500 text-sm focus:outline-none"
                  disabled={isCodeSent}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsDirectInput(false);
                    setSelectedDomain("gmail.com");
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  disabled={isCodeSent}
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative w-32" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-start w-full h-10 pl-2 border border-l-0 rounded-r-lg bg-white border-primary-dark text-gray-500"
                  disabled={isCodeSent}
                >
                  <span className="text-sm text-gray-500">
                    {selectedDomain}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ml-2 ${isDropdownOpen ? "transform rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-primary-dark rounded-lg shadow-lg">
                    <ul className="py-1 max-h-48 overflow-y-auto">
                      {domains.map((domain) => (
                        <li
                          key={domain}
                          onClick={() => handleDomainSelect(domain)}
                          className="pl-2 pr-8 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          {domain}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-[444px] h-10 px-4 border rounded-lg placeholder-gray-400 border-primary-dark focus:outline-none"
            disabled={isCodeSent}
          />
          <div className="relative w-[444px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password Confirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="w-full h-10 px-4 pr-10 border rounded-lg placeholder-gray-400 border-primary-dark focus:outline-none"
              disabled={isCodeSent}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          </div>

          {isCodeSent && (
            <div className="space-y-4 sm:space-y-5 pt-4">
              <p className="text-sm text-center text-gray-700">
                {`${emailPrefix}@${selectedDomain}`}으로 전송된 인증 코드를
                입력해주세요.
              </p>
              <input
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="w-[444px] h-10 px-4 border rounded-lg placeholder-gray-400 border-primary-dark focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!isLoaded}
            className="w-[444px] h-8 mt-2 sm:mt-2 mb-8 flex items-center justify-center rounded-xl text-white font-b2 bg-primary-dark disabled:opacity-50"
          >
            {isCodeSent ? "Verify and Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
