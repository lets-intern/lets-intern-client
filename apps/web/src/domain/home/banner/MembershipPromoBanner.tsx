import Image from 'next/image';
import Link from 'next/link';

/**
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ [PROMO-BANNER] 하반기 멤버십 프로모션 배너 (한시적)                      │
 * │                                                                         │
 * │ 프로모션 종료 시 삭제 방법 — `grep -rn "\[PROMO-BANNER\]"` 로 전부 찾기: │
 * │   1. 이 파일(MembershipPromoBanner.tsx) 삭제                             │
 * │   2. TopBanner.tsx 의 import 와 <MembershipPromoBanner /> 렌더 줄 제거   │
 * │   3. public/images/home-membership-banner.png 삭제                      │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * TopBanner(상단 띠 배너) 안에서 밴드 바로 아래에 렌더되며, 클릭 시 /membership 으로 이동한다.
 * 음수 마진(-mt)으로 고정 밴드 아래에 살짝 겹쳐 올려, 밴드가 이미지 상단(배경 영역)을 덮게 한다.
 * → 스페이서와 실제 밴드 높이 차이로 생기던 흰 틈을 브레이크포인트 무관하게 제거.
 */
const MembershipPromoBanner = () => {
  return (
    <Link
      href="/membership"
      className="relative hidden w-full overflow-hidden md:-mt-2 md:block"
      aria-label="2026 하반기 멤버십 - 공채 준비 올인원 패스 안내"
    >
      <Image
        src="/images/home-membership-banner.png"
        alt="7월부터 9월까지 하루 약 1600원으로! 공채 준비 올인원 패스로 한 번에 준비하자! 혜택 자세히 보기"
        width={4200}
        height={1200}
        className="h-auto w-full"
        sizes="100vw"
        priority
      />
      {/* [PROMO-BANNER] 이미지 위 광택 스윕 애니메이션 */}
      <span
        aria-hidden="true"
        className="promo-banner-shine pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />
      <style>{`
        @keyframes promoBannerShine {
          0%   { transform: translateX(-160%) skewX(-18deg); }
          32%  { transform: translateX(560%)  skewX(-18deg); }
          100% { transform: translateX(560%)  skewX(-18deg); }
        }
        .promo-banner-shine { animation: promoBannerShine 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .promo-banner-shine { animation: none; }
        }
      `}</style>
    </Link>
  );
};

export default MembershipPromoBanner;
