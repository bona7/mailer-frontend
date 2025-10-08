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
    title: "제목",
    content: "내용",
    account: "first",
  },
  {
    sender: "보낸 사람 라마바",
    time: "15:18",
    title: "다른 제목",
    content: "다른 내용",
    account: "second",
  },
  {
    sender: "보낸 사람 사아자",
    time: "14:18",
    title: "또 다른 제목",
    content: "또 다른 내용",
    account: "third",
  },
  {
    sender: "보낸 사람 차카타",
    time: "Sep.13",
    title: "하나 더",
    content: "내용입니다",
    account: "first",
  },
  {
    sender: "보낸 사람 파하",
    time: "Sep.10",
    title: "마지막 제목",
    content: "마지막 내용",
    account: "second",
  },
];

const accountEmails = [
  { email: "korj03kory@snu.ac.kr", type: "first" },
  { email: "korj03kory@gmail.com", type: "second" },
  { email: "HCI2026@gmail.com", type: "third" },
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
    title: "~~~~~~~~~~~~",
    content: "가나다라마바사아자아",
    date: "2025.09.10",
  },
];

export { sidebarItems, emailList, accountEmails, contacts, aiSummaries };
