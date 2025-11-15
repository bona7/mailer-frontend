import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import MailerLogo from "../assets/mailer-logo.svg";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";

function SignUp() {
  const navigate = useNavigate();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [emailPrefix, setEmailPrefix] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

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

    if (!isLoaded) {
      console.log("Clerk가 아직 로드되지 않았습니다.");
      return;
    }

    // 비밀번호 확인 검증
    if (password !== passwordConfirmation) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 전체 이메일 주소 생성
    const fullEmail = `${emailPrefix}@${selectedDomain}`;
    console.log("회원가입 시도:", fullEmail);

    try {
      await signUp.create({
        emailAddress: fullEmail,
        password,
      });

      console.log("회원가입 성공, 인증 코드 전송 중...");

      // 이메일 인증 코드 전송
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      console.log("MainVerify 페이지로 이동...");
      // MainVerify 페이지로 이동
      navigate("/mainverify", { state: { email: fullEmail } });
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError(err.errors?.[0]?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <img
        src={MailerLogoHeader}
        alt="Mailer Header Logo"
        className="absolute top-8 left-8 w-28 h-6"
      />
      <div className="w-[540px] h-[580px] p-8 sm:p-12 rounded-2xl shadow-lg bg-white">
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
          <div className="flex items-center gap-0 w-[444px]">
            <input
              type="text"
              placeholder=""
              value={emailPrefix}
              onChange={(e) => setEmailPrefix(e.target.value)}
              required
              className="flex-1 h-10 px-2 border border-r-0 rounded-l-lg placeholder-gray-500 border-primary-dark text-sm focus:outline-none"
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
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsDirectInput(false);
                    setSelectedDomain("gmail.com");
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
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
          />
          <div className="relative w-[444px]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password Confirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="w-full h-10 px-4 pr-10 border rounded-lg placeholder-gray-400 border-primary-dark focus:outline-none"
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
          <button
            type="submit"
            disabled={!isLoaded}
            className="w-[444px] h-8 mt-2 sm:mt-2 flex items-center justify-center rounded-xl text-white font-b2 bg-primary-dark disabled:opacity-50"
          >
            sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
