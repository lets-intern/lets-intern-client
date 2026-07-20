import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { IoStatsChart } from 'react-icons/io5';

// 팀 내부용 PostHog 임베드 대시보드(테스트 지표 확인·메모용). 기본 닫힘.
const POSTHOG_EMBED_SRC =
  'https://us.posthog.com/embedded/ixnKagD2dNirQSkSYg3gq66chyTfBg';

/**
 * 사이드바 하단 "통계" 드롭다운 — 열면 PostHog 임베드를 사이드바 오른쪽 플라이아웃으로 띄운다.
 * (사이드바 폭이 좁아 임베드는 밖으로 펼친다. 트리거는 다른 섹션과 동일한 톤으로 눈에 안 띄게.)
 */
const StatsEmbedSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-b border-b-neutral-600 pb-3 pl-4 pr-8"
      >
        <h3 className="text-xsmall16 flex items-center gap-1 font-medium">
          <IoStatsChart className="text-sm" />
          통계
        </h3>
        <i
          className={`text-xl text-neutral-600 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <IoIosArrowDown />
        </i>
      </button>

      {open && (
        <div className="fixed bottom-4 left-48 z-[60] ml-2 w-[540px] max-w-[calc(100vw-13rem)] rounded-lg bg-white p-2 shadow-2xl">
          <iframe
            title="PostHog 통계"
            src={POSTHOG_EMBED_SRC}
            className="h-[440px] w-full rounded border-0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      )}
    </div>
  );
};

export default StatsEmbedSection;
