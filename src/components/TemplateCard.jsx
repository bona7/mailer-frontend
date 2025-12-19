import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import MailComposeModal from "@/components/modals/MailComposeModal";
import univ_thumb from "@/assets/univ_thumb.svg";
import work_thumb from "@/assets/work_thumb.svg";
import other_thumb from "@/assets/other_thumb.svg";
import custom_thumb from "@/assets/custom_thumb.svg";

const categoryImageMap = {
  대학교: univ_thumb,
  "업무/회사": work_thumb,
  "서비스 문의": other_thumb,
  "개인 템플릿": custom_thumb,
};

const TemplateCard = ({
  template,
  onClick,
  isFavorited = false,
  onHeartClick,
}) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [mailBody, setMailBody] = useState("");

  const handleComposeClick = (e) => {
    e.stopPropagation();
    console.log(
      "[DEBUG] Compose 버튼 클릭, template_content:",
      template.template_content,
    );
    setMailBody(template.template_content || template.body || "");
    setIsComposeOpen(true);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onHeartClick) {
      onHeartClick();
    }
  };

  const handleCloseCompose = () => {
    setIsComposeOpen(false);
  };

  const thumbnailUrl =
    template.main_category && categoryImageMap[template.main_category];

  return (
    <>
      <div
        className="border border-transparent rounded-lg flex flex-col gap-1 w-[284px] flex-shrink-0 cursor-pointer"
        onClick={() => onClick && onClick(template)}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={template.name}
            className="h-[188px] w-full object-contain rounded-md"
          />
        ) : (
          <div className="h-[188px] bg-gray-200 rounded-md"></div>
        )}
        <div className="flex justify-between items-center px-1 pt-1">
          <h3 className="font-b1 text-gray-59 truncate">{template.name}</h3>
          <div className="flex items-center gap-2">
            <Heart
              className="size-4 text-secondary-dark cursor-pointer"
              fill={isFavorited ? "currentColor" : "none"}
              onClick={handleHeartClick}
            />
            <Button
              size="sm"
              className="bg-secondary-dark hover:bg-secondary-light text-white h-auto py-0.5 px-1.5 font-bt2 rounded-sm"
              onClick={handleComposeClick}
            >
              Compose
            </Button>
          </div>
        </div>
        <div className="flex flex-col px-1 pb-1">
          <p className="font-b2 px-0.5 text-gray-59">{template.about}</p>
          <p className="font-b2 px-0.5 text-gray-8c truncate mt-1">
            {template.body}
          </p>
        </div>
      </div>
      {isComposeOpen && (
        <>
          {console.log(
            "[DEBUG] MailComposeModal 렌더링, initialBody:",
            mailBody,
          )}
          <MailComposeModal
            open={isComposeOpen}
            onClose={handleCloseCompose}
            initialBody={mailBody}
          />
        </>
      )}
    </>
  );
};

export default TemplateCard;
