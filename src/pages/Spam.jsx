import { useState, useEffect } from "react";
import { MailList, AppLayout, TrashButton } from "@/components";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useEmails,
  useUpdateEmailMetadata,
  useDeleteEmail,
} from "@/api/hooks/useEmails";
import { useAISummary } from "@/context/AISummaryContext";

const Spam = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { aiSumSelectedId, setAiSumSelectedId, setSelectedEmail } =
    useAISummary();

  const updateEmailMetadataMutation = useUpdateEmailMetadata();
  const deleteEmailMutation = useDeleteEmail();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  const accountsParam =
    selectedAccounts.length > 0
      ? selectedAccounts
          .map((selectedAccount) => selectedAccount.address)
          .join(",")
      : "";
  console.log("SpamPage - accountsParam:", accountsParam);

  const {
    data: trashEmails = [],
    isLoading: isMailLoading,
    isError: isMailError,
    error: mailError,
    refetch,
  } = useEmails({
    folder: "spam",
    accounts: accountsParam,
  });

  const handleMailCheckChange = (mailId, isChecked) => {
    setSelectedMailIds((prevSelected) =>
      isChecked
        ? [...prevSelected, mailId]
        : prevSelected.filter((id) => id !== mailId),
    );
  };

  const handleAiSumCheckChange = (mailId) => {
    setAiSumSelectedId((prevId) => (prevId === mailId ? null : mailId));
  };

  useEffect(() => {
    if (aiSumSelectedId) {
      const email = trashEmails.find((e) => e.id === aiSumSelectedId);
      setSelectedEmail(email || null);
    } else {
      setSelectedEmail(null);
    }
  }, [aiSumSelectedId, trashEmails, setSelectedEmail]);

  // Clean up AI summary selection when MainPage unmounts
  useEffect(() => {
    return () => {
      setAiSumSelectedId(null);
      setSelectedEmail(null);
    };
  }, [setAiSumSelectedId, setSelectedEmail]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(trashEmails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmails = trashEmails.slice(startIndex, endIndex);

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

  // 선택된 메일 복구
  const handleRecoverSelectedMails = async () => {
    if (selectedMailIds.length === 0) {
      alert("복구할 메일을 선택해주세요.");
      return;
    }
    try {
      await Promise.all(
        selectedMailIds.map((mailId) => {
          console.log("[Recover Mail] Request ID:", mailId);
          return updateEmailMetadataMutation.mutateAsync({
            emailMetadataId: mailId,
            data: { folder: "inbox" },
          });
        }),
      );
      alert("선택된 메일이 받은편지함으로 이동되었습니다.");
      setSelectedMailIds([]);

      // 모든 삭제 작업이 완료되면 onSuccess가 호출되어 쿼리 무효화 및 UI 업데이트 처리됨
    } catch (error) {
      // deleteEmailMutation 자체에서 오류 처리를 하므로 여기서는 추가 로깅 정도만
      console.error("선택된 메일 복구 중 오류 발생:", error);
    }
  };

  // 선택된 메일 완전 삭제 핸들러
  const handleCompletelyDelete = async () => {
    if (selectedMailIds.length === 0) {
      alert("삭제할 메일을 선택해주세요.");
      return;
    }
    if (
      !window.confirm(
        `${selectedMailIds.length}개의 메일을 완전히 삭제하시겠습니까? 이 작업은 복구할 수 없습니다.`,
      )
    ) {
      return;
    }
    try {
      // 각 선택된 메일에 대해 삭제 뮤테이션 실행
      await Promise.all(
        selectedMailIds.map((mailId) => {
          console.log("[Completely Delete Mail] Request ID:", mailId);
          return deleteEmailMutation.mutateAsync(mailId);
        }),
      );
      alert("선택된 메일이 삭제되었습니다.");
      setSelectedMailIds([]);

      // 모든 삭제 작업이 완료되면 onSuccess가 호출되어 쿼리 무효화 및 UI 업데이트 처리됨
    } catch (error) {
      // deleteEmailMutation 자체에서 오류 처리를 하므로 여기서는 추가 로깅 정도만
      console.error("선택된 메일 삭제 중 오류 발생:", error);
    }
  };

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <section className="h-full bg-gray-f5/20 rounded-lg border border-primary p-4 flex flex-col">
        <div className="flex items-center justify-between gap-2 pl-1.5">
          <h2 className="font-h7 text-primary-dark">Spam</h2>
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
                {startIndex + 1}-{Math.min(endIndex, trashEmails.length)} of{" "}
                {trashEmails.length}
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
            <TrashButton
              text={"Delete Forever"}
              onClick={handleCompletelyDelete}
              className="px-2"
            />

            <TrashButton
              text={"Selected Recover"}
              onClick={handleRecoverSelectedMails}
            />
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto">
          {!isMailLoading && !isMailError && currentEmails.length === 0 && (
            <div className="flex items-center justify-center p-8 text-gray-8c">
              스팸함이 비어 있습니다.
            </div>
          )}
          {!isMailLoading &&
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
                aiSumChecked={aiSumSelectedId === mailObject.id}
                onAiSumCheckChange={() => handleAiSumCheckChange(mailObject.id)}
              />
            ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default Spam;
