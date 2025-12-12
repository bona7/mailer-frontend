import { Checkbox } from "@/components/ui/checkbox";
import { getAccountColor } from "@/lib/utils";

const MailList = ({
  sender,
  time,
  title,
  content,
  account,
  onClick,
  checked,
  onCheckChange,
  isRead,
}) => {
  const accountColor = getAccountColor(account);
  const mailId = `${sender}-${time}-${title}`;

  return (
    <div
      className={`w-full cursor-pointer hover:bg-gray-f5 pt-4 `}
      onClick={onClick}
    >
      <div className="flex items-center gap-2.5 pb-1">
        <div className="ml-1.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckChange}
            size="med"
          />
        </div>
        <div className="flex items-center gap-2 w-40">
          <div>
            <div className={`w-2 h-2 rounded-full ${accountColor}`} />
          </div>
          <span className="font-semibold text-sm text-gray-59 truncate">
            {sender}
          </span>
        </div>

        <div className="flex-1 truncate">
          <span className="font-semibold text-sm text-gray-59">{title}</span>
          <span className="text-sm text-gray-8c overflow-hidden whitespace-nowrap text-ellipsis">
            {" "}
            {content}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-59 pr-2">
          <span>{time}</span>
          <div className="flex items-center gap-1">
            <Checkbox id={mailId} size="sm" />
            <label className="text-sm font-medium">AI Sum.</label>
          </div>
        </div>
      </div>
      <hr className="border-gray-bf" />
    </div>
  );
};

export default MailList;
