import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComposeDropdown from "@/components/compose_dropdown";
import attachment from "@/assets/attachment.svg";
import { X } from "lucide-react";
import { useAddAccount, useAccounts } from "@/api/hooks/useAccounts"; // useAddAccount 훅 임포트

function MailComposeModal({ isOpen, onClose, isAddAccountMode = false }) {
  const { data: accounts } = useAccounts(); // 계정 목록 가져오기
  const addAccountMutation = useAddAccount();

  const [selectedFromEmail, setSelectedFromEmail] = useState(
    accounts && accounts.length > 0 ? accounts[0].address : "", // 실제 계정 데이터로 초기값 설정
  );
  const [attachedFiles, setAttachedFiles] = useState([]);

  // 계정 추가 모드 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleAttachmentClick = () => {
    document.getElementById("file-input").click();
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAccountSubmit = async () => {
    try {
      await addAccountMutation.mutateAsync({
        address: email,
        password,
        domain,
      });
      alert("계정이 성공적으로 추가되었습니다.");
      onClose();
    } catch (error) {
      alert(
        "계정 추가에 실패했습니다: " +
          (error.response?.data?.detail || error.message),
      );
    }
  };

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
          <h2 className="font-st1 text-primary-dark">
            {isAddAccountMode ? "새 계정 추가" : "새 메일 작성"}
          </h2>
        </div>

        {isAddAccountMode ? (
          <>
            <div className="flex items-center border-b border-secondary-dark">
              <label htmlFor="email" className="text-gray-8c font-st2 w-20">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none px-5 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="example@domain.com"
              />
            </div>
            <div className="flex items-center border-b border-secondary-dark">
              <label htmlFor="password" className="text-gray-8c font-st2 w-20">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none px-5 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="비밀번호"
              />
            </div>
            <div className="flex items-center border-b border-secondary-dark">
              <label htmlFor="domain" className="text-gray-8c font-st2 w-20">
                도메인
              </label>
              <Input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="border-none px-5 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="imap.domain.com (선택 사항)"
              />
            </div>
            <div className="flex justify-end items-center mt-auto">
              <Button
                variant="default"
                size="sm"
                className="h-6 w-24 bg-secondary-dark text-gray-f5 font-bt2 hover:bg-secondary-light hover:text-gray-1f"
                onClick={handleAddAccountSubmit}
                disabled={addAccountMutation.isPending}
              >
                {addAccountMutation.isPending ? "추가 중..." : "계정 추가"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center border-b border-secondary-dark">
              <ComposeDropdown
                options={accounts?.map((account) => account.address) || []}
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
                className="border-none pax-5 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center border-b border-secondary-dark">
              <Input
                id="subject"
                placeholder="Subject"
                className="p-0 h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:font-st2 placeholder:text-gray-8c"
              />
            </div>
            <div className="flex-grow py-4 flex flex-col">
              {/* This would be a rich text editor */}
              <textarea className="w-full flex-grow bg-transparent border-none resize-none focus:outline-none" />
            </div>
            {/* Attached files display */}
            {attachedFiles.length > 0 && (
              <div className="mb-2 p-2 bg-gray-f0 rounded-[9px] border">
                <div className="text-sm font-medium text-secondary-dark mb-2">
                  첨부파일:
                </div>
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-white px-2 py-1 rounded-[9px] text-xs"
                    >
                      <span className="text-gray-8c">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="h-6 w-16 bg-secondary-dark text-gray-f5 font-bt2 hover:bg-secondary-light hover:text-gray-1f"
                >
                  Send
                </Button>
                <button
                  onClick={handleAttachmentClick}
                  className="cursor-pointer"
                >
                  <img src={attachment} alt="attachment" className="w-4 h-5" />
                </button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div className="flex items-center gap-0">
                {/* Formatting buttons */}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-secondary-light"
                >
                  A
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MailComposeModal;
