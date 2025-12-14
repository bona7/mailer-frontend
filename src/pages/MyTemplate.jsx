import AppLayout from "@/components/AppLayout";
import TemplateCard from "@/components/TemplateCard";
import TemplateDetail from "@/components/modals/TemplateDetail";
import { Separator } from "@/components/ui/separator";
import CategoryButton from "@/components/CategoryButton";
import CreateTemplateButton from "@/components/CreateTemplateButton";
import CreateTemplateModal from "@/components/modals/CreateTemplateModal";
import { useAccounts } from "@/api/hooks/useAccounts";
import { useMyTemplates, useDeleteMyTemplate } from "@/api/hooks/useTemplates";
import { useState, useMemo, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { Refresh } from "@/assets"; // Refresh SVG 컴포넌트 import

const ALL_CATEGORIES = [
  "대학교",
  "업무/회사",
  "서비스 문의",
  "My Own Template",
];
const CATEGORY_MAP = {
  "My Own Template": "개인",
};

const MyTemplate = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [categoriesByAccount, setCategoriesByAccount] = useState({});

  // 모달 오픈 핸들러 (CreateTemplate)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const { user } = useUser();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const userPk =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const { data: myTemplates = [], isLoading: templatesLoading } =
    useMyTemplates(userPk);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (accounts.length > 0) {
      const initialCategories = {};
      accounts.forEach((account) => {
        initialCategories[account.id] = ALL_CATEGORIES;
      });
      setCategoriesByAccount(initialCategories);
    }
  }, [accounts]);

  const deleteTemplateMutation = useDeleteMyTemplate();

  const handleCategoryToggle = (accountId, category) => {
    setCategoriesByAccount((prev) => {
      const currentCategories = prev[accountId] || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter((c) => c !== category)
        : [...currentCategories, category];
      return { ...prev, [accountId]: newCategories };
    });
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("템플릿을 삭제하시겠습니까?")) {
      deleteTemplateMutation.mutate(templateId, {
        onSuccess: () => {},
        onError: (error) => {
          console.error("템플릿 삭제 실패:", error);
          alert("템플릿 삭제에 실패했습니다.");
        },
      });
    }
  };

  const handleRefreshTemplates = () => {
    queryClient.invalidateQueries({ queryKey: ["myTemplates", userPk] });
  };

  // 계정별 + 카테고리별로 템플릿 그룹화 및 필터링
  const templatesByAccount = useMemo(() => {
    const grouped = {};

    accounts.forEach((account) => {
      const activeCategories = categoriesByAccount[account.id] || [];
      const activeMappedCategories = activeCategories.map(
        (c) => CATEGORY_MAP[c] || c,
      );

      grouped[account.id] = {
        account,
        templates: myTemplates.filter(
          (template) =>
            template.email_account?.id === account.id &&
            activeMappedCategories.includes(template.main_category),
        ),
      };
    });

    return grouped;
  }, [accounts, myTemplates, categoriesByAccount]);

  const handleOpenModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["myTemplates", userPk] });
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
        <div className="sticky top-0 z-10 flex items-center gap-2 bg-gray-f5/40">
          <h1 className="font-h7 text-primary-dark">My Templates</h1>
          <button
            onClick={handleRefreshTemplates}
            disabled={templatesLoading}
            className="p-0 bg-transparent border-none cursor-pointer disabled:opacity-50"
            title="새로고침"
          >
            <Refresh
              className={`w-4 h-4 ${templatesLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
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
                    {ALL_CATEGORIES.map((category) => (
                      <CategoryButton
                        key={category}
                        selected={(
                          categoriesByAccount[account.id] || []
                        ).includes(category)}
                        onClick={() =>
                          handleCategoryToggle(account.id, category)
                        }
                      >
                        {category}
                      </CategoryButton>
                    ))}
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
                    이 계정에 해당하는 템플릿이 없습니다.
                  </p>
                ) : (
                  templatesByAccount[account.id]?.templates?.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={{
                        id: template.id,
                        name: template.topic,
                        about: template.sub_category,
                        body: template.template_content,
                        main_category: template.main_category,
                      }}
                      onClick={() => handleOpenModal(template)}
                      isFavorited={true}
                      onHeartClick={() => handleDeleteTemplate(template.id)}
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
