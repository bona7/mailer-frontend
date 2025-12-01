import AppLayout from "@/components/AppLayout";
import TemplateCard from "@/components/TemplateCard";
import TemplateDetail from "@/components/modals/TemplateDetail";
import { Separator } from "@/components/ui/separator";
import CategoryButton from "@/components/CategoryButton";
import CreateTemplateButton from "@/components/CreateTemplateButton";
import CreateTemplateModal from "@/components/modals/CreateTemplateModal";
import { useAccounts } from "@/api/hooks/useAccounts";
import { useMyTemplates } from "@/api/hooks/useTemplates";
import { useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

const MyTemplate = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // 모달 오픈 핸들러 (CreateTemplate)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const { user } = useUser();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  // localStorage에서 user_id(pk, int) 가져오기
  const userPk =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const { data: myTemplates = [], isLoading: templatesLoading } =
    useMyTemplates(userPk);
  const queryClient = useQueryClient();

  // 계정별로 템플릿 그룹화
  const templatesByAccount = useMemo(() => {
    const grouped = {};

    accounts.forEach((account) => {
      grouped[account.id] = {
        account,
        templates: myTemplates.filter(
          (template) => template.email_account?.id === account.id,
        ),
      };
    });

    return grouped;
  }, [accounts, myTemplates]);

  const handleOpenModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleAddSuccess = () => {
    queryClient.invalidateQueries(["myTemplates", userPk]);
    handleCloseModal();
  };

  if (accountsLoading || templatesLoading) {
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

  return (
    <AppLayout
      selectedAccounts={selectedAccounts}
      setSelectedAccounts={setSelectedAccounts}
    >
      <main className="col-start-2 row-start-2 p-6 space-y-4 bg-gray-f5/40 rounded-lg border border-primary overflow-y-auto">
        <h1 className="font-h7 text-primary-dark">My Templates</h1>
        <Separator className="bg-gray-bf my-1.5" />

        {accounts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-b1 text-gray-bf">등록된 계정이 없습니다</p>
          </div>
        ) : (
          accounts.map((account) => (
            <section key={account.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <h2 className="font-st1 text-primary-dark">
                    {account.address}
                  </h2>
                  <div className="flex gap-2">
                    <CategoryButton>대학교</CategoryButton>
                    <CategoryButton>업무/회사</CategoryButton>
                    <CategoryButton>서비스 문의</CategoryButton>
                    <CategoryButton defaultSelected={false}>
                      My Own Template
                    </CategoryButton>
                  </div>
                </div>
                <CreateTemplateButton
                  className="mr-4"
                  onClick={handleOpenCreateModal}
                />
              </div>
              <div className="flex overflow-x-auto gap-8 p-2">
                {templatesByAccount[account.id]?.templates?.length === 0 ? (
                  <p className="font-b2 text-gray-8c py-4">
                    이 계정에 등록된 템플릿이 없습니다
                  </p>
                ) : (
                  templatesByAccount[account.id]?.templates?.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={{
                        name: template.topic,
                        about: template.sub_category,
                        body: template.template_content,
                      }}
                      onClick={() => handleOpenModal(template)}
                    />
                  ))
                )}
              </div>
            </section>
          ))
        )}
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
              onAddSuccess={handleAddSuccess}
            />
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-26/30"
          onClick={handleCloseCreateModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CreateTemplateModal onClose={handleCloseCreateModal} />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default MyTemplate;
