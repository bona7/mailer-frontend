import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { allMails } from "@/data/mails_dummy";
import { MailList, AppLayout, TrashButton } from "@/components";
import { useNavigate } from "react-router-dom";

const Trash = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const navigate = useNavigate();

  const handleMailCheckChange = (mailId, isChecked) => {
    setSelectedMailIds((prevSelected) =>
      isChecked
        ? [...prevSelected, mailId]
        : prevSelected.filter((id) => id !== mailId),
    );
  };

  const trashMails = allMails.filter((mail) => mail.folder === "trash");

  const filteredEmails =
    selectedAccounts.length > 0
      ? trashMails.filter((email) => selectedAccounts.includes(email.account))
      : trashMails;

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <section className="h-full bg-gray-f5/20 rounded-lg border border-primary p-4 ">
        <div className="flex items-center gap-2 pl-1.5">
          <h2 className="font-h7 text-primary-dark">Trash</h2>
        </div>
        <Separator className="bg-gray-bf" />
        <div className="flex items-center justify-between mt-1.5">
          <TrashButton
            text={"Select All"}
            onClick={() => {
              if (selectedMailIds.length === filteredEmails.length) {
                // All are selected, deselect all
                setSelectedMailIds([]);
              } else {
                // Select all
                setSelectedMailIds(filteredEmails.map((email) => email.id));
              }
            }}
          />
          <div className="flex gap-2">
            <TrashButton
              text={"Selected Delete"}
              onClick={() => alert("Delete action triggered")}
              className="px-2"
            />

            <TrashButton
              text={"Selected Recover"}
              onClick={() => alert("Recover action triggered")}
            />
          </div>
        </div>

        <div className="flex flex-col">
          {filteredEmails.map((email, index) => (
            <MailList
              key={email.id}
              sender={email.sender}
              time={email.time}
              title={email.title}
              content={email.content}
              account={email.account}
              onClick={() => navigate(`/mail/${email.id}`)}
              showCheckbox={true}
              checked={selectedMailIds.includes(email.id)}
              onCheckChange={(isChecked) =>
                handleMailCheckChange(email.id, isChecked)
              }
            />
          ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default Trash;
