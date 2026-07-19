import { PAST_SEMINAR_MENTORS } from '../data/pastSeminars';

/**
 * S8 지난 세미나 멘토 하이라이트 — 멘토 4인 큐레이션(멘토별 통이미지).
 * 모바일·데스크톱 모두 세로 스택. 모바일은 세로형 카드, 데스크톱은 가로형 카드. 정적 RSC.
 */
const PastSeminarShowcaseSection = () => {
  return (
    <section className="w-full bg-[#EFEFEF] px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <h2 className="text-small20 md:text-large26 text-neutral-0 text-center font-bold">
          지난 세미나 멘토 하이라이트
        </h2>

        <div className="flex flex-col gap-6 md:gap-10">
          {PAST_SEMINAR_MENTORS.map((mentor) => (
            <a
              key={mentor.id}
              href={mentor.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity hover:opacity-95"
            >
              {/* 모바일: 세로형 카드 이미지 */}
              <img
                src={mentor.mobileImage}
                alt={mentor.alt}
                loading="lazy"
                className="w-full rounded-xl md:hidden"
              />
              {/* 데스크톱: 가로형 카드 이미지 */}
              <img
                src={mentor.image}
                alt={mentor.alt}
                loading="lazy"
                className="hidden w-full rounded-xl md:block"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastSeminarShowcaseSection;
