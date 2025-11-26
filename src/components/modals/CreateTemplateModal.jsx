import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Dummy function to simulate template creation
const createDummyTemplate = async (templateData) => {
  console.log("Creating dummy template with:", templateData);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return a dummy response
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...templateData,
    created_at: new Date().toISOString(),
  };
};

const CreateTemplateModal = ({ onClose, onTemplateCreated }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: create, isLoading: createLoading } = useMutation({
    mutationFn: createDummyTemplate, // Use the dummy function
    onSuccess: (data) => {
      console.log("Dummy template created:", data);
      // We can still invalidate queries to see how the UI would react
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      if (onTemplateCreated) {
        onTemplateCreated(data);
      }
      onClose();
    },
    onError: (error) => {
      // This is less likely to happen with a dummy function, but good practice
      console.error("Error creating dummy template:", error);
    },
  });

  const handleCreate = () => {
    if (!name || !title || !content) {
      alert("Template name, title, and content are required.");
      return;
    }
    create({
      topic: name,
      sub_category: about,
      title: title,
      template_content: content,
    });
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
            placeholder="Write the brife information about template"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-[36px] rounded-lg border border-secondary-dark p-2 placeholder:text-gray-8c focus:outline-none"
            placeholder="Write the title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-[295px] resize-none rounded-lg border border-secondary-dark p-2 placeholder:text-gray-8c focus:outline-none"
            placeholder="Write the template content"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
