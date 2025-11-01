import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Refresh } from "@/assets";
import { allMails } from "@/data/mails_dummy.jsx";
import { MailList, AppLayout } from "@/components";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const navigate = useNavigate();

  const inboxMails = allMails.filter((mail) => mail.folder === "inbox");

  const filteredEmails =
    selectedAccounts.length > 0
      ? inboxMails.filter((email) => selectedAccounts.includes(email.account))
      : inboxMails;

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <section className="h-full bg-gray-f5/20 rounded-lg border border-primary p-4 ">
        <div className="flex items-center gap-2 pl-1.5">
          <h2 className="font-h7 text-primary-dark">In box</h2>
          <button
            onClick={() => window.location.reload()}
            className="p-0 bg-transparent border-none cursor-pointer"
          >
            <Refresh className="w-4 h-4" />
          </button>
        </div>
        <Separator className="bg-gray-bf" />
        <div className="flex flex-col">
          {filteredEmails.map((email, index) => (
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
