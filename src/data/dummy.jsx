import { Edit, Mail, Inbox, Send, Trash2 } from "lucide-react";
const sidebarItems = [
  {
    icon: Edit,
    label: "Compose",
    hasSubmenu: false,
  },
  {
    icon: Mail,
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
    icon: Send,
    label: "Sent",
    hasSubmenu: true,
    submenu: ["All sent email", "Draft", "Schedule sent"],
  },
  {
    icon: Trash2,
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

export { sidebarItems, emailList, accountEmails, contacts, aiSummaries };
