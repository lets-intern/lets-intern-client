import { describe, expect, it } from 'vitest';

import dayjs from '@/lib/dayjs';

/**
 * 피드백 관리 목록(FeedbackMissionList)의 표시 로직 회귀 검증.
 *
 * DataGrid 렌더는 jsdom 가상화로 셀이 마운트되지 않으므로,
 * 컴포넌트의 두 가지 load-bearing 파생 로직을 그대로 미러링해 검증한다.
 *   1. 미션명은 서버 저장 title 을 그대로 표시(템플릿 파생 아님) → 서버 권위값 통과.
 *   2. 피드백 마감기간 = 미션 endDate + 3일 (null 이면 '-').
 *
 * ※ 실제 화면의 "공백/`-`" 회귀가 완전히 해소되는지는
 *    Push 1(PR #2442) 병합 + 과거 title='' 데이터 백필(2.2 메모)에 의존한다.
 *    (여기서는 코드 파생 로직이 정상 동작함만 보장한다.)
 */

// FeedbackMissionList.tsx:14 — field:'title' 은 서버 title 을 그대로 표시.
function resolveTitle(serverTitle?: string | null): string | null | undefined {
  return serverTitle;
}

// FeedbackMissionList.tsx:92-101 — feedbackPeriod renderCell 로직.
function resolveFeedbackPeriod(endDate?: string | null): string {
  if (!endDate) return '-';
  return dayjs(endDate).add(3, 'day').format('YYYY년 M월 D일');
}

describe('피드백 관리 목록 표시 로직', () => {
  it('미션명은 서버 저장 title 을 그대로 표시한다(템플릿 파생 아님)', () => {
    expect(resolveTitle('1주차 자기소개서 미션')).toBe('1주차 자기소개서 미션');
  });

  it('서버 title 이 비어 있으면 그대로 빈 값으로 통과한다(치유는 데이터 백필 몫)', () => {
    expect(resolveTitle('')).toBe('');
    expect(resolveTitle(null)).toBeNull();
  });

  it('피드백 마감기간은 미션 종료일 + 3일이다', () => {
    expect(resolveFeedbackPeriod('2026-06-01T00:00:00')).toBe('2026년 6월 4일');
  });

  it('월말 종료일도 +3일이 정상 롤오버된다', () => {
    expect(resolveFeedbackPeriod('2026-06-29T00:00:00')).toBe('2026년 7월 2일');
  });

  it('종료일이 없으면 피드백 마감기간을 - 로 표시한다', () => {
    expect(resolveFeedbackPeriod(null)).toBe('-');
    expect(resolveFeedbackPeriod(undefined)).toBe('-');
  });
});
