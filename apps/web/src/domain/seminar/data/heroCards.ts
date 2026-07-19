// S1 히어로 우측 플로팅 장식 카드 카피 (figma 1_베너.png 기준).
// 실제 세미나 목록이 아닌 장식용 목업이라 하드코딩한다.

export interface HeroCard {
  id: string;
  /** 카드 배경 색 계열 — 디자인시스템 토큰 클래스 */
  tone: 'green' | 'blue' | 'orange';
  badge: string;
  title: string;
  desc?: string;
}

export const HERO_CARDS: HeroCard[] = [
  {
    id: 'green',
    tone: 'green',
    badge: '무료 세미나',
    title: '2026 대기업 공채 준비 A to Z',
  },
  {
    id: 'blue',
    tone: 'blue',
    badge: 'LIVE',
    title: '2026 취뽀를 위해\n반드시 알아야 할 핵심 트렌드',
    desc: '3,000개 서류 피드백으로 발견한 쥬디 멘토의 취업 전략',
  },
  {
    id: 'orange',
    tone: 'orange',
    badge: 'LIVE',
    title: 'AI 시대,\n대기업 서류 통과를 위한 자세',
    desc: 'CJ 그룹 현직자가 알려주는 AI 시대, 취뽀하는 방법',
  },
];
