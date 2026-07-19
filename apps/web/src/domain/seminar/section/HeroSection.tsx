import { HERO_CARDS, type HeroCard } from '../data/heroCards';

// 장식 카드 색상 계열 → 디자인시스템 토큰. figma 오렌지 계열은 대응 토큰이 없어
// tertiary(퍼플)로 근사한다(장식용이라 브랜드 전달에는 무해).
const CARD_TONE: Record<HeroCard['tone'], string> = {
  green: 'bg-secondary text-neutral-100',
  blue: 'bg-primary text-neutral-100',
  orange: 'bg-tertiary text-neutral-100',
};

/** 우측 플로팅 장식 카드 한 장 — 데스크톱(lg↑)에서만 노출한다. */
const HeroFloatingCard = ({ card }: { card: HeroCard }) => (
  <article
    className={`shadow-05 flex w-64 flex-col gap-2 rounded-lg p-5 ${CARD_TONE[card.tone]}`}
  >
    <span className="text-xxsmall12 w-fit rounded-full bg-neutral-100/25 px-2.5 py-1 font-semibold">
      {card.badge}
    </span>
    <h3 className="text-small18 whitespace-pre-line font-bold">{card.title}</h3>
    {card.desc && (
      <p className="text-xxsmall12 text-neutral-100/80">{card.desc}</p>
    )}
  </article>
);

/**
 * S1 히어로 배너 — 좌측 카피(로고·헤드라인·서브) + 우측 플로팅 장식 카드.
 * 정적 RSC. 모바일은 카피만, lg↑에서 장식 카드를 부채꼴로 노출한다.
 */
const HeroSection = () => {
  return (
    <section className="bg-primary-5 w-full px-5 py-14 md:py-20">
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

        <div
          className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:flex lg:items-center"
          aria-hidden
        >
          {HERO_CARDS.map((card, i) => (
            <div
              key={card.id}
              className={`-ml-8 first:ml-0 ${i === 1 ? 'z-10 scale-105' : 'opacity-90'}`}
            >
              <HeroFloatingCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
