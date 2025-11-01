import { Send } from "lucide-react";
import { Inbox, Template, Trash, Compose } from "@/assets";
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
    icon: Send,
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

const accountEmails = [
  { email: "korj03kory@snu.ac.kr", type: "first" },
  { email: "korj03kory@gmail.com", type: "second" },
  { email: "HCI2026@gmail.com", type: "third" },
];

const contacts = [
  "Lewis Hamilton",
  "Carlos Sainz",
  "Charles Leclerc",
  "유지원(서울대 멋사)",
  "김민지(서울대 멋사)",
];

const aiSummaries = [
  {
    to: "To. (    )",
    title: "~~~~~~~~~~~~",
    content: "가나다라마바사아자아",
    date: "2025.09.10",
  },
];

export { sidebarItems, accountEmails, contacts, aiSummaries };
