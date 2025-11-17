import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { allMails } from "@/data/mails_dummy.jsx";
import { accountEmails } from "@/data/sidebar_MainPage";
import AppLayout from "@/components/AppLayout";
import { getAccountColor } from "@/lib/utils";
import { HardDrive } from "lucide-react";

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
      <section className="h-full bg-gray-f5/40 rounded-lg border border-primary p-4 flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between pl-1">
            <h2 className="font-h7 text-primary-dark">{email.title}</h2>
            <span className="font-b2 text-gray-1f mr-3">{email.time}</span>
          </div>
          <hr className="border-gray-bf" />
          <div className="flex flex-col gap-8 pt-2 pb-2.5">
            <div className="px-1 gap-1">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${getAccountColor(email.account)}`}
                />
                <span className="font-b2  text-primary">My email: </span>
                <span className="font-b2  text-primary">{account.email}</span>
              </div>
              <span className="font-b2 text-primary">{email.sender}</span>
            </div>
          </div>
          <hr className="border-gray-bf" />
        </div>
        {/* 내용 */}
        <div className="px-1">
          <span className="font-b1 text-gray-43 whitespace-pre-line">
            {email.content}
          </span>
        </div>
      </section>
    </AppLayout>
  );
};

export default MailDetail;
