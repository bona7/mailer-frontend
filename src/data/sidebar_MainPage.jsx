import { Send } from "lucide-react";
import { Inbox, Template, Trash, Compose } from "@/assets";
const sidebarItems = [
  {
    icon: Compose,
    label: "Compose",
    action: "openComposeModal",
    hasSubmenu: false,
  },
  {
    icon: Inbox,
    label: "Inbox (8003)",
    path: "/",
    hasSubmenu: true,
    submenu: [
      { label: "All email(8003)", path: "/" },
      { label: "Starred (70)", path: "/starred" },
      { label: "Spam (106)", path: "/spam" },
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

const contacts = [
  "bona718@snu.ac.kr",
  "korj03kory@snu.ac.kr",
  "dongin1001@snu.ac.kr",
  "ajy1216@snu.ac.kr",
  "jdnjsyoo@snu.ac.kr",
];

const aiSummaries = [
  {
    to: "To. (    )",
    title: "~~~~~~~~~~~~",
    content: "가나다라마바사아자아",
    date: "2025.09.10",
  },
];

export { sidebarItems, contacts, aiSummaries };
