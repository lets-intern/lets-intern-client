/**
 * S1 히어로 배너 — 좌측 카피(로고·헤드라인·서브) + 우측 플로팅 세미나 카드 이미지.
 * 정적 RSC. 모바일은 카피만, lg↑에서 우측에 세미나 카드 이미지를 노출한다.
 * (카드 이미지가 우측으로 블리드하므로 섹션에 overflow-hidden 으로 가로 스크롤을 막는다.)
 */
const HeroSection = () => {
  return (
    <section className="bg-primary-5 w-full overflow-hidden px-5 py-14 md:py-20">
      <div className="relative mx-auto flex w-full max-w-[1120px] flex-col items-start gap-6">
        <div className="flex items-center gap-2">
          <img
            src="/images/seminar/logo.png"
            alt=""
            className="h-7 w-7"
            aria-hidden
          />
          <span className="text-small18 md:text-small20 text-neutral-0 font-bold">
            무료 세미나
          </span>
        </div>

        <h1 className="text-medium24 md:text-xxlarge36 text-neutral-0 font-bold leading-tight">
          내가 <span className="text-primary">원하는 기업·직무 현직자</span>에게
          <br />
          직접 듣는 합격 전략,
          <br />
          <span className="text-primary">무료 세미나</span>에서
        </h1>

        <p className="text-xsmall14 md:text-small18 text-neutral-40">
          매월 2회 이상 진행되는 무료 세미나에서,
          <br />
          내가 원하는 기업·직무 현직자의 실무 이야기와 합격 전략을 직접
          들어보세요.
        </p>

        <img
          src="/images/seminar/hero-cards.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[48%] top-1/2 hidden h-auto w-[760px] max-w-none -translate-y-1/2 lg:block xl:w-[860px]"
        />
      </div>
    </section>
  );
};

export default HeroSection;
