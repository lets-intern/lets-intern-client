import dayjs from '@/lib/dayjs';

import type {
  AttendanceStatus,
  FeedbackAttendanceStatus,
  FeedbackStatus,
} from '@/api/feedback/feedbackSchema';
import { STATUS_BADGE } from '@/constants/statusColors';

/**
 * 라이브 피드백 모달에서 사용하는 4종 진행 상태.
 * PRD §5.4 정의표 + image copy 3.png 참고.
 *
 * - waiting:    예약 시간 전 (status=RESERVED, now < startAt)
 * - inProgress: 예약 시간 중 (status=RESERVED, startAt ≤ now < endAt)
 * - completed:  멘토/멘티 정상 참가 (status=COMPLETED)
 * - missed:     불참/취소 또는 종료 후 미진행 (status=CANCELED, 또는 RESERVED + now ≥ endAt)
 */
export type LiveFeedbackUiStatus =
  | 'waiting'
  | 'inProgress'
  | 'completed'
  | 'missed';

export interface LiveFeedbackBadgeVisual {
  /** 화면 표기 라벨 ("진행 예정" / "진행 중" / "진행 완료" / "미진행") */
  label: string;
  /** STATUS_BADGE 토큰 (border + bg + text) */
  badgeClass: string;
}

const VISUALS: Record<LiveFeedbackUiStatus, LiveFeedbackBadgeVisual> = {
  waiting: { label: '진행 예정', badgeClass: STATUS_BADGE.waiting },
  inProgress: { label: '진행 중', badgeClass: STATUS_BADGE.inProgress },
  completed: { label: '진행 완료', badgeClass: STATUS_BADGE.completed },
  missed: { label: '미진행', badgeClass: STATUS_BADGE.absent },
};

/**
 * `feedback.status` + 현재시각(now) + `startDate`/`endDate` 조합으로
 * 4종 UI 상태를 결정한다.
 *
 * 주의: BE의 자동 상태 전이는 미구현이므로 RESERVED 상태에서도 시간이
 * 지나면 FE가 "미진행"으로 대체 표시한다 (PRD §5.4 mentor3.14 노트).
 */
/**
 * 라이브 세션 진행 상태를 `경험정리 제출 + BE status + 멘토 출석 + 시간`으로 결정한다.
 *
 * BE가 종료 후에도 `status`를 RESERVED로 유지하고 출석(mentorStatus/menteeStatus)만
 * 채우는 경우가 있어, 시간만으로 판정하면 "정상 진행된 세션"이 '미진행'으로 잘못 표시된다.
 * → 종료 후 RESERVED 건은 출석으로 완료/미진행을 가른다.
 *
 * 완료 판정(PRD §2·§3): 종료 후 **멘토가 출석(PRESENT)하면 진행 완료**(멘티 출석 무관).
 * 멘토 미참여면 미진행. (기존 "양측 PRESENT" 조건을 "멘토 PRESENT"로 완화.)
 *
 * - 미제출(attendanceStatus LATE|ABSENT) → missed  (최우선, 시각·출석 무관)
 * - CANCELED            → missed
 * - COMPLETED           → completed
 * - 시작 전             → waiting
 * - 진행 중             → inProgress
 * - 종료 후 + 멘토 출석  → completed
 * - 종료 후 + 그 외      → missed
 *
 * 출석 인자를 생략하면 PENDING으로 보아 기존(시간 기준) 동작과 동일하다(하위 호환).
 */
export function resolveLiveSessionStatus(input: {
  rawStatus: FeedbackStatus;
  mentorStatus?: FeedbackAttendanceStatus;
  /**
   * 멘티 라이브 출석. 완료 판정에는 더 이상 영향 없음(멘토 출석만으로 완료).
   * 호출부 호환·향후 확장을 위해 시그니처는 유지한다.
   */
  menteeStatus?: FeedbackAttendanceStatus;
  /**
   * 경험정리(서면) 제출 상태. `LATE`|`ABSENT`(미제출)이면 최우선으로 미진행 처리한다.
   * 미전달 시 미제출 판정을 생략하고 기존 로직을 따른다(하위 호환).
   */
  attendanceStatus?: AttendanceStatus;
  startDate: string;
  endDate: string;
  now: Date;
}): LiveFeedbackUiStatus {
  const { rawStatus, mentorStatus, attendanceStatus, startDate, endDate, now } =
    input;

  // 최우선: 경험정리 미제출(LATE|ABSENT)이면 시각·출석과 무관하게 미진행.
  if (attendanceStatus === 'LATE' || attendanceStatus === 'ABSENT')
    return 'missed';

  if (rawStatus === 'CANCELED') return 'missed';
  if (rawStatus === 'COMPLETED') return 'completed';

  // RESERVED: 시간으로 분기
  const nowMs = now.getTime();
  const startMs = dayjs(startDate).valueOf();
  const endMs = dayjs(endDate).valueOf();

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 'waiting';
  if (nowMs < startMs) return 'waiting';
  if (nowMs < endMs) return 'inProgress';
  // 종료 후 RESERVED → 멘토 출석만으로 완료/미진행 분기 (멘티 출석 무관).
  if (mentorStatus === 'PRESENT') return 'completed';
  return 'missed';
}

/** @deprecated `resolveLiveSessionStatus` 사용. 출석 없이 status+시간만으로 판정(하위 호환). */
export function resolveLiveFeedbackStatus(
  apiStatus: FeedbackStatus,
  startDate: string,
  endDate: string,
  now: Date,
): LiveFeedbackUiStatus {
  return resolveLiveSessionStatus({
    rawStatus: apiStatus,
    startDate,
    endDate,
    now,
  });
}

export function getLiveFeedbackBadgeVisual(
  status: LiveFeedbackUiStatus,
): LiveFeedbackBadgeVisual {
  return VISUALS[status];
}
