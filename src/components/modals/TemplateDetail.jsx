import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import CollectionDropdown from "../CollectionDropdown";
import instance from "@/app/axios";

import { addTemplateToMyTemplates } from "@/api/template";

const TemplateDetail = ({ template, onClose, onAddSuccess, onCompose }) => {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAccountsForAdd, setSelectedAccountsForAdd] = useState([]);

  const title = template.title || template.topic || "";
  const templateName = template.topic || template.name || "";
  const aboutText =
    template.sub_category || template.subCategory || template.about || "";
  const bodyText = template.template_content || template.body || "";

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleAddTemplate = async () => {
    if (!user) {
      alert("사용자 정보를 가져올 수 없습니다. 다시 로그인해주세요.");
      return;
    }
    if (!selectedAccountsForAdd || selectedAccountsForAdd.length === 0) {
      alert("템플릿을 추가할 계정을 선택해주세요.");
      return;
    }

    setIsAdding(true);
    try {
      await addTemplateToMyTemplates(template.id, {
        email_account_ids: selectedAccountsForAdd,
      });
      alert("템플릿이 성공적으로 추가되었습니다.");
      setIsHeartFilled(true);
      setIsDropdownOpen(false); // 드롭다운 닫기
      if (onAddSuccess) {
        onAddSuccess();
      }
    } catch (error) {
      console.error("템플릿 추가 실패:", error);
      alert("템플릿 추가에 실패했습니다.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleComposeClick = () => {
    console.log("📤 Compose button clicked in TemplateDetail");
    console.log("onCompose prop:", onCompose);
    if (onCompose) {
      onCompose(template);
    } else {
      console.error("❌ onCompose prop is not provided");
    }
  };

  const handleCollectionChange = (selectedIds) => {
    setSelectedAccountsForAdd(selectedIds);
    setIsHeartFilled(selectedIds.length > 0);
  };

  return (
    <div className="relative bg-white rounded-lg w-[912px] h-[562px] overflow-hidden border">
      <div className="absolute top-4 left-4 font-st2 text-black">
        {templateName}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 size-6 hover:bg-gray-100"
        onClick={onClose}
      >
        <X className="size-4" />
      </Button>
      <div className="p-14 flex h-full gap-20">
        {/* Left Column */}
        <div className="flex flex-col w-[280px]">
          <div className="mt-32">
            <h1 className="font-h5 text-black">
              {templateName || "Template Name"}
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              <Button
                className="bg-secondary-dark hover:bg-secondary-light text-gray-f0 font-button px-2 py-2 h-auto"
                onClick={handleComposeClick}
              >
                Compose
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-secondary-dark text-secondary-dark size-9"
                  onClick={toggleDropdown}
                >
                  <Heart
                    className={`size-3.5 ${
                      isHeartFilled ? "text-secondary-dark" : "none"
                    }`}
                    fill={isHeartFilled ? "currentColor" : "none"}
                  />
                </Button>
                {isDropdownOpen && (
                  <CollectionDropdown
                    onDone={handleAddTemplate}
                    onSelectionChange={handleCollectionChange}
                    initialSelection={selectedAccountsForAdd}
                    isAdding={isAdding}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div>
              <h2 className="font-st1 text-gray-26">About</h2>
              <p className="font-b2 text-gray-8c mt-1">
                {aboutText || "Detailed description of the template goes here."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-2 w-[472px]">
          <div className="flex flex-col gap-0.5">
            <label className="font-overline pl-1 text-gray-8c">Title</label>
            <div className="bg-transparent border-[1.5px] border-secondary-dark rounded-lg pl-5 pr-6 py-2 whitespace-pre-wrap font-b2 text-gray-8c overflow-y-auto">
              {title}
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="font-overline pl-1 text-gray-8c">Content</label>
            <div className="flex-grow bg-transparent border-[1.5px] border-secondary-dark rounded-lg pl-5 pr-6 pt-4 pb-5 whitespace-pre-wrap font-b2 text-gray-8c overflow-y-auto">
              {bodyText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;
