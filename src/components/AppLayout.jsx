import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { logo, X, Contact } from "@/assets";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useAccounts, useDeleteAccount } from "@/api/hooks/useAccounts";

import { useQueries } from "@tanstack/react-query";
import { getEmails } from "@/api/email";
import { Send } from "lucide-react";
import { Inbox, Template, Trash, Compose } from "@/assets";
import { contacts, aiSummaries } from "@/data/sidebar_MainPage.jsx";
import { getAccountColor } from "@/lib/utils";
import MailComposeModal from "@/components/modals/MailComposeModal";

const AppLayout = ({ children, selectedAccounts, setSelectedAccounts }) => {
  // console.log("AppLayout - selectedAccounts:", selectedAccounts);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/?q=${searchQuery}`);
    }
  };

  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();

  const { data: accounts = [], isLoading, isError } = useAccounts();
  // console.log("AppLayout - accounts:", accounts);
  // console.log("AppLayout - accounts 타입:", typeof accounts);
  // console.log("AppLayout - accounts.length:", accounts?.length);
  // console.log("AppLayout - Array.isArray(accounts):", Array.isArray(accounts));
  const deleteAccountMutation = useDeleteAccount();

  const accountsParam =
    selectedAccounts.length > 0
      ? selectedAccounts.map((acc) => acc.address).join(",")
      : accounts.map((acc) => acc.address).join(",");

  const emailCounts = useQueries({
    queries: ["inbox", "starred", "spam"].map((folder) => ({
      queryKey: ["emails", { folder, accounts: accountsParam }],
      queryFn: () => getEmails({ folder, accounts: accountsParam }),
      select: (data) => (Array.isArray(data) ? data.length : 0), // Only select the length
    })),
    combine: (results) => {
      return {
        inbox: results[0].data ?? 0,
        starred: results[1].data ?? 0,
        spam: results[2].data ?? 0,
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });

  const sidebarItems = [
    {
      icon: Compose,
      label: "Compose",
      action: "openComposeModal",
      hasSubmenu: false,
    },
    {
      icon: Inbox,
      label: `Inbox (${emailCounts.isLoading ? "..." : emailCounts.inbox})`,
      path: "/",
      hasSubmenu: true,
      submenu: [
        {
          label: `All email(${emailCounts.isLoading ? "..." : emailCounts.inbox})`,
          path: "/",
        },
        {
          label: `Starred (${emailCounts.isLoading ? "..." : emailCounts.starred})`,
          path: "/starred",
        },
        {
          label: `Spam (${emailCounts.isLoading ? "..." : emailCounts.spam})`,
          path: "/spam",
        },
      ],
    },
    {
      icon: Template,
      label: "Template",
      hasSubmenu: true,
      submenu: [
        { label: "View Templates", path: "/viewtemplate" },
        { label: "My Templates", path: "/mytemplate" },
      ],
    },
    {
      icon: Send,
      label: "Sent",
      hasSubmenu: true,
      submenu: [
        { label: "All sent email", path: "/sent" },
        { label: "Draft", path: "/" },
        { label: "Schedule sent", path: "/" },
      ],
    },
    {
      icon: Trash,
      label: "Trash",
      path: "/trash",
      hasSubmenu: false,
    },
  ];

  const handleAccountClick = (clickedAccount) => {
    setSelectedAccounts((prev) => {
      const isAlreadySelected = prev.some(
        (account) => account.id === clickedAccount.id,
      );

      if (isAlreadySelected) {
        return prev.filter((account) => account.id !== clickedAccount.id);
      } else {
        return [...prev, clickedAccount];
      }
    });
  };

  const handleDeleteAccount = async (e, accountId) => {
    e.stopPropagation(); // 계정 선택 이벤트 방지

    // 삭제할 계정 찾기
    const accountToDelete = accounts.find((acc) => acc.id === accountId);

    if (window.confirm("정말로 이 계정을 삭제하시겠습니까?")) {
      try {
        console.log("계정 삭제 요청 - ID:", accountId);
        await deleteAccountMutation.mutateAsync(accountId);
        console.log("계정 삭제 완료 - ID:", accountId);

        // selectedAccounts에서도 제거 (객체 배열인 경우)
        if (accountToDelete) {
          setSelectedAccounts((prev) =>
            prev.filter((selectedAccount) => selectedAccount.id !== accountId),
          );
          console.log("selectedAccounts에서 제거 완료");
        }
      } catch (error) {
        console.error("계정 삭제 실패:", error);
        console.error("에러 응답:", error.response?.data);
        alert("계정 삭제에 실패했습니다.");
      }
    }
  };

  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  return (
    <div className="relative grid grid-cols-[10rem_1fr_14rem] grid-rows-[auto_1fr] w-full h-dvh gap-x-4 pb-10 md:px-10 lg:px-16 overflow-hidden">
      {/* Header */}
      <header className="col-span-3 grid grid-cols-subgrid items-center py-6">
        <div className="col-start-1">
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-6 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <div className="col-start-2">
          <Input
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full h-8 bg-transparent rounded-md border border-primary placeholder:font-b1"
          />
        </div>
        <div className="col-start-3 flex items-center gap-2 justify-self-end pr-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-xs text-white bg-gray-400">
              {user?.firstName?.[0]?.toUpperCase() ||
                user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <span className="font-h7 text-black whitespace-nowrap">
            {user?.firstName ||
              user?.emailAddresses?.[0]?.emailAddress ||
              "User"}
          </span>
          <Button
            onClick={() => {
              localStorage.removeItem("user_id");
              signOut(() => navigate("/signin"));
            }}
            className="px-0 bg-transparent text-primary font-button hover:bg-transparent hover:text-primary-light"
          >
            sign out
          </Button>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside className="col-start-1 row-start-2 py-4 overflow-y-auto">
        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <Button
                variant="ghost"
                className="justify-start h-auto gap-1 p-0 font-st1 text-primary-dark hover:text-primary hover:bg-transparent"
                onClick={() => {
                  if (item.label === "Compose") {
                    setIsComposeModalOpen(true);
                  } else {
                    navigate(item.path);
                  }
                }}
              >
                <item.icon />
                {item.label}
              </Button>
              {item.hasSubmenu && (
                <div className="flex flex-col gap-1 pl-5">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="font-b2 text-primary-dark cursor-pointer hover:text-primary"
                      onClick={() => navigate(subItem.path)}
                    >
                      {subItem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <div className="relative col-start-2 row-start-2 flex justify-center min-w-0 min-h-0">
        <div className="w-full h-full flex flex-col">
          {children}
          <MailComposeModal
            isOpen={isComposeModalOpen}
            onClose={() => setIsComposeModalOpen(false)}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="col-start-3 row-start-2 space-y-4 flex flex-col overflow-y-auto">
        <Card className="border border-primary">
          <CardHeader className="px-3 py-2">
            <CardTitle className="font-st1 text-primary-dark">
              My Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-1.5">
            {!Array.isArray(accounts) && (
              <div className="text-sm text-red-500 p-2">
                에러: accounts가 배열이 아닙니다. 타입: {typeof accounts}
              </div>
            )}
            {Array.isArray(accounts) && accounts.length === 0 && (
              <div className="text-sm text-gray-bf p-2">
                등록된 계정이 없습니다.
              </div>
            )}
            {Array.isArray(accounts) &&
              accounts.map((account, index) => {
                const isSelected = selectedAccounts.some(
                  (selectedAccount) => selectedAccount.id === account.id,
                );
                return (
                  <button
                    key={index}
                    onClick={() => handleAccountClick(account)}
                    className={`flex items-center gap-1 py-1 w-full rounded-md ${isSelected ? "bg-primary border-transparent" : "border border-gray-bf"}`}
                  >
                    <div
                      className={`!w-2 !h-2 ${getAccountColor(account.address)} rounded ml-1.5`}
                    />
                    <div className="flex items-center justify-between flex-1 overflow-auto scrollbar-hide">
                      <span
                        className={`font-b2 ${isSelected ? "text-gray-f5" : "text-gray-700"}`}
                      >
                        {account.address}
                      </span>
                      <span
                        onClick={(e) => handleDeleteAccount(e, account.id)}
                        className="pr-2 hover:opacity-70 cursor-pointer"
                      >
                        <X className="!size-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            <Button
              className="!mt-3 w-full h-7 text-primary rounded-md bg-transparent hover:bg-transparent hover:text-primary-light"
              onClick={() => navigate("/add-account")}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-primary">
          <CardHeader className="px-3 py-2">
            <CardTitle className="font-st1 text-primary-dark">
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pb-3 pr-3">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-1 py-1">
                <Contact className="w-2.5 h-2.5" />
                <div className="flex items-center justify-between flex-1">
                  <span className="font-b1 text-sm text-black">{contact}</span>
                  <span className="pr-2">
                    <X className="!size-3" />
                  </span>
                </div>
              </div>
            ))}
            <Button className="!mt-3 w-full h-7 text-primary rounded-md bg-transparent hover:bg-transparent hover:text-primary-light">
              <Plus className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-primary overflow-y-auto h-[460px] flex flex-col">
          <CardHeader className="px-3 py-2">
            <CardTitle className="font-st1 text-primary-dark">
              AI Summary
            </CardTitle>
            <span className="font-b2">Title: {aiSummaries[0].title}</span>
          </CardHeader>
          <CardContent className="px-3 space-y-4 grow">
            {aiSummaries.map((summary, index) => (
              <div
                key={index}
                className="p-2 space-y-2 rounded bg-primary-light/30 h-full"
              >
                <div className="flex items-center justify-between">
                  <span className="font-b2 text-black">{summary.to}</span>
                  <span className="font-b2 text-black">{summary.date}</span>
                </div>
                <div className="font-overline text-black">
                  {summary.content}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default AppLayout;
