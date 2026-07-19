import { DIFFERENTIATOR_MENTORS } from '../data/mentors';
import MentorProfileCard from '../ui/MentorProfileCard';

interface DifferentiatorHeadProps {
  badge: string;
  title: string;
  desc: string;
}

/** 차별점 블록 공통 헤더 — 배지 + 제목 + 설명. */
const DifferentiatorHead = ({
  badge,
  title,
  desc,
}: DifferentiatorHeadProps) => (
  <div className="flex flex-col items-center gap-3 text-center">
    <span className="text-xxsmall12 md:text-xsmall14 text-primary-light border-primary-light/40 rounded-full border px-4 py-1.5 font-semibold">
      {badge}
    </span>
    <h3 className="text-small20 md:text-large26 font-bold text-neutral-100">
      {title}
    </h3>
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-80">{desc}</p>
  </div>
);

/**
 * S6 차별점 섹션 — 3가지 차별점(히든 쿠폰 · 현직자 합격 전략(멘토 6인) · 실시간 질의응답).
 * 다크 배경 위 정적 그래픽 + 멘토 카드 그리드. 정적 RSC.
 */
const DifferentiatorSection = () => {
  return (
    <section className="bg-neutral-0 w-full px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-20 md:gap-28">
        {/* 차별점 1 — 히든 쿠폰 (정적 그래픽) */}
        <div className="flex flex-col items-center gap-8">
          <DifferentiatorHead
            badge="차별점 1"
            title="오직 라이브에서만 제공하는 히든 쿠폰"
            desc="세미나 참여자 한정 히든 쿠폰과 취업에 도움되는 자료를 받아보세요."
          />
          <img
            src="/images/seminar/differentiator/hidden-coupon.png"
            alt="세미나 참여자 한정 히든 할인 쿠폰 안내"
            loading="lazy"
            className="w-full max-w-[900px]"
          />
        </div>

        {/* 차별점 2 — 현직자 합격 전략 (멘토 6인) */}
        <div className="flex flex-col items-center gap-10">
          <DifferentiatorHead
            badge="차별점 2"
            title="내가 원하는 직무 현직자의 합격 전략"
            desc="서류부터 면접까지, 실제 합격에 도움이 되는 노하우를 직접 들어보세요."
          />
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATOR_MENTORS.map((mentor) => (
              <MentorProfileCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>

        {/* 차별점 3 — 실시간 질의응답 (정적 그래픽) */}
        <div className="flex flex-col items-center gap-8">
          <DifferentiatorHead
            badge="차별점 3"
            title="실시간으로 질의응답까지"
            desc="라이브 세미나 중 궁금한 점을 바로 질문하고 답변을 받아보세요."
          />
          <img
            src="/images/seminar/differentiator/live-qna.png"
            alt="라이브 세미나 실시간 질의응답 예시"
            loading="lazy"
            className="w-full max-w-[900px]"
          />
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorSection;
