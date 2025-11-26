import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComposeDropdown from "@/components/compose_dropdown";
import attachment from "@/assets/attachment.svg";
import { X } from "lucide-react";

import { useAddAccount, useAccounts } from "@/api/hooks/useAccounts";
import { sendEmail } from "@/api/sendEmail";
import { useSendToast } from "@/components/ui/SendToastProvider";

function MailComposeModal({ isOpen, onClose, isAddAccountMode = false }) {
  const { data: accounts = [] } = useAccounts();
  const addAccountMutation = useAddAccount();

  // selectedFromEmail을 account 객체로 저장
  const [selectedFromEmail, setSelectedFromEmail] = useState(null);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedFromEmail) {
      setSelectedFromEmail(accounts[0]);
    }
  }, [accounts, selectedFromEmail]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const editorRef = useRef(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorAnchor, setColorAnchor] = useState(null);
  const highlightColors = [
    "#fff9c4", // 연노랑
    "#ffe0b2", // 연주황
    "#b2dfdb", // 연청록
    "#bbdefb", // 연파랑
    "#f8bbd0", // 연분홍
    "#f0f0f0", // 연회색
    "#ffffff", // 흰색
  ];
  // 배경색 지정
  const handleHighlightClick = (e) => {
    setColorPickerOpen((prev) => !prev);
    setColorAnchor(e.currentTarget);
  };

  const handleColorSelect = (color) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("backColor", false, color);
    }
    setColorPickerOpen(false);
  };

  // Bold 버튼 클릭 시 실제 HTML로 굵게
  const handleBoldClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("bold", false, null);
    }
  };

  // Italic 버튼 클릭 시 실제 HTML로 기울임
  const handleItalicClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("italic", false, null);
    }
  };

  // Underline 버튼 클릭 시 실제 HTML로 밑줄
  const handleUnderlineClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("underline", false, null);
    }
  };

  const [sending, setSending] = useState(false);
  const { showToast } = useSendToast();

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

  // account 객체에서 id/address 추출
  const getAccountIdByAddress = (address) => {
    const acc = accounts.find((a) => a.address === address);
    return acc ? acc.id : null;
  };

  const handleSend = async () => {
    // selectedFromEmail이 객체라면 address/id 바로 사용
    const senderAddress = selectedFromEmail?.address;
    const accountId = selectedFromEmail?.id;
    if (!accountId || !senderAddress) {
      alert("발신 계정 주소가 올바르지 않습니다.");
      return;
    }
    if (!recipients) {
      alert("수신자 이메일을 입력하세요.");
      return;
    }
    setSending(true);
    try {
      await sendEmail({
        account_id: accountId,
        to: recipients.split(/[,;\s]+/).filter(Boolean),
        subject,
        body,
        is_html: false,
        files: attachedFiles,
      });
      setRecipients("");
      setSubject("");
      setBody("");
      setAttachedFiles([]);
      showToast();
      onClose();
    } catch (error) {
      alert(
        "이메일 전송 실패: " +
          (error?.response?.data?.error ||
            error?.response?.data?.detail ||
            error.message),
      );
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 right-0 z-50">
      <div className="relative w-[min(90cqw,640px)] h-[32.5rem] bg-gray-fa rounded-lg border border-secondary-dark p-5 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-8c hover:text-gray-1f"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center border-b border-secondary-dark">
          <ComposeDropdown
            options={accounts}
            selectedOption={selectedFromEmail || {}}
            onOptionChange={setSelectedFromEmail}
          />
        </div>
        <div className="flex items-center border-b border-secondary-dark">
          <label htmlFor="recipients" className="text-gray-8c font-st2">
            Recipients
          </label>
          <Input
            id="recipients"
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="이메일 주소 여러 개는 , 또는 ; 또는 공백으로 구분"
            className="border-none pax-5 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center border-b border-secondary-dark">
          <Input
            id="subject"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-0 h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:font-st2 placeholder:text-gray-8c"
          />
        </div>
        <div className="flex-grow py-4 flex flex-col">
          {/* 실제 HTML 에디터 */}
          <div
            ref={editorRef}
            className="w-full flex-grow bg-transparent border-none resize-none focus:outline-none p-2"
            contentEditable
            suppressContentEditableWarning
            placeholder="메일 본문을 입력하세요."
            style={{ minHeight: 120, outline: "none" }}
            onInput={(e) => setBody(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: body }}
          />
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
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? "Send" : "Send"}
            </Button>
            <button onClick={handleAttachmentClick} className="cursor-pointer">
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
            <Button variant="ghost" size="icon" onClick={handleBoldClick}>
              <b>B</b>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleItalicClick}>
              <i>I</i>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleUnderlineClick}>
              <u>U</u>
            </Button>
            <div className="relative inline-block">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleHighlightClick}
              >
                <span className="inline-flex items-center justify-center bg-secondary-light w-6 h-6 rounded-none">
                  A
                </span>
              </Button>
              {colorPickerOpen && (
                <div className="absolute left-0 top-8 z-50 flex gap-1 p-2 bg-white border rounded shadow-md">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-full border border-gray-200 focus:outline-none"
                      style={{ background: color }}
                      onClick={() => handleColorSelect(color)}
                      tabIndex={-1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailComposeModal;
