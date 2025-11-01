import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { TemplateCard, TemplateDetail } from "@/components";
import { Separator } from "@/components/ui/separator";
import { templates } from "@/data/dummy_templates";

const ViewTemplate = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleOpenModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    const { mainCategory } = template;
    if (!acc[mainCategory]) {
      acc[mainCategory] = [];
    }
    acc[mainCategory].push(template);
    return acc;
  }, {});

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <main className="col-start-2 row-start-2 p-6 space-y-4 bg-gray-f5/40 rounded-lg border border-primary overflow-y-auto">
        <h1 className="font-h7 text-primary-dark">View Templates</h1>
        <Separator className="bg-gray-bf my-1.5" />
        {Object.entries(groupedTemplates).map(([mainCategory, templates]) => (
          <section key={mainCategory}>
            <h2 className="font-st1 text-primary-dark mb-2">{mainCategory}</h2>
            <div className="flex overflow-x-auto gap-8 p-2">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={{
                    name: template.topic,
                    about: template.subCategory,
                    body: truncate(template.body, 100),
                  }}
                  onClick={() => handleOpenModal(template)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {isModalOpen && selectedTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-26/30"
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TemplateDetail
              templateName={selectedTemplate.topic}
              aboutText={selectedTemplate.subCategory}
              bodyText={selectedTemplate.body}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ViewTemplate;
