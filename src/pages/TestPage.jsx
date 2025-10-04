import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, X, User, Plus } from "lucide-react";
import { logo, Template, Trash, Send, Compose, Inbox } from "@/assets";

const TestPage = () => {
  const sidebarItems = [
    {
      icon: Compose,
      label: "Compose",
      hasSubmenu: false,
    },
    {
      icon: Template,
      label: "Template",
      hasSubmenu: true,
      submenu: ["View Templates", "My Templates"],
    },
    {
      icon: Inbox,
      label: "Inbox (8003)",
      hasSubmenu: true,
      submenu: ["All email(8003)", "Starred (70)", "Spam (106)"],
    },
    {
      icon: Send, // Send 더 좋은 아이콘이 있을까....
      label: "Sent",
      hasSubmenu: true,
      submenu: ["All sent email", "Draft", "Schedule sent"],
    },
    {
      icon: Trash,
      label: "Trash",
      hasSubmenu: false,
    },
  ];

  const emailList = [
    {
      sender: "보낸 사람 가나다",
      time: "20:18",
      subject: "제목 및 내용",
      isRead: false,
    },
    {
      sender: "보낸 사람 가나다",
      time: "15:18",
      subject: "제목 및 내용",
      isRead: false,
    },
    {
      sender: "보낸 사람 가나다",
      time: "14:18",
      subject: "제목 및 내용",
      isRead: false,
    },
    {
      sender: "보낸 사람 가나다",
      time: "Sep.13",
      subject: "제목 및 내용",
      isRead: false,
    },
    {
      sender: "보낸 사람 가나다",
      time: "Sep.10",
      subject: "제목 및 내용",
      isRead: false,
    },
    {
      sender: "보낸 사람 가나다",
      time: "20:18",
      subject: "제목 및 내용",
      isRead: false,
    },
  ];

  const accountEmails = [
    { email: "korj03kory@snu.ac.kr", color: "bg-[#c47b7b]" },
    { email: "korj03kory@gmail.com", color: "bg-[#b441cd]" },
    { email: "HCI2026@gmail.com", color: "bg-[#82b657]" },
  ];

  const contacts = [
    "Lewis Hamilton",
    "Carlos Sainz",
    "Charles Leclerc",
    "유지원(서울대 멋사 언정)",
    "김민지(서울대 멋사)",
    "Prof.정의철",
  ];

  const aiSummaries = [
    {
      to: "To. (    )",
      content: "가나다라마바사아자아",
      date: "2025.09.10",
    },
    {
      to: "To. (    )",
      content: "가나다라마바사아자아",
      date: "2025.09.10",
    },
  ];
  return (
    <div className="bg-[#ffffff] w-full min-w-[1512px] min-h-[982px] relative">
      <div className="absolute top-0 left-0 w-full h-full bg-primary-light opacity-30" />

      <header className="flex items-center px-[60px] pt-[41px] pb-[16px] relative z-10">
        <img src={logo} alt="Logo" className="w-[113px] h-[24px] mr-[38px]" />

        <div className="flex-1 max-w-[1014px]">
          <Input
            placeholder="search"
            className="w-full h-[30px] bg-[#f5f5f566] rounded-md border border-primary placeholder:font-b2"
          />
        </div>

        <div className="flex items-center gap-2 ml-[72px]">
          <Avatar className="w-[26px] h-[26px]">
            <AvatarFallback className="bg-[#898989] text-white text-xs">
              RK
            </AvatarFallback>
          </Avatar>
          <span className="font-h7 font-[number:var(--h7-font-weight)] text-[#000000] text-[length:var(--h7-font-size)] tracking-[var(--h7-letter-spacing)] leading-[var(--h7-line-height)] whitespace-nowrap [font-style:var(--h7-font-style)]">
            Raina Kim
          </span>
          {/* 프로필 옆 아이콘 변경 */}
          <ChevronDown className="w-[11.48px] h-2.5" />
        </div>
      </header>

      <div className="flex relative z-10">
        <aside className="w-[196px] pl-[63px] py-[16px] mr-[16px]">
          <nav className="flex flex-col gap-4">
            {sidebarItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <Button
                  variant="ghost"
                  className="justify-start gap-1 h-auto p-0 font-st1 font-[number:var(--st1-font-weight)] text-[#000000] text-[length:var(--st1-font-size)] tracking-[var(--st1-letter-spacing)] leading-[var(--st1-line-height)] [font-style:var(--st1-font-style)]
                  hover:text-primary hover:bg-transparent"
                >
                  <item.icon />
                  {item.label}
                </Button>
                {item.hasSubmenu && (
                  <div className="flex flex-col gap-1 pl-[20px]">
                    {item.submenu.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="font-b2 font-[number:var(--b2-font-weight)] text-[#000000] text-[length:var(--b2-font-size)] tracking-[var(--b2-letter-spacing)] leading-[var(--b2-line-height)] [font-style:var(--b2-font-style)] cursor-pointer hover:text-app-primary"
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

        <main className="flex-1 max-w-[1014px] bg-[#f5f5f566] rounded-[8px_8px_0px_0px] border border-primary mr-4">
          <div className="p-4">
            <h2 className="font-h7 font-[number:var(--h7-font-weight)] text-primary-dark text-[length:var(--h7-font-size)] tracking-[var(--h7-letter-spacing)] leading-[var(--h7-line-height)] [font-style:var(--h7-font-style)] mb-4">
              In box
            </h2>

            <Separator className="mb-4" />

            <div className="space-y-2">
              {emailList.map((email, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-4 py-1">
                    <div className="w-2 h-2 bg-[#82b658] rounded" />
                    <div className="w-[100px] font-b2 font-[number:var(--b2-font-weight)] text-x-1f text-[length:var(--b2-font-size)] tracking-[var(--b2-letter-spacing)] leading-[var(--b2-line-height)] [font-style:var(--b2-font-style)]">
                      {email.sender}
                    </div>
                    <div className="w-[42px] font-b2 font-[number:var(--b2-font-weight)] text-x-1f text-[length:var(--b2-font-size)] tracking-[var(--b2-letter-spacing)] leading-[var(--b2-line-height)] [font-style:var(--b2-font-style)]">
                      {email.time}
                    </div>
                    <div className="flex-1 font-b2 font-[number:var(--b2-font-weight)] text-x-1f text-[length:var(--b2-font-size)] tracking-[var(--b2-letter-spacing)] leading-[var(--b2-line-height)] [font-style:var(--b2-font-style)]">
                      {email.subject}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="w-[216px] space-y-4 mr-[48px]">
          <Card className="border border-primary">
            <CardHeader className="px-3 py-2">
              <CardTitle className="text-primary-dark font-st1 font-[number:var(--st1-font-weight)] text-[length:var(--st1-font-size)] tracking-[var(--st1-letter-spacing)] leading-[var(--st1-line-height)] [font-style:var(--st1-font-style)]">
                My Account
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 space-y-2">
              {accountEmails.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border border-[#BFBFBF] rounded-[6px] p-1"
                >
                  <div className={`w-2 h-2 ${account.color} rounded`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-b2 font-[number:var(--b2-font-weight)] text-x-26 text-[length:var(--b2-font-size)] tracking-[var(--b2-letter-spacing)] leading-[var(--b2-line-height)] [font-style:var(--b2-font-style)]">
                      {account.email}
                    </span>
                    {index === 2 && (
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button className="w-full h-7 bg-app-primary text-white rounded-md">
                <Plus className="w-4 h-4 mr-1" />
                Add Account
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-primary">
            <CardHeader className="px-3 py-2">
              <CardTitle className="text-primary-dark font-st1 font-[number:var(--st1-font-weight)] text-[length:var(--st1-font-size)] tracking-[var(--st1-letter-spacing)] leading-[var(--st1-line-height)] [font-style:var(--st1-font-style)]">
                Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-1">
                  <User className="w-2.5 h-2.5" />
                  {/* span 아래에 있는 텍스트... 크기 조정... (b1으로 하니까 넘침) */}
                  <span className="font-b1 font-[number:var(--b1-font-weight)] text-[#000000] text-[14px] tracking-[var(--b1-letter-spacing)] leading-[var(--b1-line-height)] [font-style:var(--b1-font-style)]">
                    {contact}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-primary bg-[#fafafa]">
            <CardHeader className="px-3 py-2">
              <CardTitle className="text-primary-dark font-st1 font-[number:var(--st1-font-weight)] text-[length:var(--st1-font-size)] tracking-[var(--st1-letter-spacing)] leading-[var(--st1-line-height)] [font-style:var(--st1-font-style)]">
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 space-y-4">
              {aiSummaries.map((summary, index) => (
                <div
                  key={index}
                  className="bg-[#a4bde33d] rounded p-2 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-b2 font-[number:var(--b2-font-weight)] text-[#000000] text-[length:var(--b2-font-size)] tracking-[var(--b2-letter-spacing)] leading-[var(--b2-line-height)] [font-style:var(--b2-font-style)]">
                      {summary.to}
                    </span>
                    <span className="font-b2 font-[number:var(--b2-font-weight)] text-[#000000] text-[length:var(--b2-font-size)] tracking-[var(--b2-letter-spacing)] leading-[var(--b2-line-height)] [font-style:var(--b2-font-style)]">
                      {summary.date}
                    </span>
                  </div>
                  <div className="font-OVERLINE font-[number:var(--OVERLINE-font-weight)] text-[#000000] text-[length:var(--OVERLINE-font-size)] tracking-[var(--OVERLINE-letter-spacing)] leading-[var(--OVERLINE-line-height)] [font-style:var(--OVERLINE-font-style)]">
                    {summary.content}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default TestPage;
