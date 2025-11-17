import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { allMails } from "@/data/mails_dummy.jsx";
import { accountEmails } from "@/data/sidebar_MainPage";
import AppLayout from "@/components/AppLayout";
import { getAccountColor } from "@/lib/utils";

const MailDetail = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const { id } = useParams();
  console.log(id);

  const emailId = parseInt(id, 10);
  const email = allMails.find((email) => email.id === emailId);
  const account = accountEmails.find((acc) => acc.type === email.account);
  console.log(email);

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <section className="h-full bg-gray-f5/40 rounded-lg border border-primary p-4">
        <div className="flex items-center justify-between gap-2 pl-1.5">
          <h2 className="font-h7 text-primary-dark">{email.title}</h2>
          <span className="font-b2 text-gray-1f mr-3">{email.time}</span>
        </div>
        <Separator className="bg-gray-bf" />
        <div className="flex flex-col gap-8">
          <div className="pt-2 px-1.5 gap-1">
            <div className="flex items-center gap-1">
              <span className="font-b2  text-gray-1f">My email: </span>
              <div
                className={`w-2 h-2 rounded-full ${getAccountColor(email.account)}`}
              />
              <span className="font-b2  text-gray-1f">{account.email}</span>
            </div>
            <span className="font-b2 text-gray-1f">{email.sender}</span>
          </div>
          {/* 내용 */}
          <div className="px-1.5">
            <span className="font-b1 text-gray-1f whitespace-pre-line">
              {email.content}
            </span>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default MailDetail;
