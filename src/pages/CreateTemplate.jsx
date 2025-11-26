import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateTemplateModal from "@/components/modals/CreateTemplateModal";

const CreateTemplatePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // For a better user experience, navigate back to the previous page or a default page
    navigate("/mytemplate");
  };

  const handleTemplateCreated = (newTemplate) => {
    console.log("Template created, navigating away:", newTemplate);
    handleCloseModal();
  };

  // If the user somehow navigates to this page with the modal already closed,
  // redirect them. This can happen with browser back/forward buttons.
  useEffect(() => {
    if (!isModalOpen) {
      navigate("/mytemplate");
    }
  }, [isModalOpen, navigate]);

  return (
    <div className="w-full h-dvh bg-gray-f0">
      {isModalOpen && (
        <CreateTemplateModal
          onClose={handleCloseModal}
          onTemplateCreated={handleTemplateCreated}
        />
      )}
    </div>
  );
};

export default CreateTemplatePage;
