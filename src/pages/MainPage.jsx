import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Refresh } from "@/assets";
import { allMails } from "@/data/mails_dummy.jsx";
import { MailList, AppLayout } from "@/components";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MainPage = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  const inboxMails = allMails.filter((mail) => mail.folder === "inbox");

  const filteredEmails =
    selectedAccounts.length > 0
      ? inboxMails.filter((email) => selectedAccounts.includes(email.account))
      : inboxMails;

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredEmails.length / ITEMS_PER_PAGE);

  // 현재 페이지에 표시할 이메일
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmails = filteredEmails.slice(startIndex, endIndex);

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

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <section className=" bg-gray-f5/20 rounded-lg border border-primary p-4 h-full flex flex-col">
        <div className="flex items-center justify-between gap-2 pl-1.5">
          <div className="flex items-center gap-2">
            <h2 className="font-h7 text-primary-dark">In box</h2>
            <button
              onClick={() => window.location.reload()}
              className="p-0 bg-transparent border-none cursor-pointer"
            >
              <Refresh className="w-4 h-4" />
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
                {startIndex + 1}-{Math.min(endIndex, filteredEmails.length)} of{" "}
                {filteredEmails.length}
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
        <Separator className="bg-gray-bf" />
        <div className="flex flex-col overflow-y-auto min-h-0">
          {currentEmails.map((email, index) => (
            <MailList
              key={index}
              sender={email.sender}
              time={email.time}
              title={email.title}
              content={email.content}
              account={email.account}
              onClick={() => navigate(`/mail/${index}`)}
            />
          ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default MainPage;
