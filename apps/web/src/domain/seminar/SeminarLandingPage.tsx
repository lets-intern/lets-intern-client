import { Suspense } from 'react';
import DifferentiatorSection from './section/DifferentiatorSection';
import FaqSection from './section/FaqSection';
import FreeVodSection from './section/FreeVodSection';
import HeroSection from './section/HeroSection';
import PastSeminarShowcaseSection from './section/PastSeminarShowcaseSection';
import PlusSection from './section/PlusSection';
import ReviewSection from './section/ReviewSection';
import SeminarListSection from './section/SeminarListSection';
import SubBannerSection from './section/SubBannerSection';
import SuggestSeminarCta from './section/SuggestSeminarCta';

/**
 * 무료 세미나 랜딩 페이지 (도메인 루트).
 *
 * 섹션 순서(figma 기준, 위→아래):
 *  S1 히어로 → S2 서브 배너 → S3 필터 탭 + S4 리스트(SeminarListSection) →
 *  S5 무료 참여 VOD → S6 차별점 3종 → S7 여기에 더해서 → S8 지난 세미나 →
 *  S9 후기 → S10 FAQ → 제안하기 CTA(magnet 출시알림).
 *
 * 리스트/후기/지난세미나/CTA 등 상호작용 섹션만 'use client'이고 나머지는 정적 RSC.
 */
const SeminarLandingPage = () => {
  return (
    <div className="w-full">
      <h1 className="sr-only">무료 세미나</h1>

      <HeroSection />
      <SubBannerSection />

      {/* SeminarListSection 은 useSearchParams(?status=)를 사용하므로 정적 프리렌더
          CSR bailout 방지를 위해 Suspense 경계로 감싼다. */}
      <div className="w-full px-5 py-16 md:py-24">
        <Suspense fallback={<div className="min-h-[480px]" />}>
          <SeminarListSection />
        </Suspense>
      </div>

      <FreeVodSection />
      <DifferentiatorSection />
      <PlusSection />
      <PastSeminarShowcaseSection />
      <ReviewSection />
      <FaqSection />

      <section className="w-full px-5 pb-16 md:pb-24">
        <SuggestSeminarCta />
      </section>
    </div>
  );
};

export default SeminarLandingPage;
