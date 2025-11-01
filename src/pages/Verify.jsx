import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import DomainDropdown from "../components/domain_dropdown";
import Dropdown from "@/components/Dropdown";

function Verify() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [emailPrefix, setEmailPrefix] = useState("");
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
    "금융/투자",
    "학문/연구/교육",
    "취업/커리어",
    "쇼핑/패션/뷰티",
    "게임/애니메이션",
    "영화/드라마/콘텐츠",
    "음악/공연",
    "여행/항공/호텔",
    "음식/외식",
    "스포츠/건강/피트니스",
    "자동차/모빌리티",
    "부동산/주거",
    "사회/정치/경제 뉴스",
    "기타 (직접 입력)",
  ];

  const handleVerify = () => {
    setIsVerified(true);
  };

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

  // 계정 인증 완료되어야지 넘어가도록 수정
  const handleAccountAdd = () => {
    navigate("/accountadded");
  };

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

        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={emailPrefix + "@"}
              onChange={handleEmailPrefixChange}
              placeholder="email@"
              className="w-full px-4 py-3 sm:py-3 border rounded-xl text-right placeholder-gray-bf border-primary-dark h-11"
            />
            {isDirectInput ? (
              <div className="relative w-36">
                <input
                  type="text"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  placeholder="domain.com"
                  className="w-full px-4 py-3 sm:py-3 border rounded-xl border-primary-dark pr-8 h-11"
                />
                <button
                  type="button"
                  onClick={() => setIsDirectInput(false)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
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
              />
            )}
          </div>
          <input
            type="text"
            placeholder="two-factor verification code"
            className="w-full px-4 py-3 sm:py-3 border rounded-xl placeholder-gray-bf placeholder:font-b1 border-primary-dark h-11"
          />
        </div>

        <div className="text-right mt-1.5">
          <a href="#" className="font-b2 text-primary hover:underline">
            Go to get your code
          </a>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleVerify}
            className="mt-4 sm:mt-4 py-1.5 px-6 rounded-xl text-gray-fa font-b1 bg-primary-dark"
          >
            Verified
          </button>
        </div>

        {isVerified && (
          <>
            <div className="mt-5 px-8 -mx-44 sm:-mx-44">
              <h1 className="font-h7 text-primary-dark mb-2 text-left">
                On board Info
              </h1>
            </div>

            <div className="flex flex-col gap-1">
              <Dropdown title="직업" required={true} options={jobOptions} />
              <Dropdown
                title="계정 목적"
                required={true}
                options={purposeOptions}
              />
              <Dropdown
                title="관심사"
                required={false}
                options={interestOptions}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Verify;
