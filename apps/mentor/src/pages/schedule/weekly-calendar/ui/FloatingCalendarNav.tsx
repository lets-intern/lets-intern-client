import { format } from 'date-fns';
import { type RefObject } from 'react';

import type { VisibleRange } from '../hooks/useVisibleDateRange';

interface FloatingCalendarNavProps {
  /** 현재 보이는 날짜 범위 (스크롤에 따라 갱신). 측정 전이면 null */
  range: VisibleRange | null;
  /** 무한스크롤 컨테이너 ref (주 이동 버튼이 직접 스크롤 위치를 옮긴다) */
  containerRef: RefObject<HTMLDivElement | null>;
  /** 타임라인 전체 일수 — 하루 폭(scrollWidth/totalDays) 계산용 */
  totalDays: number;
  /** 오늘 컬럼이 현재 뷰포트에 보이는지 — 보일 때는 "오늘" 버튼을 숨긴다 */
  isTodayVisible: boolean;
  /** "오늘" 클릭 시 오늘로 스크롤 */
  onGoToToday: () => void;
}

/** 주 이동 버튼이 한 번에 이동하는 일수 — 일주일(7일) */
const MOVE_STEP_DAYS = 7;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 하단 중앙 플로팅 캘린더 네비게이션 — 날짜 범위 라벨 + 주 이동(`<`,`>`) + "오늘로 이동".
 *
 * 기존 상단 고정 `CalendarRangeHeader`(범위/주이동)와 우하단 `TodayButton`을
 * 하나의 플로팅 컨트롤로 통합한 것. `fixed`로 뷰포트 하단 중앙에 떠 있는다.
 *
 * - 라벨: 가로 스크롤에 따라 "YYYY.MM.DD ~ MM.DD" 로 실시간 갱신.
 * - 주 이동: 보이는 첫날 기준 ±7일, 그 날을 왼쪽 끝에 정렬(무한스크롤 위치만 이동).
 * - "오늘": 오늘 컬럼이 화면 밖일 때만 노출(이미 보이면 숨김).
 */
const FloatingCalendarNav = ({
  range,
  containerRef,
  totalDays,
  isTodayVisible,
  onGoToToday,
}: FloatingCalendarNavProps) => {
  const label = range
    ? `${format(range.firstVisibleDate, 'yyyy.MM.dd')} ~ ${format(
        range.lastVisibleDate,
        'MM.dd',
      )}`
    : '';

  const moveByDays = (deltaDays: number) => {
    const el = containerRef.current;
    if (!el || el.scrollWidth <= 0 || totalDays <= 0) return;

    const dayWidth = el.scrollWidth / totalDays;
    const currentFirstIdx = Math.round(el.scrollLeft / dayWidth);
    const targetIdx = clamp(currentFirstIdx + deltaDays, 0, totalDays - 1);
    el.scrollTo({ left: targetIdx * dayWidth, behavior: 'smooth' });
  };

  return (
    <div className="border-neutral-80 fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border bg-white px-2 py-1.5 shadow-lg">
      <button
        type="button"
        onClick={() => moveByDays(-MOVE_STEP_DAYS)}
        disabled={!range}
        aria-label="이전 주"
        className="hover:bg-neutral-95 flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 9L10 13L14 17"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="text-xsmall14 text-neutral-10 min-w-[140px] text-center font-semibold tabular-nums">
        {label}
      </span>

      <button
        type="button"
        onClick={() => moveByDays(MOVE_STEP_DAYS)}
        disabled={!range}
        aria-label="다음 주"
        className="hover:bg-neutral-95 flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M10 9L14 13L10 17"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* "오늘" 버튼: 오늘이 보이면 숨기되(invisible) 자리는 유지해 pill 폭이
          고정되도록 한다 → 주 이동 시 재중앙정렬로 `›`가 밀려 오클릭되는 문제 방지. */}
      <span className="bg-neutral-80 mx-0.5 h-4 w-px" aria-hidden />
      <button
        type="button"
        onClick={onGoToToday}
        disabled={isTodayVisible}
        aria-hidden={isTodayVisible}
        tabIndex={isTodayVisible ? -1 : 0}
        aria-label="오늘로 이동"
        className={`text-primary hover:bg-neutral-95 text-xsmall14 flex items-center gap-1 rounded-full py-1 pl-2 pr-2.5 font-medium transition-colors ${
          isTodayVisible ? 'invisible' : ''
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect
            x="2"
            y="3"
            width="12"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M5.5 2V4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M10.5 2V4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="8" cy="10" r="1.5" fill="currentColor" />
        </svg>
        오늘
      </button>
    </div>
  );
};

export default FloatingCalendarNav;
