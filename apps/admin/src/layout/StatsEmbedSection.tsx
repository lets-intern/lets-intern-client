import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Link } from 'react-router-dom';

// 통계 항목 — 클릭 시 어드민 콘텐츠 영역에 PostHog 임베드 페이지를 연다.
const STATS_ITEMS = [{ name: '무료 세미나', url: '/stats/seminar' }] as const;

/**
 * 사이드바 "통계" 드롭다운(나가기 위, 기본 닫힘).
 * 열면 항목(무료 세미나 등) 노출, 항목 클릭 시 해당 통계 페이지로 이동한다.
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
        <h3 className="text-xsmall16 font-medium">통계</h3>
        <i
          className={`text-xl text-neutral-600 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <IoIosArrowDown />
        </i>
      </button>

      {open && (
        <ul>
          {STATS_ITEMS.map((item) => (
            <li key={item.name}>
              <Link
                to={item.url}
                className="text-xsmall14 flex items-center gap-1 py-2 pl-6 hover:bg-[#2A2A2A]"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// (재배포 트리거: 병합 커밋 diff=0으로 Vercel skip-build에 걸린 배포를 다시 태우기 위한 no-op 변경)
export default StatsEmbedSection;
