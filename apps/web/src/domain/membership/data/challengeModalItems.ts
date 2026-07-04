// 멤버십 "패스" 혜택 모달(BenefitModal) — "챌린지 종류별 1회 무료 참여" 갤러리 항목.
//
// 모든 항목은 `/challenge/{slug}/latest` 자동 리다이렉트를 사용한다(앱 내부 상대 경로).
// 해당 타입의 최신 모집중(없으면 최신 노출) 챌린지 상세로 자동 이동하므로, 새 회차가
// 열려도 이 파일을 수정할 필요가 없다.
// (라우트: apps/web/src/app/(user)/challenge/{slug}/latest/page.tsx → useLatestChallengeRedirect)

export interface ChallengeModalItem {
  label: string;
  /** public/images/membership/ 하위 파일명 */
  src: string;
  url: string;
}

export const CHALLENGE_ITEMS: ChallengeModalItem[] = [
  {
    label: '경험정리 챌린지',
    src: 'challenge-experience.jpg',
    url: '/challenge/experience-summary/latest',
  },
  {
    label: '이력서 1주 완성',
    src: 'challenge-resume.png',
    url: '/challenge/resume/latest',
  },
  {
    label: '자기소개서 완성',
    src: 'challenge-coverletter.jpg',
    url: '/challenge/personal-statement/latest',
  },
  {
    label: '대기업 공채 자소서',
    src: 'challenge-major-coverletter.jpg',
    url: '/challenge/personal-statement-large-corp/latest',
  },
  {
    label: '포트폴리오 완성',
    src: 'challenge-portfolio.jpg',
    url: '/challenge/portfolio/latest',
  },
  {
    label: '면접 끝장 챌린지',
    src: 'challenge-interview.png',
    url: '/challenge/meeting-preparation/latest',
  },
  {
    label: '마케팅 올인원',
    src: 'challenge-marketing.png',
    url: '/challenge/marketing/latest',
  },
  {
    label: 'HR/인사 직무',
    src: 'challenge-hr.png',
    url: '/challenge/hr/latest',
  },
  {
    label: 'PM/서비스기획',
    src: 'challenge-pm.png',
    url: '/challenge/pm/latest',
  },
];
