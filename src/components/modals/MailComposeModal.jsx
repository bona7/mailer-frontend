import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComposeDropdown from "@/components/compose_dropdown";
import attachment from "@/assets/attachment.svg";
import { accountEmails } from "@/data/dummy_MainPage";
import { X } from "lucide-react";

function MailComposeModal({ isOpen, onClose }) {
  const [selectedFromEmail, setSelectedFromEmail] = useState(
    accountEmails[0].email, // 이메일 선택여부 context로 관리 이후 선택된 이메일로 초기값 설정하도록 수정 필요
  );

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 right-0 z-50">
      <div className="relative w-[40rem] h-[32.5rem] bg-gray-fa rounded-lg border border-secondary-dark p-5 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-8c hover:text-gray-1f"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center border-b border-secondary-dark">
          <ComposeDropdown
            options={accountEmails.map((account) => account.email)}
            selectedOption={selectedFromEmail}
            onOptionChange={setSelectedFromEmail}
          />
        </div>
        <div className="flex items-center border-b border-secondary-dark">
          <label htmlFor="recipients" className="text-gray-8c font-st2">
            Recipients
          </label>
          <Input
            id="recipients"
            type="email"
            className="border-none px-5 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center border-b border-secondary-dark">
          <Input
            id="subject"
            placeholder="Subject"
            className="p-0 h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:font-st2 placeholder:text-gray-8c"
          />
        </div>
        <div className="flex-grow py-4">
          {/* This would be a rich text editor */}
          <textarea className="w-full h-full bg-transparent border-none resize-none focus:outline-none" />
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="h-6 w-16 bg-secondary-dark text-gray-f5 font-bt2 hover:bg-secondary-light hover:text-gray-1f"
            >
              Send
            </Button>
            <img src={attachment} alt="attachment" className="w-4 h-5" />
          </div>
          <div className="flex items-center gap-0">
            {/* Formatting buttons */}
            <Button variant="ghost" size="icon">
              A
            </Button>
            <select className="bg-transparent">
              <option>Montserrat</option>
            </select>
            <Button variant="ghost" size="icon">
              <b>B</b>
            </Button>
            <Button variant="ghost" size="icon">
              <i>I</i>
            </Button>
            <Button variant="ghost" size="icon">
              <u>U</u>
            </Button>
            <Button variant="ghost" size="icon" className="bg-secondary-light">
              A
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailComposeModal;
