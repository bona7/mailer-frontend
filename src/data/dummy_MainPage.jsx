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

const emailList = [
  {
    id: 0,
    sender: "보낸 사람 가나디",
    time: "20:18",
    title: "제목",
    content:
      "안녕하세요. \n이것은 테스트 이메일입니다. \n세부 내용을 확인해주세요.",
    account: "first",
  },
  {
    id: 1,
    sender: "보낸 사람 라마바",
    time: "15:18",
    title: "다른 제목",
    content:
      "두 번째 이메일입니다. \n새로운 정보가 있습니다. \n확인 부탁드립니다.",
    account: "second",
  },
  {
    id: 2,
    sender: "보낸 사람 사아자",
    time: "14:18",
    title: "또 다른 제목",
    content:
      "세 번째 이메일입니다. \n중요한 공지사항이 있습니다. \n놓치지 마세요.",
    account: "third",
  },
  {
    id: 3,
    sender: "보낸 사람 차카타",
    time: "Sep.13",
    title: "하나 더",
    content:
      "네 번째 이메일입니다. \n프로젝트 업데이트에 대한 내용입니다. \n자세한 내용은 첨부 파일을 참조하세요.",
    account: "first",
  },
  {
    id: 4,
    sender: "보낸 사람 파하",
    time: "Sep.10",
    title: "마지막 제목",
    content: "마지막 이메일입니다. \n피드백 요청드립니다. \n의견을 보내주세요.",
    account: "first",
  },
  {
    id: 5,
    sender: "보낸 사람 하가나",
    time: "11:42",
    title: "회의 결과 공유",
    content:
      "안녕하세요. \n어제 회의 결과를 공유드립니다. \n주요 결정사항은 다음과 같습니다. \n1) 신규 기능 개발 일정 확정 \n2) 예산 조정 승인 \n3) 마케팅 캠페인 일정 변경 \n자세한 내용은 첨부 문서를 참고해주세요.",
    account: "third",
  },
  {
    id: 6,
    sender: "보낸 사람 다라마",
    time: "10:05",
    title: "신규 프로젝트 제안서",
    content:
      "안녕하세요. \n신규 프로젝트 제안서를 전달드립니다. \n이번 프로젝트는 사용자 경험 개선에 초점을 맞추고 있습니다. \n프로토타입 검토 후 피드백 부탁드립니다. \n검토 마감일은 다음 주 수요일입니다.",
    account: "third",
  },
  {
    id: 7,
    sender: "보낸 사람 바사아",
    time: "09:30",
    title: "팀 일정 변경 안내",
    content:
      "안녕하세요 팀원 여러분, \n이번 주 일정에 일부 변경이 있습니다. \n회의 시간이 기존 2시에서 4시로 변경되었으며, \n장소는 온라인(ZOOM)으로 진행됩니다. \n일정표를 최신 버전으로 업데이트했습니다.",
    account: "second",
  },
  {
    id: 8,
    sender: "보낸 사람 자차카",
    time: "Aug.25",
    title: "고객 설문조사 결과",
    content:
      "안녕하세요. \n고객 설문조사 결과를 공유드립니다. \n만족도는 82%로 나타났으며, 주요 개선 요청은 ‘응답 속도 향상’이었습니다. \n해당 내용을 반영해 다음 분기 계획을 수립 중입니다.",
    account: "first",
  },
  {
    id: 9,
    sender: "보낸 사람 타파하",
    time: "Aug.11",
    title: "시스템 점검 일정",
    content:
      "안녕하세요. \n시스템 점검 일정을 안내드립니다. \n8월 15일(목) 오전 2시부터 5시까지 서비스가 일시 중단됩니다. \n불편을 드려 죄송합니다. \n안정적인 서비스를 위해 최선을 다하겠습니다.",
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
