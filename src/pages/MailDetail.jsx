import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmailDetail } from "@/api/hooks/useEmails";
import { AppLayout, AttachmentCard } from "@/components";
import { getAccountColor } from "@/lib/utils";
import DOMPurify from "dompurify";

const MailDetail = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const { id } = useParams();
  console.log(id);

  const {
    data: mailObject = [],
    isLoading: isMailDetailLoading,
    isError: isMailDetailError,
  } = useEmailDetail(id);
  const emailId = parseInt(id, 10);

  console.log("fetched email:", mailObject);
  // const { data: accounts, isLoading, isError } = useAccounts(); // useAccounts 훅 사용

  // 로딩 또는 에러 상태 처리
  if (isMailDetailLoading)
    return (
      <AppLayout
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
      >
        <p>Loading email details...</p>
      </AppLayout>
    );
  if (isMailDetailError)
    return (
      <AppLayout
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
      >
        <p>Error loading email details.</p>
      </AppLayout>
    );
  if (!mailObject)
    return (
      <AppLayout
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
      >
        <p>Email not found.</p>
      </AppLayout>
    );

  function EmailBody(htmlContent) {
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);

    return (
      <div
        className="px-1 font-b1 text-gray-43"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <section className="h-full bg-gray-f5/40 rounded-lg border border-primary p-4 flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between pl-1 pb-2">
            <h2 className="font-h7 text-primary-dark">
              {mailObject.email.subject}
            </h2>
            <span className="font-b2 text-gray-1f mr-3">
              {new Date(mailObject.email.date).toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <hr className="border-gray-bf" />
          <div className="flex flex-col gap-8 pt-2 pb-2.5">
            <div className="px-1 gap-1">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${getAccountColor(mailObject.account_address)}`}
                />
                <span className="font-b2  text-primary">My email: </span>
                <span className="font-b2  text-primary">
                  {mailObject.account_address}
                </span>
              </div>
              <span className="font-b2 text-primary">
                {mailObject.email.from_header}
              </span>
            </div>
          </div>
          <hr className="border-gray-bf" />
        </div>
        {/* 내용 */}
        <div className="px-1 overflow-y-auto overflow-x-auto">
          <span className="font-b1 text-gray-43 whitespace-pre-line">
            {EmailBody(mailObject.email.html_body)}
          </span>
          {mailObject.email.attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-bf">
              <h3 className="font-h8 text-primary-dark mb-3">
                {mailObject.email.attachments.length} Attachments
              </h3>
              <div className="flex flex-wrap gap-3">
                {mailObject.email.attachments.map((attachment) => (
                  <AttachmentCard
                    key={attachment.id}
                    fileName={attachment.file_name}
                    downloadUrl={attachment.download_url}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
};

export default MailDetail;
