import { useState, useMemo } from "react";
import { Refresh } from "@/assets";
import { MailList, AppLayout } from "@/components";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEmails } from "@/api/hooks/useEmails";
import { useSyncAccount, useAccounts } from "@/api/hooks/useAccounts";

const MainPage = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  console.log("selected Accounts (mainPage):", selectedAccounts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  const { data: accounts = [] } = useAccounts();
  const syncAccountMutation = useSyncAccount();

  // API로부터 메일 목록 가져오기
  const accountsParam =
    selectedAccounts.length > 0
      ? selectedAccounts
          .map((selectedAccount) => selectedAccount.address)
          .join(",")
      : "";

  console.log("MainPage - accountsParam:", accountsParam);
  const {
    data: emails = [],
    isLoading: isMailLoading,
    isError: isMailError,
    error: mailError,
    refetch,
  } = useEmails({
    folder: "inbox",
    accounts: accountsParam,
  });

  const {
    mutateAsync: syncAccountMutate,
    isLoading: isSyncLoading,
    isError: isSyncError,
    error: syncError,
  } = useSyncAccount();

  // 디버깅용 로그
  console.log("MainPage - emails:", emails);
  // console.log("MainPage - error:", error);

  if (
    emails.length === 0 &&
    !isMailLoading &&
    !isMailError &&
    selectedAccounts.length > 0
  ) {
    console.warn(
      "⚠️ 선택된 계정에 메일이 없습니다. 백엔드에서 메일을 동기화했는지 확인하세요.",
    );
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(emails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmails = emails.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // 필터가 변경되면 첫 페이지로 리셋
  const handleAccountChange = (accounts) => {
    setSelectedAccounts(accounts);
    setCurrentPage(1);
  };

  // 새로고침 핸들러
  const handleRefresh = async () => {
    console.log("🔄 새로고침 시작");
    setIsSyncing(true);

    // 동기화할 계정 결정: 선택된 계정이 있으면 선택된 계정만, 없으면 모든 계정
    const accountsToSync =
      selectedAccounts.length > 0 ? selectedAccounts : accounts;

    console.log("수동 동기화 시작 - 대상 계정:", accountsToSync);

    try {
      // 계정들을 순차적으로 동기화
      for (const account of accountsToSync) {
        console.log(
          `\n=== 계정 ${account.id} (${account.address}) 동기화 시작 ===`,
        );
        console.log("동기화 API 호출:", `/api/account/${account.id}/sync/`);

        try {
          const syncResult = await syncAccountMutate(account.id);
          console.log(`✅ 계정 ${account.id} 동기화 API 응답:`, syncResult);
          console.log(`📧 동기화 메시지:`, syncResult?.message);

          if (syncResult?.synced_count !== undefined) {
            console.log(`📊 동기화된 메일 수:`, syncResult.synced_count);
          }
        } catch (syncErr) {
          console.error(`❌ 계정 ${account.id} 동기화 실패:`, syncErr);
          console.error("동기화 에러 상세:", syncErr.response?.data);
          throw syncErr;
        }
      }

      console.log("\n✅ 모든 계정 동기화 완료");

      // 동기화 완료 후 이메일 목록 새로고침
      console.log("📧 이메일 목록 새로고침 중...");
      const refreshResult = await refetch();
      console.log("📧 새로고침 완료");
      console.log("📊 가져온 메일 수:", refreshResult.data?.length || 0);

      if (refreshResult.data?.length === 0) {
        console.warn(
          "⚠️ 동기화 후에도 메일이 0개입니다. 백엔드 로그를 확인하세요.",
        );
        console.warn("💡 확인 사항:");
        console.warn("  1. 백엔드에서 IMAP 연결이 성공했는지");
        console.warn("  2. 실제로 메일을 fetch했는지");
        console.warn("  3. DB에 저장되었는지");
      }
    } catch (err) {
      console.error("❌ 동기화 실패:", err);
      console.error("에러 상세:", err.response?.data);
      console.error("에러 스택:", err.stack);
    } finally {
      setIsSyncing(false);
      console.log("🔄 동기화 프로세스 종료\n");
    }
  };

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={handleAccountChange}
    >
      <section className=" bg-gray-f5/20 rounded-lg border border-primary p-4 h-full flex flex-col">
        <div className="flex items-center justify-between gap-2 pl-1.5">
          <div className="flex items-center gap-2">
            <h2 className="font-h7 text-primary-dark">In box</h2>
            <button
              onClick={handleRefresh}
              disabled={isMailLoading || isSyncing}
              className="p-0 bg-transparent border-none cursor-pointer disabled:opacity-50"
              title={
                selectedAccounts.length > 0 ? "선택된 계정 동기화" : "새로고침"
              }
            >
              <Refresh
                className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-f5 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-b2 text-gray-700">
                {startIndex + 1}-{Math.min(endIndex, emails.length)} of{" "}
                {emails.length}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-f5 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <hr className="border-gray-bf" />
        <div className="flex flex-col overflow-y-auto min-h-0">
          {isMailLoading && (
            <div className="flex items-center justify-center p-8 text-gray-8c">
              로딩 중...
            </div>
          )}
          {isSyncLoading && (
            <div className="flex items-center justify-center p-8 text-gray-8c">
              동기화 중...
            </div>
          )}
          {isMailError && (
            <div className="flex flex-col items-center justify-center p-8 text-red-600">
              <p>메일을 불러오는 중 오류가 발생했습니다.</p>
              <pre className="mt-2 text-xs text-left bg-red-50 p-2 rounded">
                {JSON.stringify(
                  mailError?.response?.data ||
                    mailError?.message ||
                    "Unknown error",
                  null,
                  2,
                )}
              </pre>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-primary-dark text-white rounded-lg"
              >
                다시 시도
              </button>
            </div>
          )}
          {!isMailLoading && !isMailError && currentEmails.length === 0 && (
            <div className="flex items-center justify-center p-8 text-gray-8c">
              메일이 없습니다.
            </div>
          )}
          {!isMailLoading &&
            !isSyncError &&
            !isSyncLoading &&
            !isMailError &&
            currentEmails.map((mailObject) => (
              <MailList
                key={mailObject.id}
                sender={
                  mailObject.email.from_header.indexOf("<") !== -1
                    ? mailObject.email.from_header.substring(
                        0,
                        mailObject.email.from_header.indexOf("<"),
                      )
                    : mailObject.email.from_header
                }
                time={new Date(mailObject.received_at).toLocaleString("ko-KR", {
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                title={mailObject.email.subject}
                content={mailObject.email.preview}
                account={mailObject.account_address}
                onClick={() => navigate(`/mail/${mailObject.id}`)}
              />
            ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default MainPage;
