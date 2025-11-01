import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import CollectionDropdown from "./CollectionDropdown";

const TemplateDetail = ({ templateName, aboutText, bodyText, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleAddCollection = (selectedIds) => {
    setIsHeartFilled(selectedIds.length > 0);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative bg-white rounded-lg w-[912px] h-[562px] overflow-hidden border">
      <div className="absolute top-4 left-4 font-st2 text-black">
        Template Name
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 size-6 hover:bg-gray-100"
        onClick={onClose}
      >
        <X className="size-4" />
      </Button>
      <div className="p-14 flex h-full">
        {/* Left Column */}
        <div className="flex flex-col w-[280px]">
          <div className="mt-32">
            <h1 className="font-h5 text-black">
              {templateName || "Template Name"}
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              <Button className="bg-secondary-dark hover:bg-secondary-light text-gray-f0 font-button px-2 py-2 h-auto">
                Open in Compose
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-secondary-dark text-secondary-dark size-8"
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
                  <CollectionDropdown onAdd={handleAddCollection} />
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div>
              <h2 className="font-st1 text-black">About</h2>
              <p className="font-b2 text-gray-8c mt-1">
                {aboutText || "Detailed description of the template goes here."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-grow bg-transparent border border-secondary-dark rounded-lg ml-8 p-4 whitespace-pre-wrap font-b2 text-gray-8c overflow-y-auto">
          {bodyText}
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;
