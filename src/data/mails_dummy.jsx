const allMails = [
  {
    id: 0,
    sender: "보낸 사람 가나디",
    time: "20:18",
    title: "제목",
    content:
      "안녕하세요. \n이것은 테스트 이메일입니다. \n세부 내용을 확인해주세요.",
    account: "first",
    folder: "inbox",
  },
  {
    id: 1,
    sender: "보낸 사람 라마바",
    time: "15:18",
    title: "다른 제목",
    content:
      "두 번째 이메일입니다. \n새로운 정보가 있습니다. \n확인 부탁드립니다.",
    account: "second",
    folder: "inbox",
  },
  {
    id: 2,
    sender: "보낸 사람 사아자",
    time: "14:18",
    title: "또 다른 제목",
    content:
      "세 번째 이메일입니다. \n중요한 공지사항이 있습니다. \n놓치지 마세요.",
    account: "third",
    folder: "inbox",
  },
  {
    id: 3,
    sender: "보낸 사람 차카타",
    time: "Sep.13",
    title: "하나 더",
    content:
      "네 번째 이메일입니다. \n프로젝트 업데이트에 대한 내용입니다. \n자세한 내용은 첨부 파일을 참조하세요.",
    account: "first",
    folder: "inbox",
  },
  {
    id: 4,
    sender: "보낸 사람 파하",
    time: "Sep.10",
    title: "마지막 제목",
    content: "마지막 이메일입니다. \n피드백 요청드립니다. \n의견을 보내주세요.",
    account: "first",
    folder: "inbox",
  },
  {
    id: 5,
    sender: "보낸 사람 하가나",
    time: "11:42",
    title: "회의 결과 공유",
    content:
      "안녕하세요. \n어제 회의 결과를 공유드립니다. \n주요 결정사항은 다음과 같습니다. \n1) 신규 기능 개발 일정 확정 \n2) 예산 조정 승인 \n3) 마케팅 캠페인 일정 변경 \n자세한 내용은 첨부 문서를 참고해주세요.",
    account: "third",
    folder: "inbox",
  },
  {
    id: 6,
    sender: "보낸 사람 다라마",
    time: "10:05",
    title: "신규 프로젝트 제안서",
    content:
      "안녕하세요. \n신규 프로젝트 제안서를 전달드립니다. \n이번 프로젝트는 사용자 경험 개선에 초점을 맞추고 있습니다. \n프로토타입 검토 후 피드백 부탁드립니다. \n검토 마감일은 다음 주 수요일입니다.",
    account: "third",
    folder: "inbox",
  },
  {
    id: 7,
    sender: "보낸 사람 바사아",
    time: "09:30",
    title: "팀 일정 변경 안내",
    content:
      "안녕하세요 팀원 여러분, \n이번 주 일정에 일부 변경이 있습니다. \n회의 시간이 기존 2시에서 4시로 변경되었으며, \n장소는 온라인(ZOOM)으로 진행됩니다. \n일정표를 최신 버전으로 업데이트했습니다.",
    account: "second",
    folder: "inbox",
  },
  {
    id: 8,
    sender: "보낸 사람 자차카",
    time: "Aug.25",
    title: "고객 설문조사 결과",
    content:
      "안녕하세요. \n고객 설문조사 결과를 공유드립니다. \n만족도는 82%로 나타났으며, 주요 개선 요청은 ‘응답 속도 향상’이었습니다. \n해당 내용을 반영해 다음 분기 계획을 수립 중입니다.",
    account: "first",
    folder: "inbox",
  },
  {
    id: 9,
    sender: "보낸 사람 타파하",
    time: "Aug.11",
    title: "시스템 점검 일정",
    content:
      "안녕하세요. \n시스템 점검 일정을 안내드립니다. \n8월 15일(목) 오전 2시부터 5시까지 서비스가 일시 중단됩니다. \n불편을 드려 죄송합니다. \n안정적인 서비스를 위해 최선을 다하겠습니다.",
    account: "second",
    folder: "inbox",
  },
  {
    id: 10,
    sender: "보낸 사람 가하자",
    time: "09:15",
    title: "이전 메일 무시 바랍니다",
    content:
      "안녕하세요. \n방금 전 발송된 메일은 잘못 전송된 것입니다. \n혼란을 드려 죄송하며, 해당 내용은 무시해주시기 바랍니다. \n정정된 내용은 곧 다시 전달드리겠습니다.",
    account: "first",
    folder: "trash",
  },
  {
    id: 11,
    sender: "보낸 사람 스팸메일",
    time: "Aug.22",
    title: "계정 비활성화 안내",
    content:
      "안녕하세요. \n장기간 활동이 없어 계정이 일시적으로 비활성화되었습니다. \n7일 이내에 로그인하지 않으면 계정이 자동 삭제될 예정입니다. \n계정을 유지하시려면 즉시 로그인해주세요.",
    account: "second",
    folder: "trash",
  },
  {
    id: 12,
    sender: "보낸 사람 듀듀듀",
    time: "Jul.30",
    title: "메일 발송 오류 보고",
    content:
      "안녕하세요. \n첨부 파일 전송 중 오류가 발생하여 메일이 정상적으로 전달되지 않았습니다. \n파일을 다시 첨부하여 재전송 부탁드립니다. \n불편을 드려 죄송합니다.",
    account: "third",
    folder: "trash",
  },
  {
    id: 13,
    sender: "보낸 사람 집갈래",
    time: "Jul.05",
    title: "스팸 의심 메일 안내",
    content:
      "안녕하세요. \n보안 시스템에서 사용자의 계정으로 전송된 메일 중 일부가 스팸으로 분류되었습니다. \n첨부 파일이나 링크를 열기 전 반드시 발신자를 확인해주세요. \n안전한 이메일 사용을 위해 주의 부탁드립니다.",
    account: "first",
    folder: "trash",
  },
];

export { allMails };
