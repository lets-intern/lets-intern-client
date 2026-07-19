import Link from 'next/link';

/**
 * S2 서브 배너 — "챌린지 1개만 구매해도 무료 세미나 무제한 다시보기" 안내.
 * 피그마 배너(카피·버튼 포함)를 통이미지로 노출하고, 전체를 챌린지 목록으로 연결한다.
 */
const SubBannerSection = () => {
  return (
    <Link
      href="/program?type=CHALLENGE"
      className="block w-full"
      aria-label="챌린지 1개만 구매해도 매월 2회 진행되는 무료 세미나 무제한 다시보기 가능 - 챌린지 보러가기"
    >
      <img
        src="/images/seminar/sub-banner.png"
        alt="챌린지 수강생만 볼 수 있는 무료 세미나 아카이브. 챌린지 1개만 구매해도 매월 2회 진행되는 무료 세미나 무제한 다시보기 가능! 챌린지 보러가기"
        className="w-full"
      />
    </Link>
  );
};

export default SubBannerSection;
