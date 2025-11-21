import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import { useAddAccount } from "@/api/hooks/useAccounts";
import Dropdown from "@/components/Dropdown";

function AddAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [error, setError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const addAccountMutation = useAddAccount();

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

  // Confirm 버튼 클릭 시 온보딩 섹션 표시
  const handleConfirm = () => {
    if (email && password) {
      setShowOnboarding(true);
      setError("");
    } else {
      setError("이메일과 비밀번호를 입력해주세요.");
    }
  };

  const handleConnect = async () => {
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!selectedJob || !selectedPurpose) {
      setError("직업과 계정 목적을 선택해주세요.");
      return;
    }

    try {
      await addAccountMutation.mutateAsync({
        address: email,
        password: password,
      });
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

  const handleCancel = () => {
    navigate("/");
  };

  const isBasicInfoValid = email && password;
  const isOnboardingValid = selectedJob && selectedPurpose;
  const isFormValid = isBasicInfoValid && isOnboardingValid;

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
              disabled={showOnboarding}
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
              disabled={showOnboarding}
            />
          </div>
        </div>

        {!showOnboarding && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="py-2 px-8 rounded-xl text-primary-dark font-b1 bg-gray-200 hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isBasicInfoValid}
              className={`py-2 px-8 rounded-xl text-gray-fa font-b1 ${
                isBasicInfoValid
                  ? "bg-primary-dark hover:bg-primary cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm
            </button>
          </div>
        )}

        {showOnboarding && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="font-h7 text-primary-dark mb-4 text-left">
              온보딩 정보
            </h2>
            <div className="flex flex-col gap-2">
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
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}

        {showOnboarding && (
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
        )}
      </div>
    </div>
  );
}

export default AddAccountPage;
