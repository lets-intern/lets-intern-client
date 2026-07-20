// 무료 세미나 PostHog 임베드 통계 페이지(어드민 콘텐츠 영역). 팀 내부 테스트 지표 확인용.
const POSTHOG_EMBED_SRC =
  'https://us.posthog.com/embedded/ixnKagD2dNirQSkSYg3gq66chyTfBg';

const StatsSeminar = () => (
  <div className="mx-6 my-6">
    <h1 className="mb-4 text-lg font-semibold">무료 세미나 통계</h1>
    <iframe
      title="무료 세미나 PostHog 통계"
      src={POSTHOG_EMBED_SRC}
      className="h-[calc(100vh-8rem)] w-full rounded border-0"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  </div>
);

export default StatsSeminar;
