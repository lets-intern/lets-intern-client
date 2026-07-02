import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MentorOpenScheduleModal from '../modal/MentorOpenScheduleModal';

const focusDate = '2026-05-11';

describe('MentorOpenScheduleModal (콘텐츠 추출 후 회귀)', () => {
  it('isOpen=false 일 때 본문을 렌더하지 않는다', () => {
    render(
      <MentorOpenScheduleModal
        isOpen={false}
        onClose={() => {}}
        initialSlots={[]}
        onSave={() => {}}
        focusDate={focusDate}
      />,
    );
    expect(
      screen.queryByRole('button', { name: '저장하기' }),
    ).not.toBeInTheDocument();
  });

  it('isOpen=true 일 때 콘텐츠가 마운트되고 저장 버튼이 노출된다 (되돌리기는 변경 시에만)', () => {
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={() => {}}
        initialSlots={[]}
        onSave={() => {}}
        focusDate={focusDate}
      />,
    );
    expect(
      screen.getByRole('button', { name: '저장하기' }),
    ).toBeInTheDocument();
    // 되돌리기는 변경사항이 있을 때만 노출 → 초기엔 없음
    expect(
      screen.queryByRole('button', { name: '되돌리기' }),
    ).not.toBeInTheDocument();
  });

  it('닫기(X) 버튼 클릭 시 onClose 호출', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={onClose}
        initialSlots={[]}
        onSave={() => {}}
        focusDate={focusDate}
      />,
    );
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('저장 버튼 클릭 시 onSave + onClose 모두 호출', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={onClose}
        initialSlots={[{ date: focusDate, time: '10:00' }]}
        onSave={onSave}
        focusDate={focusDate}
      />,
    );
    await user.click(screen.getByRole('button', { name: '저장하기' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('challengeTitles 가 상단 바에 모두 노출된다', () => {
    render(
      <MentorOpenScheduleModal
        isOpen
        onClose={() => {}}
        initialSlots={[]}
        onSave={() => {}}
        challengeTitles={['테스트 챌린지 A', '테스트 챌린지 B']}
        focusDate={focusDate}
      />,
    );
    expect(screen.getByText('테스트 챌린지 A')).toBeInTheDocument();
    expect(screen.getByText('테스트 챌린지 B')).toBeInTheDocument();
  });

  // 3.5.T1 — 슬롯 오픈 기간 게이팅 (현재 시각 기준 window 안/밖)
  describe('슬롯 오픈 기간 게이팅', () => {
    const DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    // 현재 시각이 안에 드는 window (어제 ~ 내일) → 오픈 가능
    const insideWindow = {
      start: new Date(now - DAY_MS),
      end: new Date(now + DAY_MS),
    };
    // 현재 시각보다 앞선 과거 window (5일 전 ~ 3일 전) → 오픈 불가
    const outsideWindow = {
      start: new Date(now - 5 * DAY_MS),
      end: new Date(now - 3 * DAY_MS),
    };

    it('기간 밖이면 안내가 노출되고 저장 버튼이 비활성화된다', () => {
      render(
        <MentorOpenScheduleModal
          isOpen
          onClose={() => {}}
          initialSlots={[]}
          onSave={() => {}}
          focusDate={focusDate}
          slotOpenWindow={outsideWindow}
        />,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled();
    });

    it('기간 안이면 안내가 없고 저장 버튼이 활성화된다', () => {
      render(
        <MentorOpenScheduleModal
          isOpen
          onClose={() => {}}
          initialSlots={[]}
          onSave={() => {}}
          focusDate={focusDate}
          slotOpenWindow={insideWindow}
        />,
      );
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '저장하기' }),
      ).not.toBeDisabled();
    });

    it('slotOpenWindow 미지정 시 게이팅하지 않는다 (BE 미반영 폴백)', () => {
      render(
        <MentorOpenScheduleModal
          isOpen
          onClose={() => {}}
          initialSlots={[]}
          onSave={() => {}}
          focusDate={focusDate}
        />,
      );
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '저장하기' }),
      ).not.toBeDisabled();
    });
  });
});
