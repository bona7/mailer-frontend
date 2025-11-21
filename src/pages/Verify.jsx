import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import DomainDropdown from "../components/domain_dropdown";
import Dropdown from "@/components/Dropdown";
import { useAddAccount } from "@/api/hooks/useAccounts";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const addAccountMutation = useAddAccount();
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [emailPrefix, setEmailPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [error, setError] = useState("");
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

  useEffect(() => {
    // AccountAdd 페이지에서 전달받은 이메일과 비밀번호로 초기화
    if (location.state?.email) {
      const [prefix, domain] = location.state.email.split("@");
      setEmailPrefix(prefix);
      setSelectedDomain(domain);
    }
    if (location.state?.password) {
      setPassword(location.state.password);
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

  // 계정 추가 API 호출 후 완료 페이지로 이동
  const handleAccountAdd = async () => {
    setError("");

    const fullEmail = `${emailPrefix}@${selectedDomain}`;

    try {
      // 계정 추가 API 호출
      await addAccountMutation.mutateAsync({
        address: fullEmail,
        password: password,
      });

      // 성공 시 완료 페이지로 이동
      navigate("/accountadded");
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
            On board Info
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
        </div>

        <div className="flex flex-col gap-1 mt-4">
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

        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleAccountAdd}
            disabled={!isFormValid || addAccountMutation.isPending}
            className={`py-1.5 px-6 rounded-xl text-gray-fa font-b1 ${
              isFormValid && !addAccountMutation.isPending
                ? "bg-primary-dark hover:bg-primary cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {addAccountMutation.isPending ? "연동 중..." : "완료"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verify;
