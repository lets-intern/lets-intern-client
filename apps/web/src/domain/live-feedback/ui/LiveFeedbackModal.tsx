'use client';

import { useEffect, useRef, useState } from 'react';

import {
  JitsiEmbed,
  LiveSessionTimer,
  LiveFeedbackMaterials,
} from '@letscareer/ui/JitsiEmbed';

import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';

import type { LiveRole } from '../hooks/liveRole';

/** 멘티 라이브 출석 상태 */
type AttendanceStatus = 'PENDING' | 'PRESENT' | 'ABSENT';

interface LiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingUrl: string | null;
  spaceName?: string;
  /** 이 세션에서의 역할 — 멘토일 때만 출석 체크 노출. */
  role: LiveRole;
  menteeName: string;
  preQuestion?: string;
  submissionUrl?: string;
  startDate?: string;
  endDate?: string;
  menteeStatus?: AttendanceStatus;
  /** 출석 저장(모달 닫힘/종료 시 일괄). */
  onSaveAttendance?: (status: AttendanceStatus) => void;
  /** 우선순위 순 jitsi base 후보 — 현재 서버 실패 시 다음 후보로 failover. */
  baseCandidates?: ReadonlyArray<string | undefined>;
  /** 다음 base 를 BE 에 재등록하는 콜백 (`PATCH /feedback/{id}/meeting-url`). */
  registerBaseUrl?: (base: string) => Promise<void>;
  /** 모든 후보 소진(입장 가능한 서버 없음) 시 호출. */
  onExhausted?: () => void;
}

/** 출석 체크 바 — 참석/불참 토글. 한번 더 누르면 해제(저장은 지연). */
const MenteeAttendanceBar = ({
  menteeName,
  selected,
  onSelect,
}: {
  menteeName: string;
  selected: AttendanceStatus | null;
  onSelect: (status: AttendanceStatus | null) => void;
}) => {
  // 모바일에서 좁은 폭에 눌려도 칩 글자가 세로로 쪼개지지 않게 shrink-0·nowrap 고정.
  const baseChip =
    'shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:opacity-50 md:px-4';
  const toggle = (status: AttendanceStatus) =>
    onSelect(selected === status ? null : status);
  return (
    <div className="flex max-w-[calc(100vw-1rem)] items-center gap-1.5 rounded-full bg-black/45 py-1.5 pl-3 pr-1.5 text-white shadow-lg backdrop-blur-md md:gap-2 md:pl-4">
      <span className="shrink-0 whitespace-nowrap text-xs font-medium text-white/80">
        {menteeName} 님 출석
      </span>
      <span className="h-4 w-px shrink-0 bg-white/20" />
      <button
        type="button"
        onClick={() => toggle('PRESENT')}
        className={twMerge(
          baseChip,
          selected === 'PRESENT'
            ? 'bg-[#4d55f5] text-white'
            : 'text-white/80 hover:bg-white/10',
        )}
      >
        참석
      </button>
      <button
        type="button"
        onClick={() => toggle('ABSENT')}
        className={twMerge(
          baseChip,
          selected === 'ABSENT'
            ? 'bg-[#fc5555] text-white'
            : 'text-white/80 hover:bg-white/10',
        )}
      >
        불참
      </button>
    </div>
  );
};

/**
 * 라이브 피드백 입장 모달 — 멘토 앱 모달과 동일 디자인.
 *
 * - 4:3 모달, 좌상단 로고+타이머 아크릴(JitsiEmbed topLeftSlot).
 * - 좌하단 자료 버튼/패널(사전질문·제출물)은 공용 `LiveFeedbackMaterials` 사용(문구는 role 분기).
 * - 멘토 시점: 중앙 하단 출석 체크(토글). 저장은 닫힘/세션 종료 시 일괄(멘티 잠김 방지).
 * - 멘티 시점: 출석 체크 없이 동일 레이아웃.
 */
const LiveFeedbackModal = ({
  isOpen,
  onClose,
  meetingUrl,
  spaceName,
  role,
  menteeName,
  preQuestion,
  submissionUrl,
  startDate,
  endDate,
  menteeStatus,
  onSaveAttendance,
  baseCandidates,
  registerBaseUrl,
  onExhausted,
}: LiveFeedbackModalProps) => {
  const [pendingAttendance, setPendingAttendance] =
    useState<AttendanceStatus | null>(
      menteeStatus === 'PRESENT' || menteeStatus === 'ABSENT'
        ? menteeStatus
        : null,
    );
  const pendingRef = useRef(pendingAttendance);
  pendingRef.current = pendingAttendance;
  const savedRef = useRef(menteeStatus);
  savedRef.current = menteeStatus;
  const onSaveRef = useRef(onSaveAttendance);
  onSaveRef.current = onSaveAttendance;

  const flushAttendance = () => {
    const next = pendingRef.current;
    if (next && next !== savedRef.current) onSaveRef.current?.(next);
  };
  const handleClose = () => {
    flushAttendance();
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !endDate) return;
    const ms = new Date(endDate).getTime() - Date.now();
    if (ms <= 0) {
      flushAttendance();
      return;
    }
    const id = setTimeout(flushAttendance, ms);
    return () => clearTimeout(id);
    // flushAttendance 는 ref 기반 — isOpen/endDate 변화에만 재설정.
  }, [isOpen, endDate]);

  const isMentor = role === 'MENTOR';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      // z-10: 모달 콘텐츠(Jitsi iframe)를 오버레이 위로 명시 합성 — 모바일(iOS)에서
      // fixed 오버레이가 iframe 위를 덮어 터치가 막히던 문제 방지.
      className="rounded-xxl relative z-10 aspect-[4/3] h-[94vh] max-h-[980px] w-auto max-w-[96vw] overflow-hidden bg-neutral-900"
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0">
          {meetingUrl ? (
            <JitsiEmbed
              roomUrl={meetingUrl}
              spaceName={spaceName}
              onClose={handleClose}
              baseCandidates={baseCandidates}
              registerBaseUrl={registerBaseUrl}
              onExhausted={onExhausted}
              topLeftSlot={
                startDate && endDate ? (
                  <LiveSessionTimer endDate={endDate} />
                ) : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-300">
              회의실이 아직 준비되지 않았습니다.
              <br />
              멘토가 라이브 피드백에 입장하면 회의실이 열립니다.
            </div>
          )}
        </div>

        {/* 중앙 하단 — (멘토) 멘티 출석 체크 */}
        {isMentor && (
          <div
            className={twMerge(
              // 모바일은 Jitsi 하단 툴바(마이크·카메라·설정·통화)를 피해 더 위로 올린다.
              'absolute bottom-28 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300 md:bottom-20',
              pendingAttendance && 'opacity-50 hover:opacity-100',
            )}
          >
            <MenteeAttendanceBar
              menteeName={menteeName}
              selected={pendingAttendance}
              onSelect={setPendingAttendance}
            />
          </div>
        )}
      </div>

      {/* 좌하단 자료 패널 — 공용 컴포넌트(문구는 role 분기). */}
      <LiveFeedbackMaterials
        viewer={role === 'MENTEE' ? 'MENTEE' : 'MENTOR'}
        menteeName={menteeName}
        preQuestion={preQuestion}
        submissionUrl={submissionUrl}
      />
    </BaseModal>
  );
};

export default LiveFeedbackModal;
