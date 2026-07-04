// 멤버십 "패스" 혜택 모달(BenefitModal) — "챌린지 종류별 1회 무료 참여" 갤러리 항목.
//
// [링크 방식]
// - 대부분은 `/challenge/{slug}/latest` 자동 리다이렉트 사용(해당 타입 최신 챌린지로
//   자동 이동 → 새 회차가 열려도 수정 불필요). 이 라우트들은 prod에 이미 배포돼 있다.
// - 단, PM·대기업(personal-statement-large-corp)은 `/latest` 라우트가 아직 없어서,
//   현재 회차 상세 URL을 직접 하드코딩한다. 새 회차가 열리면 아래 `/program/challenge/{id}`
//   의 **id 숫자만** 바꾸면 된다(id 뒤 슬러그 없어도 상세페이지가 정식 URL로 리다이렉트).
//   ※ 나중에 pm·personal-statement-large-corp latest 라우트를 만들어 배포하면
//     아래 두 개도 `/challenge/{slug}/latest` 로 바꿔 자동화할 수 있다.

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
    url: 'https://www.letscareer.co.kr/challenge/experience-summary/latest',
  },
  {
    label: '이력서 1주 완성',
    src: 'challenge-resume.png',
    url: 'https://www.letscareer.co.kr/challenge/resume/latest',
  },
  {
    label: '자기소개서 완성',
    src: 'challenge-coverletter.jpg',
    url: 'https://www.letscareer.co.kr/challenge/personal-statement/latest',
  },
  {
    // 대기업 자기소개서 완성 챌린지 9기 (id 287) — /latest 라우트 미배포로 직접 링크
    label: '대기업 공채 자소서',
    src: 'challenge-major-coverletter.jpg',
    url: 'https://www.letscareer.co.kr/program/challenge/287',
  },
  {
    label: '포트폴리오 완성',
    src: 'challenge-portfolio.jpg',
    url: 'https://www.letscareer.co.kr/challenge/portfolio/latest',
  },
  {
    label: '면접 끝장 챌린지',
    src: 'challenge-interview.png',
    url: 'https://www.letscareer.co.kr/challenge/meeting-preparation/latest',
  },
  {
    // 마케팅: /latest 자동연결 (라우트 기배포)
    label: '마케팅 올인원',
    src: 'challenge-marketing.png',
    url: 'https://www.letscareer.co.kr/challenge/marketing/latest',
  },
  {
    // HR: /latest 자동연결 (라우트 기배포)
    label: 'HR/인사 직무',
    src: 'challenge-hr.png',
    url: 'https://www.letscareer.co.kr/challenge/hr/latest',
  },
  {
    // [Live 세미나 전용] PM/서비스기획 취뽀 서류 완성 챌린지 2기 (id 286) — /latest 라우트 미배포로 직접 링크
    label: 'PM/서비스기획',
    src: 'challenge-pm.png',
    url: 'https://www.letscareer.co.kr/program/challenge/286',
  },
];
