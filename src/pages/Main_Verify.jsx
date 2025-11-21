import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import DomainDropdown from "../components/domain_dropdown";
import Dropdown from "@/components/Dropdown";

function MainVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [emailPrefix, setEmailPrefix] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");

  const jobOptions = [
    "중/고등학생",
    "대학(학부)생",
    "대학원생",
    "일반 사무직",
    "개발자/엔지니어",
    "기획/마케팅",
    "디자이너",
    "프리랜서",
    "연구원/공공기관",
    "기타(직접입력)",
  ];
  const purposeOptions = [
    "학업/학교 (강의, 과제, 공지)",
    "업무/회사 (업무 메일, 프로젝트 협업)",
    "개인 (친구/가족, 커뮤니케이션)",
    "쇼핑/구매",
    "금융 (은행, 카드, 보험 등)",
    "구직/경력 관리 (채용공고, 이력서, 네트워킹)",
    "커뮤니티 가입/서비스 로그인",
    "뉴스/구독형 콘텐츠",
    "이벤트/프로모션 전용",
    "기타(직접입력)",
  ];
  const interestOptions = [
    "IT/테크",
    "창업",
    "금융/투자",
    "학문//교육",
    "취업/커리어",
    "쇼핑/패션/뷰티",
    "게임/애니메이션",
    "영화/드라마/콘텐츠",
    "음악/공연",
    "여행/항공/호텔",
    "음식/외식",
    "스포츠/건강",
    "자동차/모빌리티",
    "부동산/주거",
    "사회/정치/경제 뉴스",
    "기타 (직접 입력)",
  ];

  useEffect(() => {
    // SignUp 페이지에서 전달받은 이메일 정보로 초기화
    if (location.state?.email) {
      const [prefix, domain] = location.state.email.split("@");
      setEmailPrefix(prefix);
      setSelectedDomain(domain);
    }
  }, [location]);

  const handleDomainSelect = (domain) => {
    if (domain === "직접 입력") {
      setIsDirectInput(true);
      setSelectedDomain("");
    } else {
      setIsDirectInput(false);
      setSelectedDomain(domain);
    }
  };

  const handleEmailPrefixChange = (e) => {
    const value = e.target.value;
    // @를 제거하고 앞부분만 저장
    const prefix = value.replace("@", "");
    setEmailPrefix(prefix);
  };

  const handleVerify = async () => {
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
        setIsVerified(true);
        setError("");
      } else {
        console.log("추가 단계 필요:", completeSignUp);
      }
    } catch (err) {
      console.error("인증 오류:", err);
      setError(err.errors?.[0]?.message || "인증에 실패했습니다.");
    }
  };

  const handleAccountAdd = () => {
    navigate("/accountadded");
  };

  // 필수 항목이 모두 선택되었는지 확인
  const isFormValid = selectedJob && selectedPurpose;

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <img
        src={MailerLogoHeader}
        alt="Mailer Header Logo"
        className="absolute top-8 left-8 w-28 h-6"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="w-full max-w-4xl pt-8 pb-8 pr-48 pl-48 sm:pt-12 sm:pb-12 sm:pr-48 sm:pl-48 rounded-xl shadow-lg bg-white min-h-[580px]">
        <div className="px-8 -mx-44 sm:-mx-44">
          <h1 className="font-h7 text-primary-dark mb-8 text-left">
            Verification Code
          </h1>
        </div>

        <div className="flex flex-col gap-1">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg mb-1">
              {error}
            </div>
          )}
          <div className="w-full">
            <label className="block mb-1 ml-2 font-b2 text-gray-8c">
              Email
            </label>
            <div className="flex items-center space-x-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  placeholder="email"
                  className="w-full px-4 py-3 sm:py-3 pr-8 border rounded-xl placeholder-gray-bf border-primary-dark h-10"
                  disabled={isVerified}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-8c">
                  @
                </span>
              </div>
              {isDirectInput ? (
                <div className="relative w-36">
                  <input
                    type="text"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    placeholder="domain.com"
                    className="w-full px-4 py-3 sm:py-3 border rounded-xl border-primary-dark pr-8 h-10"
                    disabled={isVerified}
                  />
                  <button
                    type="button"
                    onClick={() => setIsDirectInput(false)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    disabled={isVerified}
                  >
                    <svg
                      className={`w-4 h-4 text-gray-500`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                <DomainDropdown
                  selectedDomain={selectedDomain}
                  onDomainChange={handleDomainSelect}
                  disabled={isVerified}
                />
              )}
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-1 ml-2 font-b2 text-gray-8c">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="인증 코드"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-3 sm:py-3 border rounded-xl placeholder-gray-bf placeholder:font-b1 border-primary-dark h-10"
              disabled={isVerified}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleVerify}
            disabled={!isLoaded || isVerified}
            className="py-1.5 px-6 rounded-xl text-gray-fa font-b1 bg-primary-dark disabled:opacity-50 hover:bg-primary cursor-pointer"
          >
            인증 확인
          </button>
        </div>

        {isVerified && (
          <>
            <div className="mt-8 mb-4">
              <h2 className="font-h7 text-primary-dark text-left">
                On board Info
              </h2>
            </div>
            <div className="flex flex-col gap-1">
              <Dropdown
                title="직업"
                required={true}
                options={jobOptions}
                selectedOption={selectedJob}
                onOptionChange={setSelectedJob}
              />
              <Dropdown
                title="계정 목적"
                required={true}
                options={purposeOptions}
                selectedOption={selectedPurpose}
                onOptionChange={setSelectedPurpose}
              />
              <Dropdown
                title="관심사"
                required={false}
                options={interestOptions}
                selectedOption={selectedInterest}
                onOptionChange={setSelectedInterest}
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAccountAdd}
                disabled={!isFormValid}
                className={`py-1.5 px-6 rounded-xl text-gray-fa font-b1 ${
                  isFormValid
                    ? "bg-primary-dark hover:bg-primary cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MainVerify;
