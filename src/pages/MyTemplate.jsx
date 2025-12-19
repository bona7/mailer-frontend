import AppLayout from "@/components/AppLayout";
import TemplateCard from "@/components/TemplateCard";
import TemplateDetail from "@/components/modals/TemplateDetail";
import MailComposeModal from "@/components/modals/MailComposeModal";
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
import api from "@/app/axios"; // Add this import statement

const ALL_CATEGORIES = [
  "대학교",
  "업무/회사",
  "서비스 문의",
  "My Own Template",
];
const CATEGORY_MAP = {
  "My Own Template": "개인 템플릿",
};

const MyTemplate = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [categoriesByAccount, setCategoriesByAccount] = useState({});
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [composeTemplateBody, setComposeTemplateBody] = useState("");

  // 모달 오픈 핸들러 (CreateTemplate)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const handleOpenCreateModal = (accountId) => {
    setSelectedAccountId(accountId);
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedAccountId(null);
  };

  const { user } = useUser();
  const [userPk, setUserPk] = useState(
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null,
  );

  useEffect(() => {
    const fetchUserPk = async () => {
      let currentPk =
        typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
      if (!currentPk) {
        try {
          console.log(
            "MyTemplate: user_id not in localStorage, fetching from /api/user/me/",
          );
          const response = await api.get("/user/me/");
          currentPk = response.data.id;
          if (currentPk) {
            localStorage.setItem("user_id", currentPk);
            console.log(
              "MyTemplate: successfully fetched and set user_id:",
              currentPk,
            );
          }
        } catch (error) {
          console.error("MyTemplate: Failed to fetch user details", error);
        }
      }
      setUserPk(currentPk);
    };

    if (user) {
      // Only run if clerk user is loaded
      fetchUserPk();
    }
  }, [user]);

  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: myTemplates = [], isLoading: templatesLoading } =
    useMyTemplates(userPk);
  const queryClient = useQueryClient();

  // myTemplates 변경 감지
  useEffect(() => {
    console.log("📋 myTemplates updated:", myTemplates);
    console.log("Total templates count:", myTemplates.length);
    if (myTemplates.length > 0) {
      console.log(
        "첫 번째 템플릿 구조:",
        JSON.stringify(myTemplates[0], null, 2),
      );
      console.log(
        "마지막 템플릿 구조:",
        JSON.stringify(myTemplates[myTemplates.length - 1], null, 2),
      );
    }
  }, [myTemplates]);

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

    console.log("=== 템플릿 필터링 디버그 ===");
    console.log("전체 템플릿:", myTemplates);
    console.log("계정 목록:", accounts);
    console.log("카테고리 설정:", categoriesByAccount);

    accounts.forEach((account) => {
      const activeCategories = categoriesByAccount[account.id] || [];
      const activeMappedCategories = activeCategories.map(
        (c) => CATEGORY_MAP[c] || c,
      );

      const filteredTemplates = myTemplates.filter((template) => {
        const matchAccount = template.email_account?.id === account.id;
        const matchCategory = activeMappedCategories.includes(
          template.main_category,
        );

        console.log(`템플릿 ${template.id}:`, {
          email_account_id: template.email_account?.id,
          account_id: account.id,
          matchAccount,
          main_category: template.main_category,
          activeMappedCategories,
          matchCategory,
        });

        return matchAccount && matchCategory;
      });

      grouped[account.id] = {
        account,
        templates: filteredTemplates,
      };
    });

    console.log("그룹화 결과:", grouped);
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

  const handleCompose = (template) => {
    console.log("📧 Compose clicked, template:", template);
    const bodyText = template.template_content || template.body || "";
    console.log("Template body:", bodyText);
    setComposeTemplateBody(bodyText);
    setIsComposeModalOpen(true);
    handleCloseModal(); // TemplateDetail 모달 닫기
    console.log("isComposeModalOpen set to true");
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
      <main className="col-start-2 row-start-2 px-6 space-y-4 rounded-lg border border-primary overflow-y-auto">
        <div className="sticky top-0 z-10 pt-4 bg-456FB1/65 backdrop-blur-sm">
          <h1 className="font-h7 text-primary-dark">My Templates</h1>
          <Separator className="bg-gray-bf my-1.5" />
        </div>
        <div className="pt-4 pb-6">
          {accounts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-b1 text-gray-bf">등록된 계정이 없습니다</p>
            </div>
          ) : (
            accounts.map((account) => (
              <section key={account.id}>
                <div className="flex [@media(max-width:1000px)]:flex-col [@media(min-width:1000px)]:flex-row [@media(min-width:1000px)]:items-center [@media(min-width:1000px)]:justify-between mb-4 gap-2">
                  <div className="flex [@media(max-width:1000px)]:flex-col [@media(min-width:1000px)]:flex-row [@media(min-width:1000px)]:items-center gap-4 w-full">
                    <h2 className="font-st1 text-primary-dark whitespace-nowrap">
                      {account.address}
                    </h2>
                    <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
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
                    onClick={() => handleOpenCreateModal(account.id)}
                  />
                </div>
                <div className="flex overflow-x-auto gap-8 p-2">
                  {templatesByAccount[account.id]?.templates?.length === 0 ? (
                    <p className="font-b2 text-gray-8c py-4">
                      이 계정에 해당하는 템플릿이 없습니다.
                    </p>
                  ) : (
                    templatesByAccount[account.id]?.templates?.map(
                      (template) => (
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
                      ),
                    )
                  )}
                </div>
              </section>
            ))
          )}
        </div>
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
              onCompose={handleCompose}
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
            <CreateTemplateModal
              onClose={handleCloseCreateModal}
              accountId={selectedAccountId}
              userPk={userPk}
            />
          </div>
        </div>
      )}

      {isComposeModalOpen && (
        <>
          {console.log(
            "👀 Rendering MailComposeModal, isComposeModalOpen:",
            isComposeModalOpen,
          )}
          <MailComposeModal
            isOpen={isComposeModalOpen}
            onClose={() => setIsComposeModalOpen(false)}
            initialBody={composeTemplateBody}
          />
        </>
      )}
    </AppLayout>
  );
};

export default MyTemplate;
