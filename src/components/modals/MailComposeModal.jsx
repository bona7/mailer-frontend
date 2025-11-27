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
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
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
    try {
      const senderAddress = selectedFromEmail?.address;
      const accountId = selectedFromEmail?.id;

      if (!accountId || !senderAddress) {
        alert("발신 계정 주소가 올바르지 않습니다.");
        return;
      }

      // 1) 현재 recipients + 입력 중인 값으로 최종 배열 만들기
      let finalRecipients = [...recipients];

      const trimmedInput = recipientInput.trim();
      if (trimmedInput) {
        if (!finalRecipients.includes(trimmedInput)) {
          finalRecipients.push(trimmedInput);
        }
      }

      // 2) 최종 수신자 없으면 막기
      if (finalRecipients.length === 0) {
        alert("수신자 이메일을 입력하세요.");
        return;
      }

      setSending(true);

      // 3) 메일 전송 (HTML 본문 포함)
      await sendEmail({
        account_id: accountId,
        to: finalRecipients, // 배열 형태로 전달
        subject,
        body, // contentEditable에서 온 HTML
        is_html: true,
        files: attachedFiles,
      });

      // 4) 성공 시 상태 초기화
      setRecipients([]);
      setRecipientInput("");
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

  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태 관리

  const handleInput = (e) => {
    if (!isComposing) {
      setBody(e.currentTarget.innerHTML); // 조합이 끝난 경우에만 상태 업데이트
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true); // 조합 시작
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false); // 조합 종료
    setBody(e.currentTarget.innerHTML); // 조합 완료 후 상태 업데이트
  };

  // 현재 입력값을 이메일 태그로 추가
  const addRecipientFromInput = () => {
    const value = recipientInput.trim();
    if (!value) return;

    // 중복 방지 (원하면 이 부분은 빼도 됨)
    if (!recipients.includes(value)) {
      setRecipients((prev) => [...prev, value]);
    }
    setRecipientInput("");
  };

  // 태그 하나 삭제
  const removeRecipient = (index) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index));
  };

  // 키보드 입력 처리 (엔터 / 스페이스 / 탭)
  const handleRecipientKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Tab") {
      e.preventDefault();
      addRecipientFromInput();
    }
  };

  // 포커스를 잃을 때도 자동으로 태그화 (선택 사항)
  const handleRecipientBlur = () => {
    addRecipientFromInput();
  };

  // 붙여넣기에서 여러 메일 한 번에 처리
  const handleRecipientPaste = (e) => {
    const text = e.clipboardData.getData("text");
    const emails = text
      .split(/[,;\s]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    if (emails.length === 0) return;

    e.preventDefault();
    setRecipients((prev) => [
      ...prev,
      ...emails.filter((email) => !prev.includes(email)),
    ]);
    setRecipientInput("");
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
        <div className="flex items-start border-b border-secondary-dark py-1">
          <label className="text-gray-8c font-st2 mt-1 mr-2 shrink-0">
            Recipients
          </label>

          <div className="flex-1 flex flex-wrap items-center gap-1 min-h-8">
            {/* 이메일 태그들 */}
            {recipients.map((email, index) => (
              <div
                key={email + index}
                className="flex items-center bg-gray-f0 rounded-full px-2 py-0.5 text-xs text-gray-800"
              >
                <span className="mr-1">{email}</span>
                <button
                  type="button"
                  onClick={() => removeRecipient(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}

            {/* 실제 입력창 */}
            <input
              id="recipients"
              type="text"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              onKeyDown={handleRecipientKeyDown}
              onBlur={handleRecipientBlur}
              onPaste={handleRecipientPaste}
              placeholder={
                recipients.length === 0 ? "메일 주소 입력 후 Space/Enter" : ""
              }
              className="flex-1 bg-transparent outline-none text-sm py-1"
            />
          </div>
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
            className="w-full flex-grow bg-transparentr resize-none focus:outline-none p-2"
            contentEditable
            suppressContentEditableWarning
            placeholder="메일 본문을 입력하세요."
            style={{
              minHeight: 120,
              outline: "none",
              textAlign: "left",
              direction: "ltr",
            }}
            onInput={handleInput} // 입력 이벤트 처리
            onCompositionStart={handleCompositionStart} // 한글 조합 시작
            onCompositionEnd={handleCompositionEnd} // 한글 조합 종료
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
