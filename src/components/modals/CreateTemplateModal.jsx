import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTemplate } from "../../api/template"; // Import the actual API function

const CreateTemplateModal = ({
  onClose,
  onTemplateCreated,
  accountId,
  userPk,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: create, isLoading: createLoading } = useMutation({
    mutationFn: createTemplate, // Use the actual API function
    onSuccess: (data) => {
      console.log("✅ Template created successfully:", data);
      console.log("Invalidating queries for userPk:", userPk);
      queryClient.invalidateQueries({ queryKey: ["myTemplates", userPk] });
      if (onTemplateCreated) {
        onTemplateCreated(data);
      }
      onClose();
    },
    onError: (error) => {
      console.error("❌ Error creating template:", error);
      console.error("Error response:", error.response?.data);
      alert(
        "Failed to create template: " +
          (error.response?.data?.detail || error.message),
      );
    },
  });

  const handleCreate = () => {
    if (!name || !title || !content) {
      alert("Template name, title, and content are required.");
      return;
    }
    if (!accountId) {
      alert("계정 정보가 없습니다.");
      return;
    }
    const templateData = {
      email_account_ids: [accountId], // 선택된 계정 ID 전달
      template_title: name,
      main_category: "개인", // My Own Template 카테고리에 표시되도록
      topic: about,
      sub_category: title,
      template_content: content,
    };
    console.log("📤 Sending template data:", templateData);
    create(templateData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="relative flex h-[562px] w-[912px] flex-col rounded-lg bg-gray-fa p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-secondary">
            Create My Template
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[36px] rounded-lg border border-secondary-dark p-2 placeholder:text-gray-8c focus:outline-none"
            placeholder="Templete Name"
          />
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="h-[36px] rounded-lg border border-secondary-dark p-2 placeholder:text-gray-8c focus:outline-none"
            placeholder="Template Category"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-[36px] rounded-lg border border-secondary-dark p-2 placeholder:text-gray-8c focus:outline-none"
            placeholder="Brief Information about Template"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-64 resize-none rounded-lg border border-secondary-dark p-2 placeholder:text-gray-8c focus:outline-none"
            placeholder="Template Content"
          />
        </div>

        {/* Footer with Add button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreate}
            disabled={createLoading}
            className="px-6 py-2 rounded-lg bg-secondary-dark text-white font-semibold hover:bg-secondary-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
