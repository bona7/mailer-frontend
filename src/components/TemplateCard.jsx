import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const TemplateCard = ({ template, onClick }) => (
  <div
    className="border border-primary rounded-lg p-2 flex flex-col gap-1 w-[284px] flex-shrink-0 cursor-pointer"
    onClick={() => onClick(template)}
  >
    <div className="h-[188px] bg-gray-200 rounded-md"></div>
    <div className="flex justify-between items-center px-1 pt-1">
      <h3 className="font-b1 text-gray-59">{template.name}</h3>
      <div className="flex items-center gap-1">
        <Heart
          className="size-3.5 text-secondary-dark hover:fill-secondary-light cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          size="sm"
          className="bg-secondary-dark hover:bg-secondary-light text-white h-auto py-0.5 px-1.5 font-bt2 rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Compose
        </Button>
      </div>
    </div>
    <div className="flex flex-col px-1 pb-1">
      <p className="font-b2 text-gray-43">About</p>
      <p className="font-b2 text-gray-8c truncate">{template.about}</p>
    </div>
  </div>
);

export default TemplateCard;
