import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function TrashButton({ text, onClick, className = "" }) {
  return (
    <Button
      variant="outline"
      className={
        "flex items-center justify-center gap-1 px-1.5 py-0.5 h-auto rounded-md border border-black font-bt text-primary-dark leading-6 bg-transparent " +
        cn(" ", className)
      }
      onClick={onClick}
    >
      <span>{text}</span>
    </Button>
  );
}

export default TrashButton;
