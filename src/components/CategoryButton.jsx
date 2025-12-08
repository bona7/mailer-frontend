import { cn } from "@/lib/utils";

const CategoryButton = ({ children, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-0.5 rounded-[8px] text-xs font-montserrat",
        "font-normal text-[10px] leading-[14px]",
        selected
          ? "bg-primary text-gray-f5"
          : "bg-white text-primary border border-primary",
      )}
    >
      {children}
    </button>
  );
};

export default CategoryButton;
