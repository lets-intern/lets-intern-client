import Link from 'next/link';

/**
 * S2 서브 배너 — "챌린지 1개만 구매해도 무료 세미나 무제한 다시보기" 안내.
 * 정적 RSC. 챌린지 목록으로 이동하는 링크 배너.
 */
const SubBannerSection = () => {
  return (
    <section className="bg-primary w-full px-5 py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-5 text-center">
        <p className="text-xsmall14 md:text-xsmall16 text-neutral-100/70">
          챌린지 수강생만 볼 수 있는 무료 세미나 아카이브
        </p>
        <h2 className="text-small20 md:text-large26 font-bold text-neutral-100">
          챌린지 1개만 구매해도
          <br />
          매월 2회 진행되는 무료 세미나,{' '}
          <span className="text-point">무제한 다시보기 가능!</span>
        </h2>
        <Link
          href="/program?type=CHALLENGE"
          className="text-xsmall14 md:text-xsmall16 bg-point text-primary flex items-center gap-1 rounded-full px-5 py-2.5 font-semibold"
        >
          챌린지 보러가기
          <span aria-hidden>›</span>
        </Link>
      </div>
    </section>
  );
};

export default SubBannerSection;
