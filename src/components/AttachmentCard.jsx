import AttachmentIcon from "@/assets/attachment.svg?react";

const AttachmentCard = ({ fileName, downloadUrl }) => {
  return (
    <a
      href={downloadUrl}
      download
      className="flex items-center gap-1 p-2.5 bg-gray-f5/50 border border-gray-bf rounded-lg hover:bg-gray-f5 transition-colors"
      title={`Download ${fileName}`}
    >
      <AttachmentIcon className="h-5 text-gray-8c flex-shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="font-b2 text-gray-1f truncate">{fileName}</span>
      </div>
    </a>
  );
};

export default AttachmentCard;
