/**
 * 3.3.T1 — 미션 일자 앵커 기간 규칙 순수함수 단위 테스트.
 *
 * PRD §4·§6-2 표 근거:
 *  - 슬롯 오픈: 미션 시작 -3일 00:00:00 ~ -2일 23:59:59
 *  - 진행:     미션 종료 +2일 00:00:00 ~ +4일 23:59:59
 *  - 예약:     미션 시작일 00:00:00 ~ 미션 종료일 23:59:59
 */
import { describe, expect, it } from 'vitest';

import {
  PROGRESS_OFFSET_DAYS,
  SLOT_OPEN_OFFSET_DAYS,
  computeProgressWindow,
  computeReservationWindow,
  computeSlotOpenWindow,
  isWithinWindow,
} from '../feedbackScheduleRules';

/** 로컬 시각 비교용 — 'YYYY-MM-DD HH:mm:ss' 로 포맷 */
function fmt(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

describe('오프셋 상수', () => {
  it('슬롯 오픈은 -3일 시작 ~ -2일 끝, 진행은 +2일 시작 ~ +4일 끝', () => {
    expect(SLOT_OPEN_OFFSET_DAYS).toEqual({ start: -3, end: -2 });
    expect(PROGRESS_OFFSET_DAYS).toEqual({ start: 2, end: 4 });
  });
});

describe('computeSlotOpenWindow', () => {
  it('미션 시작 -3일 00:00:00 ~ -2일 23:59:59 구간을 만든다', () => {
    const w = computeSlotOpenWindow('2026-07-12T09:30:00');
    expect(fmt(w.start)).toBe('2026-07-09 00:00:00');
    expect(fmt(w.end)).toBe('2026-07-10 23:59:59');
  });
});

describe('computeProgressWindow', () => {
  it('미션 종료 +2일 00:00:00 ~ +4일 23:59:59 구간을 만든다', () => {
    const w = computeProgressWindow('2026-07-15T18:00:00');
    expect(fmt(w.start)).toBe('2026-07-17 00:00:00');
    expect(fmt(w.end)).toBe('2026-07-19 23:59:59');
  });
});

describe('computeReservationWindow', () => {
  it('미션 시작일 00:00:00 ~ 미션 종료일 23:59:59 구간을 만든다', () => {
    const w = computeReservationWindow(
      '2026-07-12T09:30:00',
      '2026-07-15T18:00:00',
    );
    expect(fmt(w.start)).toBe('2026-07-12 00:00:00');
    expect(fmt(w.end)).toBe('2026-07-15 23:59:59');
  });
});

describe('isWithinWindow', () => {
  const window = computeSlotOpenWindow('2026-07-12T00:00:00'); // 07-09 00:00 ~ 07-10 23:59:59

  it('구간 내부 시각은 true', () => {
    expect(isWithinWindow(new Date('2026-07-09T12:00:00'), window)).toBe(true);
    expect(isWithinWindow(new Date('2026-07-10T23:59:00'), window)).toBe(true);
  });

  it('구간 경계(시작 00:00:00)를 포함한다', () => {
    expect(isWithinWindow(new Date('2026-07-09T00:00:00'), window)).toBe(true);
  });

  it('구간 이전/이후 시각은 false', () => {
    expect(isWithinWindow(new Date('2026-07-08T23:59:59'), window)).toBe(false);
    expect(isWithinWindow(new Date('2026-07-11T00:00:00'), window)).toBe(false);
  });
});
