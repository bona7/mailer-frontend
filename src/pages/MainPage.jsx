import { useState, useMemo, useEffect } from "react";
import { Refresh } from "@/assets";
import { MailList, AppLayout, TrashButton } from "@/components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEmails, useUpdateEmailMetadata } from "@/api/hooks/useEmails";
import { useSyncAccount, useAccounts } from "@/api/hooks/useAccounts";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query"; // useQueryClient, useQueries 추가
import { deleteEmail, getEmails } from "../api/email"; // deleteEmail과 getEmails 임포트

const MainPage = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  // console.log("selected Accounts (mainPage):", selectedAccounts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const ITEMS_PER_PAGE = 20;

  const { data: accounts = [] } = useAccounts();
  const syncAccountMutation = useSyncAccount();
  const queryClient = useQueryClient(); // useQueryClient 초기화

  const handleMailCheckChange = (mailId, isChecked) => {
    setSelectedMailIds((prevSelected) =>
      isChecked
        ? [...prevSelected, mailId]
        : prevSelected.filter((id) => id !== mailId),
    );
  };

  // API로부터 메일 목록 가져오기
  const accountsParam =
    selectedAccounts.length > 0
      ? selectedAccounts
          .map((selectedAccount) => selectedAccount.address)
          .join(",")
      : "";

  console.log("MainPage - accountsParam:", accountsParam);

  // inbox 와 starred 메일을 모두 받아오기
  const {
    data: emails = [],
    isLoading: isMailLoading,
    isError: isMailError,
    error: mailError,
    refetch,
  } = useQueries({
    queries: [
      {
        queryKey: [
          "emails",
          { folder: "inbox", accounts: accountsParam, query: searchQuery },
        ],
        queryFn: () =>
          getEmails({
            folder: "inbox",
            accounts: accountsParam,
            query: searchQuery,
          }),
        refetchOnMount: true,
        cacheTime: 5 * 60 * 1000,
      },
      {
        queryKey: [
          "emails",
          { folder: "starred", accounts: accountsParam, query: searchQuery },
        ],
        queryFn: () =>
          getEmails({
            folder: "starred",
            accounts: accountsParam,
            query: searchQuery,
          }),
        refetchOnMount: true,
        cacheTime: 5 * 60 * 1000,
      },
    ],
    combine: (results) => {
      const inboxEmails = results[0].data || [];
      const starredEmails = results[1].data || [];

      // console.log("MainPage - Inbox emails data:", inboxEmails);
      // console.log("MainPage - Total inbox emails:", inboxEmails.length);
      // console.log("MainPage - Starred emails data:", starredEmails);
      // console.log("MainPage - Total starred emails:", starredEmails.length);

      const combinedEmails = [...inboxEmails, ...starredEmails].sort(
        (a, b) => new Date(b.received_at) - new Date(a.received_at),
      );
      const isLoading = results.some((result) => result.isLoading);
      const isError = results.some((result) => result.isError);
      const errors = results.map((result) => result.error).filter(Boolean);

      return {
        data: combinedEmails,
        isLoading,
        isError,
        error: errors.length > 0 ? errors[0] : undefined,
        refetch: () => results.forEach((result) => result.refetch()),
      };
    },
  });

  // // 캐시된 쿼리 확인
  // const allQueries = queryClient.getQueryCache().getAll();

  // allQueries.forEach((q) => {
  //   console.log("📦 cache queryKey:", q.queryKey);
  // });

  const {
    mutateAsync: syncAccountMutate,
    isLoading: isSyncLoading,
    isError: isSyncError,
    error: syncError,
  } = useSyncAccount();

  const updateEmailMetadataMutation = useUpdateEmailMetadata();

  // 디버깅용 로그
  // console.log("MainPage - emails:", emails);
  // console.log("MainPage - error:", error);

  // useEffect(() => {
  //   console.log("MainPage - Combined emails data:", emails);
  //   console.log("MainPage - Total combined emails:", emails.length);
  // }, [emails]);

  if (
    emails.length === 0 &&
    !isMailLoading &&
    !isMailError &&
    selectedAccounts.length > 0
  ) {
    console.warn(
      "⚠️ 선택된 계정에 메일이 없습니다. 메일을 동기화했는지 확인하세요.",
    );
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(emails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmails = emails.slice(startIndex, endIndex);
  // console.log("MainPage - currentEmails:", currentEmails);

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

          // ✅ 응답 구조 검증 추가
          console.log(`✅ 계정 ${account.id} 동기화 API 응답:`, syncResult);

          // syncResult가 undefined이거나 data가 없는 경우 처리
          if (!syncResult) {
            console.warn(`⚠️ 계정 ${account.id}: 동기화 응답이 비어있습니다`);
            continue;
          }

          // 응답 데이터 구조에 따라 접근 방식 조정
          const responseData = syncResult.data || syncResult;
          console.log(
            `📧 동기화 메시지:`,
            responseData?.message || "메시지 없음",
          );

          if (responseData?.synced_count !== undefined) {
            console.log(`📊 동기화된 메일 수:`, responseData.synced_count);
          }

          // ✅ 백엔드 작업 완료 대기 시간 추가
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (syncErr) {
          console.error(`❌ 계정 ${account.id} 동기화 실패:`, syncErr);
          console.error("동기화 에러 상세:", {
            response: syncErr.response?.data,
            status: syncErr.response?.status,
            message: syncErr.message,
          });
          // ✅ 에러 발생 시에도 계속 진행 (throw 제거)
        }
      }

      console.log("\n✅ 모든 계정 동기화 완료");

      // ✅ 동기화 완료 후 충분한 대기 시간
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 동기화 완료 후 이메일 목록 새로고침
      console.log("📧 이메일 목록 새로고침 중...");
      const refreshResult = await refetch();

      console.log("📧 새로고침 완료");

      // ✅ refetch 결과 구조 확인
      const emailData = refreshResult?.data || refreshResult;
      const emailCount = Array.isArray(emailData) ? emailData.length : 0;
      console.log("📊 가져온 메일 수:", emailCount);

      if (emailCount === 0) {
        console.warn(
          "⚠️ 동기화 후에도 메일이 0개입니다. 백엔드 로그를 확인하세요.",
        );
        console.warn("💡 확인 사항:");
        console.warn("  1. 백엔드에서 IMAP 연결이 성공했는지");
        console.warn("  2. 실제로 메일을 fetch했는지");
        console.warn("  3. DB에 저장되었는지");
        console.warn("  4. API 응답에 데이터가 포함되어 있는지");
      }
    } catch (err) {
      console.error("❌ 동기화 실패:", err);
      console.error("에러 상세:", {
        response: err.response?.data,
        message: err.message,
        stack: err.stack,
      });
    } finally {
      setIsSyncing(false);
      console.log("🔄 동기화 프로세스 종료\n");
    }
  };

  // 선택된 메일 삭제 (휴지통으로 이동) 핸들러
  const handleDeleteSelectedMails = async () => {
    if (
      !window.confirm(
        `${selectedMailIds.length}개의 메일을 휴지통으로 이동하시겠습니까?`,
      )
    ) {
      return;
    }
    try {
      // 각 선택된 메일에 대해 삭제 뮤테이션 실행
      await Promise.all(
        selectedMailIds.map((mailId) => {
          console.log("[Patch Mail] Request ID:", mailId);
          return updateEmailMetadataMutation.mutateAsync({
            emailMetadataId: mailId,
            data: { folder: "trash" },
          });
        }),
      );
      alert("선택된 메일이 휴지통으로 이동되었습니다.");
      setSelectedMailIds([]);

      // 모든 삭제 작업이 완료되면 onSuccess가 호출되어 쿼리 무효화 및 UI 업데이트 처리됨
    } catch (error) {
      // deleteEmailMutation 자체에서 오류 처리를 하므로 여기서는 추가 로깅 정도만
      console.error("선택된 메일 삭제 중 오류 발생:", error);
    }
  };
  const handleSpamSelectedMails = async () => {
    if (
      !window.confirm(
        `${selectedMailIds.length}개의 메일을 스팸함으로 이동하시겠습니까?`,
      )
    ) {
      return;
    }
    try {
      // 각 선택된 메일에 대해 삭제 뮤테이션 실행
      await Promise.all(
        selectedMailIds.map((mailId) => {
          console.log("[Patch Mail] Request ID:", mailId);
          return updateEmailMetadataMutation.mutateAsync({
            emailMetadataId: mailId,
            data: { folder: "spam" },
          });
        }),
      );
      alert("선택된 메일이 스팸함으로 이동되었습니다.");
      setSelectedMailIds([]);
    } catch (error) {
      // deleteEmailMutation 자체에서 오류 처리를 하므로 여기서는 추가 로깅 정도만
      console.error("스팸함으로 보내는 중 오류 발생:", error);
    }
  };

  const handleStarredSelectedMails = async () => {
    try {
      // 각 선택된 메일에 대해 삭제 뮤테이션 실행
      await Promise.all(
        selectedMailIds.map((mailId) => {
          console.log("[Patch Mail] Request ID:", mailId);
          return updateEmailMetadataMutation.mutateAsync({
            emailMetadataId: mailId,
            data: { folder: "starred" },
          });
        }),
      );
      alert("선택된 메일이 중요메일함으로 이동되었습니다.");
      setSelectedMailIds([]);
    } catch (error) {
      // deleteEmailMutation 자체에서 오류 처리를 하므로 여기서는 추가 로깅 정도만
      console.error("중요메일함으로 보내는 중 오류 발생:", error);
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
        <div className="flex items-center justify-between mt-1.5 mb-0.5">
          <TrashButton
            text={"Select All"}
            onClick={() => {
              if (selectedMailIds.length === currentEmails.length) {
                // All are selected, deselect all
                setSelectedMailIds([]);
              } else {
                // Select all
                setSelectedMailIds(currentEmails.map((email) => email.id));
              }
            }}
          />
          <div className="flex gap-2">
            {selectedMailIds.length > 0 && (
              <>
                <TrashButton
                  text={"Starred"}
                  onClick={handleStarredSelectedMails}
                  className="px-2"
                />
                <TrashButton
                  text={"Spam"}
                  onClick={handleSpamSelectedMails}
                  className="px-2"
                />
                <TrashButton
                  text={"Delete"}
                  onClick={handleDeleteSelectedMails}
                />
              </>
            )}
          </div>
        </div>
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
                checked={selectedMailIds.includes(mailObject.id)}
                title={mailObject.email.subject}
                content={mailObject.email.preview}
                account={mailObject.account_address}
                onClick={() => navigate(`/mail/${mailObject.id}`)}
                onCheckChange={(isChecked) =>
                  handleMailCheckChange(mailObject.id, isChecked)
                }
                isRead={mailObject.is_read}
              />
            ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default MainPage;
