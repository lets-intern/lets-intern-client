// S10 FAQ 하드코딩 목록.
// figma(10_FAQ.png)의 FAQ 본문은 placeholder(동일 Q/A 반복 + 챌린지용 카테고리 칩)라,
// 첫 항목만 figma에서 전사하고 나머지는 이 랜딩의 확정 카피(무료 참여·다시보기·실시간
// 질의응답)에서 도출했다. 실제 카피는 확정 후 교체 필요.

export interface SeminarFaq {
  id: string;
  question: string;
  answer: string;
}

export const SEMINAR_FAQ_HEAD = {
  eyebrow: '자주 묻는 질문',
  title: '궁금한 점이 있으신가요?',
} as const;

export const SEMINAR_FAQS: SeminarFaq[] = [
  {
    id: 'online',
    question: '온라인 참여는 어떻게 하나요?',
    answer:
      '신청을 완료하신 후에, 카카오톡 알림톡을 통해 Zoom 링크를 전송드릴 예정입니다. 혹시나 링크를 받아보지 못하셨다면, 채팅문의를 통해 문의주세요.',
  },
  {
    id: 'free',
    question: '무료 세미나는 정말 무료인가요?',
    answer:
      '네, 렛츠커리어 무료 세미나는 누구나 무료로 참여하실 수 있어요. 매월 2회 이상 진행되는 세미나에서 현직자의 실무 이야기와 합격 전략을 직접 들어보세요.',
  },
  {
    id: 'replay',
    question: '세미나 다시보기는 어디서 볼 수 있나요?',
    answer:
      '챌린지를 1개 이상 참여하신 분들은 챌린지 참여자 전용 VOD 아카이브에서 지난 세미나를 무제한으로 다시보기 하실 수 있어요.',
  },
  {
    id: 'qna',
    question: '세미나 중 궁금한 점은 어떻게 질문하나요?',
    answer:
      '라이브 세미나 중 실시간 채팅으로 질문을 남기시면, 현직자 멘토가 직접 답변드려요.',
  },
];
