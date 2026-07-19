'use client';

import { useCarouselDots } from '@letscareer/hooks';
import { useRef } from 'react';
import {
  PAST_SEMINAR_MENTORS,
  type PastSeminarMentor,
} from '../data/pastSeminars';
import SeminarCarouselDots from '../ui/SeminarCarouselDots';

/** 멘토 이력 체크 리스트. */
const CredentialList = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-1.5">
    {items.map((item) => (
      <li
        key={item}
        className="text-xsmall14 md:text-xsmall16 text-neutral-20 flex items-start gap-2"
      >
        <span className="text-primary shrink-0" aria-hidden>
          ✓
        </span>
        {item}
      </li>
    ))}
  </ul>
);

/** 강의자료 썸네일 4장. */
const MaterialThumbnails = ({ mentor }: { mentor: PastSeminarMentor }) => (
  <div className="grid grid-cols-4 gap-2">
    {mentor.materials.map((src, i) => (
      <img
        key={src}
        src={src}
        alt={`${mentor.badge} 강의자료 ${i + 1}`}
        loading="lazy"
        className="border-neutral-90 rounded-xs w-full border"
      />
    ))}
  </div>
);

/** 멘토 한 명 슬라이드 — 프로필·이력·강의자료 + 3분 미리보기 카드. */
const PastSeminarSlide = ({ mentor }: { mentor: PastSeminarMentor }) => (
  <article className="border-neutral-90 shadow-03 w-[85%] shrink-0 snap-center rounded-xl border bg-white p-6 md:w-full md:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-start gap-5">
          <img
            src={mentor.profile}
            alt=""
            aria-hidden
            className="bg-primary-5 rounded-lg md:h-28 md:w-28 h-24 w-24 shrink-0 object-cover object-top"
          />
          <div className="flex flex-col items-start gap-3 pt-1">
            <span className="text-xsmall14 md:text-xsmall16 bg-primary rounded-xs w-fit px-3 py-1.5 font-bold text-neutral-100">
              {mentor.badge}
            </span>
            <CredentialList items={mentor.credentials} />
          </div>
        </div>
        <div className="bg-neutral-90 h-px w-full" />
        <MaterialThumbnails mentor={mentor} />
      </div>

      <img
        src={mentor.preview}
        alt={mentor.previewAlt}
        loading="lazy"
        className="w-full shrink-0 rounded-lg lg:w-80"
      />
    </div>
  </article>
);

/**
 * S8 지난 세미나 멘토 하이라이트 — 멘토 4인 큐레이션.
 * 모바일은 가로 scroll-snap 캐러셀(도트 추적), 데스크톱은 세로 스택.
 */
const PastSeminarShowcaseSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollToSlide } = useCarouselDots(trackRef);

  return (
    <section className="w-full px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <h2 className="text-small20 md:text-large26 text-neutral-0 text-center font-bold">
          지난 세미나 멘토 하이라이트
        </h2>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:flex-col md:gap-16 md:overflow-visible md:pb-0"
        >
          {PAST_SEMINAR_MENTORS.map((mentor) => (
            <PastSeminarSlide key={mentor.id} mentor={mentor} />
          ))}
        </div>

        <SeminarCarouselDots
          count={PAST_SEMINAR_MENTORS.length}
          activeIndex={activeIndex}
          onSelect={scrollToSlide}
          label="지난 세미나 멘토 넘기기"
          itemLabel={(i) => PAST_SEMINAR_MENTORS[i].badge}
        />
      </div>
    </section>
  );
};

export default PastSeminarShowcaseSection;
