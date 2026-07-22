/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import LiveFeedbackModal from './LiveFeedbackModal';

jest.mock('@letscareer/ui/JitsiEmbed', () => ({
  __esModule: true,
  JitsiEmbed: ({ roomUrl }: { roomUrl: string }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl} />
  ),
  LiveSessionTimer: () => <div data-testid="live-session-timer" />,
  LiveFeedbackMaterials: () => <div data-testid="live-feedback-materials" />,
}));

describe('LiveFeedbackModal', () => {
  beforeAll(() => {
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  it('멘토 모드에서는 모바일 출석 바 앵커를 자료 FAB 위(좌하단 고정) 위치 클래스로 렌더한다', () => {
    render(
      <LiveFeedbackModal
        isOpen
        onClose={() => {}}
        meetingUrl="https://meet.jit.si/letscareer-room"
        role="MENTOR"
        menteeName="임성빈"
        startDate="2026-07-22T17:30:00+09:00"
        endDate="2026-07-22T18:00:00+09:00"
      />,
    );

    const anchor = screen.getByTestId('mentor-attendance-anchor');
    // 모바일: 좌하단 자료 FAB 스택 바로 위 고정. 데스크톱: 하단 중앙.
    expect(anchor).toHaveClass('fixed');
    expect(anchor).toHaveClass('bottom-32');
    expect(anchor).toHaveClass('left-6');
    expect(anchor).toHaveClass('md:bottom-20');
  });

  it('멘티 모드에서는 출석 바를 렌더하지 않는다', () => {
    render(
      <LiveFeedbackModal
        isOpen
        onClose={() => {}}
        meetingUrl="https://meet.jit.si/letscareer-room"
        role="MENTEE"
        menteeName="임성빈"
      />,
    );

    expect(
      screen.queryByTestId('mentor-attendance-anchor'),
    ).not.toBeInTheDocument();
  });
});
