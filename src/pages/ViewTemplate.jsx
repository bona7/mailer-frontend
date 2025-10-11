import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { TemplateCard, TemplateDetail } from "@/components";
import { Separator } from "@/components/ui/separator";

// Placeholder for dummy data
const templates = [
  { id: 1, name: "템플릿 이름 1", about: "설명 1", authorName: "Author 1" },
  { id: 2, name: "템플릿 이름 2", about: "설명 2", authorName: "Author 2" },
  { id: 3, name: "템플릿 이름 3", about: "설명 3", authorName: "Author 3" },
  { id: 4, name: "템플릿 이름 4", about: "설명 4", authorName: "Author 4" },
  { id: 5, name: "템플릿 이름 5", about: "설명 5", authorName: "Author 5" },
  { id: 6, name: "템플릿 이름 6", about: "설명 6", authorName: "Author 6" },
  { id: 7, name: "템플릿 이름 7", about: "설명 7", authorName: "Author 7" },
  { id: 8, name: "템플릿 이름 8", about: "설명 8", authorName: "Author 8" },
  { id: 9, name: "템플릿 이름 9", about: "설명 9", authorName: "Author 9" },
  { id: 10, name: "템플릿 이름 10", about: "설명 10", authorName: "Author 10" },
  { id: 11, name: "템플릿 이름 11", about: "설명 11", authorName: "Author 11" },
  { id: 12, name: "템플릿 이름 12", about: "설명 12", authorName: "Author 12" },
  { id: 13, name: "템플릿 이름 13", about: "설명 13", authorName: "Author 13" },
  { id: 14, name: "템플릿 이름 14", about: "설명 14", authorName: "Author 14" },
  { id: 15, name: "템플릿 이름 15", about: "설명 15", authorName: "Author 15" },
  { id: 16, name: "템플릿 이름 16", about: "설명 16", authorName: "Author 16" },
  { id: 17, name: "템플릿 이름 17", about: "설명 17", authorName: "Author 17" },
  { id: 18, name: "템플릿 이름 18", about: "설명 18", authorName: "Author 18" },
];

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

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <main className="col-start-2 row-start-2 p-6 space-y-4 bg-gray-f5/40 rounded-lg border border-primary overflow-hidden">
        <h1 className="font-h7 text-primary-dark">View Templates</h1>
        <Separator className="bg-gray-bf my-1.5" />
        <section>
          <h2 className="font-st2 text-primary-dark mb-2">상황 설명1</h2>
          <div className="flex overflow-x-auto gap-8 p-2">
            {templates.slice(0, 6).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={handleOpenModal}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-st2 text-primary-dark mb-2">상황 설명2</h2>
          <div className="flex overflow-x-auto gap-8 p-2">
            {templates.slice(6, 12).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={handleOpenModal}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-st2 text-primary-dark mb-2">상황 설명3</h2>
          <div className="flex overflow-x-auto gap-8 p-2">
            {templates.slice(12, 18).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={handleOpenModal}
              />
            ))}
          </div>
        </section>
      </main>

      {isModalOpen && selectedTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-26/30"
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TemplateDetail
              templateName={selectedTemplate.name}
              authorName={selectedTemplate.authorName}
              aboutText={selectedTemplate.about}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ViewTemplate;
