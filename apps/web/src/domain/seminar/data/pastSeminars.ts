// S8 지난 세미나 멘토 하이라이트 4인 (figma 8_지난세미나.png 기준).
// S4의 지난 세미나(LIVE POST) 리스트와 별개인, 하드코딩 큐레이션 섹션.
// 프로필(투명 아바타)·이력(텍스트)·강의자료 썸네일 4장·3분 미리보기(카드 이미지).

export interface PastSeminarMentor {
  id: string;
  /** 프로필 상단 배지 카피 (예: "[닉 멘토] 삼성 계열사 | 영업지원팀") */
  badge: string;
  /** 프로필 투명 아바타 이미지 */
  profile: string;
  /** 이력 항목 (체크 리스트) */
  credentials: string[];
  /** 강의자료 썸네일 4장 */
  materials: string[];
  /** 3분 미리보기 카드 이미지 (배지·제목 baked-in) */
  preview: string;
  /** 미리보기 접근성 대체 텍스트 */
  previewAlt: string;
}

const materialSet = (dir: string) =>
  [1, 2, 3, 4].map(
    (n) => `/images/seminar/past-seminar/materials/${dir}/${n}.png`,
  );

export const PAST_SEMINAR_MENTORS: PastSeminarMentor[] = [
  {
    id: 'nick',
    badge: '[닉 멘토] 삼성 계열사 | 영업지원팀',
    profile: '/images/seminar/past-seminar/profile/nick.png',
    credentials: [
      'CJ제일제당 신사업개발, 삼성 계열사 동시 최종합격',
      '전) 스타트업 트릿지 데이터 분석 인턴',
    ],
    materials: materialSet('nick'),
    preview: '/images/seminar/past-seminar/preview/nick.png',
    previewAlt: '대기업 하반기 공채 준비는 지금부터 — 3분 미리보기',
  },
  {
    id: 'pado',
    badge: '[파도 멘토] 뤼튼 | AI 서비스 기획자',
    profile: '/images/seminar/past-seminar/profile/pado.png',
    credentials: [
      '현) 뤼튼 AI 서비스 기획',
      '전) 뤼튼 AI 서비스 기획 인턴',
      '전) 네이버 클라우드 AI 데이터 인턴',
    ],
    materials: materialSet('pado'),
    preview: '/images/seminar/past-seminar/preview/pado.png',
    previewAlt: '문예창작과는 어떻게 AI 스타트업 PM이 되었을까? — 3분 미리보기',
  },
  {
    id: 'judy',
    badge: '[쥬디 멘토] 렛츠커리어 | CEO',
    profile: '/images/seminar/past-seminar/profile/judy.png',
    credentials: [
      '현) 렛츠커리어 대표 멘토/컨설턴트',
      '전) 와이즐리컴퍼니 | Product Manager',
      '당근, CJ푸드빌, 컬리, 캐시워크 등 합격 이력 보유',
      '3,000개 이상의 서류 피드백 진행',
      '2,500명 규모 취준 QNA 톡방 운영',
    ],
    materials: materialSet('judy'),
    preview: '/images/seminar/past-seminar/preview/judy.png',
    previewAlt: '2026 취뽀를 위해 반드시 알아야 할 핵심 트렌드 — 3분 미리보기',
  },
  {
    id: 'bibi',
    badge: '[비비 멘토] 앳홈 톰 브랜드 | CRM 마케터',
    profile: '/images/seminar/past-seminar/profile/bibi.png',
    credentials: [
      '전) CJ 계열사 PM 업무 어시스트 / 3개월',
      '전) OO대학교 의료원 의무기록팀 / 2년',
    ],
    materials: materialSet('bibi'),
    preview: '/images/seminar/past-seminar/preview/bibi.png',
    previewAlt:
      '보건의료에서 마케팅으로 직무전환, 어떻게 가능했을까? — 3분 미리보기',
  },
];
