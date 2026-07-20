/**
 * S5 무료 참여 안내 섹션 — "누구나 무료로 참여 가능한 라이브 세미나".
 * 검정 배경(바로 아래 S6 차별점 그라데이션 최상단과 이어짐) 위 카피 + 라이브 세미나 슬라이드 예시. 정적 RSC.
 */
const FreeVodSection = () => {
  return (
    <section className="w-full bg-black px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 break-keep text-center">
          <p className="text-xsmall14 md:text-xsmall16 text-primary-light font-semibold">
            취업 고민, 렛츠커리어 &amp; 현직자와 함께 해결해요!
          </p>
          <h2 className="text-small20 md:text-xlarge30 font-bold text-neutral-100">
            누구나 무료로 참여 가능한
            <br />
            <span className="text-primary-light">
              라이브 세미나에서{' '}
              {/* 모바일에서 '끝!'이 홀로 떨어지지 않도록 어절 단위로 줄바꿈 */}
              <br className="md:hidden" />
              직무 현직자와 취업 고민 끝!
            </span>
          </h2>
        </div>

        <img
          src="/images/seminar/free-live/slides.png"
          alt="라이브 세미나 강의 슬라이드 예시"
          loading="lazy"
          className="w-full max-w-[820px] rounded-lg"
        />
      </div>
    </section>
  );
};

export default FreeVodSection;
