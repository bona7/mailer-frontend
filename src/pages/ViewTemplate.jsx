import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { TemplateCard, TemplateDetail } from "@/components";
import { Separator } from "@/components/ui/separator";
import { useViewTemplates } from "@/api/hooks/useTemplates";

const ViewTemplate = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // API로부터 템플릿 데이터 가져오기
  const { data: templates = [], isLoading, isError } = useViewTemplates();

  const handleOpenModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    const { main_category } = template;
    if (!acc[main_category]) {
      acc[main_category] = [];
    }
    acc[main_category].push(template);
    return acc;
  }, {});

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  if (isLoading) {
    return (
      <AppLayout
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
      >
        <main className="col-start-2 row-start-2 p-6 space-y-4 bg-gray-f5/40 rounded-lg border border-primary overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <p className="font-b1 text-gray-bf">템플릿을 불러오는 중...</p>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
      >
        <main className="col-start-2 row-start-2 p-6 space-y-4 bg-gray-f5/40 rounded-lg border border-primary overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <p className="font-b1 text-red-500">
              템플릿을 불러오는데 실패했습니다.
            </p>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <main className="col-start-2 row-start-2 p-6 space-y-4 bg-gray-f5/40 rounded-lg border border-primary overflow-y-auto">
        <h1 className="font-h7 text-primary-dark">View Templates</h1>
        <Separator className="bg-gray-bf my-1.5" />
        {Object.entries(groupedTemplates).map(([main_category, templates]) => (
          <section key={main_category}>
            <h2 className="font-st1 text-primary-dark mb-2">{main_category}</h2>
            <div className="flex overflow-x-auto gap-8 p-2">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={{
                    name: template.topic,
                    about: template.sub_category,
                    body: truncate(template.template_content, 100),
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
              template={selectedTemplate}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ViewTemplate;
