import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { logo, X, Contact } from "@/assets";

import {
  sidebarItems,
  accountEmails,
  contacts,
  aiSummaries,
} from "@/data/dummy_MainPage.jsx";
import { getAccountColor } from "@/lib/utils";

const AppLayout = ({ children, selectedAccounts, setSelectedAccounts }) => {
  const handleAccountClick = (accountType) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountType)
        ? prev.filter((t) => t !== accountType)
        : [...prev, accountType],
    );
  };

  return (
    <div className="relative grid grid-cols-[10rem_1fr_14rem] grid-rows-[auto_1fr] w-full min-h-dvh gap-x-4 pb-10 md:px-10 lg:px-16">
      {/* Header */}
      <header className="col-span-3 grid grid-cols-subgrid items-center py-6">
        <div className="col-start-1">
          <img src={logo} alt="Logo" className="w-28 h-6" />
        </div>
        <div className="col-start-2">
          <Input
            placeholder="search"
            className="w-full h-8 bg-transparent rounded-md border border-primary placeholder:font-b1"
          />
        </div>
        <div className="col-start-3 flex items-center gap-2 justify-self-end pr-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-xs text-white bg-gray-400">
              RK
            </AvatarFallback>
          </Avatar>
          <span className="font-h7 text-black whitespace-nowrap">
            Raina Kim
          </span>
          <Button className="px-0 bg-transparent text-primary font-button hover:bg-transparent hover:text-primary-light ">
            sign out
          </Button>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside className="col-start-1 row-start-2 py-4">
        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <Button
                variant="ghost"
                className="justify-start h-auto gap-1 p-0 font-st1 text-primary-dark hover:text-primary hover:bg-transparent"
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
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {children}

      {/* Right Sidebar */}
      <aside className="col-start-3 row-start-2 space-y-4 flex flex-col">
        <Card className="border border-primary">
          <CardHeader className="px-3 py-2">
            <CardTitle className="font-st1 text-primary-dark">
              My Account
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-1.5">
            {accountEmails.map((account, index) => {
              const isSelected = selectedAccounts.includes(account.type);
              return (
                <button
                  key={index}
                  onClick={() => handleAccountClick(account.type)}
                  className={`flex items-center gap-1 py-1 w-full rounded-md ${isSelected ? "bg-primary border-transparent" : "border border-gray-bf"}`}
                >
                  <div
                    className={`w-2 h-2 ${getAccountColor(account.type)} rounded ml-1.5`}
                  />
                  <div className="flex items-center justify-between flex-1">
                    <span
                      className={`font-b2 ${isSelected ? "text-gray-f5" : "text-gray-700"}`}
                    >
                      {account.email}
                    </span>
                    <span className="pr-2">
                      <X className="!size-3" />
                    </span>
                  </div>
                </button>
              );
            })}
            <Button className="!mt-3 w-full h-7 text-primary rounded-md bg-transparent hover:bg-transparent hover:text-primary-light">
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
          <CardContent className="space-y-1">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-1">
                <Contact className="w-2.5 h-2.5" />
                <span className="font-b1 text-sm text-black">{contact}</span>
              </div>
            ))}
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
