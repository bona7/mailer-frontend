import { useState } from "react";
import { cn } from "@/lib/utils";

const CategoryButton = ({ children, defaultSelected = true }) => {
  const [isSelected, setIsSelected] = useState(defaultSelected);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-2 py-0.5 rounded-[8px] text-xs font-montserrat",
        "font-normal text-[10px] leading-[14px]",
        isSelected
          ? "bg-primary text-gray-f5"
          : "bg-white text-primary border border-primary",
      )}
    >
      {children}
    </button>
  );
};

export default CategoryButton;
