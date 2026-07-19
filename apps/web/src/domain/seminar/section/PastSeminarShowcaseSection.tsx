'use client';

import { useCarouselDots } from '@letscareer/hooks';
import { useRef } from 'react';
import { PAST_SEMINAR_MENTORS } from '../data/pastSeminars';
import SeminarCarouselDots from '../ui/SeminarCarouselDots';

/**
 * S8 지난 세미나 멘토 하이라이트 — 멘토 4인 큐레이션(멘토별 통이미지).
 * 모바일은 가로 scroll-snap 캐러셀(도트 추적), 데스크톱은 세로 스택.
 */
const PastSeminarShowcaseSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollToSlide } = useCarouselDots(trackRef);

  return (
    <section className="w-full bg-[#EFEFEF] px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <h2 className="text-small20 md:text-large26 text-neutral-0 text-center font-bold">
          지난 세미나 멘토 하이라이트
        </h2>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:flex-col md:gap-10 md:overflow-visible md:pb-0"
        >
          {PAST_SEMINAR_MENTORS.map((mentor) => (
            <img
              key={mentor.id}
              src={mentor.image}
              alt={mentor.alt}
              loading="lazy"
              className="w-[85%] shrink-0 snap-center rounded-xl md:w-full"
            />
          ))}
        </div>

        <SeminarCarouselDots
          count={PAST_SEMINAR_MENTORS.length}
          activeIndex={activeIndex}
          onSelect={scrollToSlide}
          label="지난 세미나 멘토 넘기기"
          itemLabel={(i) => PAST_SEMINAR_MENTORS[i].name}
        />
      </div>
    </section>
  );
};

export default PastSeminarShowcaseSection;
