import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MailerLogoHeader from "../assets/mailer-logo-header.svg";
import {
  useAddAccount,
  useUpdateAccountProfile,
  useSyncAccount,
} from "@/api/hooks/useAccounts";
import Dropdown from "@/components/Dropdown";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/app/axios";

function AddAccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [error, setError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const addAccountMutation = useAddAccount();
  const updateProfileMutation = useUpdateAccountProfile();
  const syncAccountMutation = useSyncAccount();

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
    setIsConnecting(true);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      setIsConnecting(false);
      return;
    }

    if (!selectedJob || !selectedPurpose) {
      setError("직업과 계정 목적을 선택해주세요.");
      setIsConnecting(false);
      return;
    }

    try {
      // 1단계: 계정 생성 (email, password만 전송)
      const accountData = {
        address: email,
        password: password,
      };

      console.log("계정 추가 요청:", accountData);
      const createdAccount = await addAccountMutation.mutateAsync(accountData);
      console.log("계정 생성 완료:", createdAccount);
      console.log("createdAccount.id:", createdAccount?.id);

      let accountId = createdAccount?.id;

      // ID가 없으면 계정 목록을 다시 조회해서 방금 추가된 계정 찾기
      if (!accountId) {
        console.warn("⚠️ 응답에 ID가 없음. 계정 목록에서 검색 중...");

        // React Query 캐시를 무효화하고 최신 계정 목록 가져오기
        const { data: accounts } = await queryClient.fetchQuery({
          queryKey: ["accounts"],
          queryFn: async () => {
            const response = await api.get("/account/");
            return response;
          },
        });

        console.log("조회된 계정 목록:", accounts);

        // 방금 추가한 이메일 주소로 계정 찾기
        const foundAccount = accounts?.find((acc) => acc.address === email);
        console.log("찾은 계정:", foundAccount);

        if (foundAccount?.id) {
          accountId = foundAccount.id;
          console.log("✅ 계정 ID 찾음:", accountId);
        } else {
          throw new Error(
            "계정 생성에는 성공했지만 계정 ID를 받지 못했습니다. 백엔드 확인 필요.",
          );
        }
      }

      // 2단계: 프로필 업데이트 (job, usage, interests)
      const profileData = {
        job: selectedJob,
        usage: selectedPurpose,
      };

      // 관심사가 선택되었다면 추가 (배열로 전달)
      if (selectedInterest) {
        profileData.interests = [selectedInterest];
      }

      console.log("프로필 업데이트 요청 - 계정 ID:", accountId);
      console.log("프로필 데이터:", profileData);
      await updateProfileMutation.mutateAsync({
        accountId: accountId,
        profileData: profileData,
      });
      console.log("프로필 업데이트 완료");

      // 3단계: 메일 동기화
      console.log("메일 동기화 시작 - 계정 ID:", accountId);
      await syncAccountMutation.mutateAsync(accountId);
      console.log("메일 동기화 완료");

      // 완료 후 이동
      navigate("/accountadded");
    } catch (err) {
      console.error("계정 연동 에러:", err);
      console.error("에러 응답 전체:", err.response);
      console.error("에러 응답 데이터:", err.response?.data);
      console.error("에러 상태 코드:", err.response?.status);

      // address 필드 에러 확인
      if (err.response?.data?.address) {
        console.error("address 필드 에러:", err.response.data.address);
      }

      if (err.response?.status === 400) {
        // 백엔드에서 반환한 구체적인 에러 메시지 추출
        const addressError = err.response?.data?.address?.[0];
        const passwordError = err.response?.data?.password?.[0];
        const errorDetail = err.response?.data?.detail;

        let errorMsg = "입력 정보를 확인해주세요.";
        if (addressError) {
          errorMsg = `이메일: ${addressError}`;
        } else if (passwordError) {
          errorMsg = `비밀번호: ${passwordError}`;
        } else if (errorDetail) {
          errorMsg = errorDetail;
        }

        setError(errorMsg);
      } else if (err.response?.status === 409) {
        setError("이미 연동된 계정입니다.");
      } else {
        setError(
          "계정 연동 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    } finally {
      setIsConnecting(false);
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
              disabled={isConnecting}
              className={`py-2 px-8 rounded-xl font-b1 ${
                isConnecting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-primary-dark hover:bg-gray-300"
              }`}
            >
              취소
            </button>
            <button
              onClick={handleConnect}
              disabled={!isFormValid || isConnecting}
              className={`py-2 px-8 rounded-xl text-gray-fa font-b1 flex items-center gap-2 ${
                isFormValid && !isConnecting
                  ? "bg-primary-dark hover:bg-primary cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isConnecting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isConnecting ? "연동 중..." : "연동하기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddAccountPage;
