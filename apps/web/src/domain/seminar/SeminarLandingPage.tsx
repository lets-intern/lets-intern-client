/**
 * 무료 세미나 랜딩 페이지 (도메인 루트)
 *
 * 섹션 구성(figma 기준):
 *  1. 히어로 배너
 *  2. 서브 배너
 *  3. 앵커(모집 중 / 모집 종료) — 필터 탭 (packages/ui CategoryTabs 재사용)
 *  4. 세미나 리스트 (모집중/종료) — LIVE 프로그램 + magnet LAUNCH_ALERT
 *  5. 무료 참여 가능(챌린지 전용 VOD)
 *  6. 차별점 3종 (하드코딩)
 *  7. 여기에 더해서
 *  8. 지난 세미나
 *  9. 후기 (하드코딩)
 * 10. FAQ (하드코딩)
 *
 * TODO(무료 세미나): 데이터 모델(LIVE program vs magnet) 확정 후 섹션별 구현 채우기.
 */
const SeminarLandingPage = () => {
  return (
    <div className="w-full">
      <h1 className="sr-only">무료 세미나</h1>
      {/* TODO(무료 세미나): 섹션 컴포넌트 조립 */}
    </div>
  );
};

export default SeminarLandingPage;
