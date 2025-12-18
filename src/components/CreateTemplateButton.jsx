import { cn } from "@/lib/utils";

const CreateTemplateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-1 rounded-[8px] border border-secondary-dark text-secondary-dark",
        "font-montserrat font-semibold text-[11px] leading-[1.2189999493685635em]",
        className,
      )}
      {...props}
    >
      Create own template
    </button>
  );
};

export default CreateTemplateButton;
