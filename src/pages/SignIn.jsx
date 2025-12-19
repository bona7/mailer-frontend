import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import MailerLogo from "../assets/mailer-logo.svg";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import api from "../app/axios";

function SignIn() {
  const navigate = useNavigate();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailPrefix, setEmailPrefix] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const domains = [
    "gmail.com",
    "naver.com",
    "daum.net",
    "snu.ac.kr",
    "직접 입력",
  ];

  const handleSignUpClick = () => {
    navigate("/signup");
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
      return;
    }

    setIsLoading(true);
    setError("");

    // 전체 이메일 주소 생성
    const fullEmail = `${emailPrefix}@${selectedDomain}`;

    try {
      const result = await signIn.create({
        identifier: fullEmail,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // 로그인 성공 후 user_id 가져오기
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

        navigate("/"); // 로그인 성공 시 메인 페이지로 이동
      } else {
        console.log("추가 인증 필요:", result);
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError(err.errors?.[0]?.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <img
        src={MailerLogoHeader}
        alt="Mailer Header Logo"
        className="absolute top-8 left-8 w-28 h-6"
      />
      <div className="w-[540px] h-[528px] p-8 sm:p-12 rounded-2xl shadow-lg bg-white">
        <div className="flex justify-center mt-8 mb-6 sm:mb-8">
          <img src={MailerLogo} alt="Mailer Logo" className="w-34 p-4" />
        </div>

        <div className="flex justify-center gap-7 mb-6 sm:mb-8">
          <button className="w-52 h-9 rounded-[20px] border-2 text-base sm:text-lg text-white bg-primary-dark border-primary-dark">
            Sign In
          </button>
          <button
            className="w-52 h-9 rounded-[20px] border-2 text-base sm:text-lg border-primary-dark text-primary-dark hover:bg-[#A5BDE4]/20 transition-colors"
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-[444px] h-10 px-4 border rounded-lg placeholder-gray-400 border-primary-dark"
          />
          <button
            type="submit"
            disabled={!isLoaded || isLoading}
            className={`w-[444px] h-8 mt-2 sm:mt-2 flex items-center justify-center rounded-xl text-white font-b2 bg-primary-dark disabled:opacity-50 ${
              isLoading ? "bg-primary-dark/50" : ""
            }`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
