import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useMentorChallengeListQuery } from '@/api/user/user';
import {
  useLiveFeedbackList,
  type LiveFeedbackRound,
} from '@/pages/feedback-management/hooks/useLiveFeedbackList';
import type { PeriodBarData } from '@/pages/schedule/types';

interface FeedbackModalState {
  isOpen: boolean;
  missionId: number;
  missionTh: number;
}

/**
 * Manages challenge detail page data and feedback modal state.
 *
 * 미션 클릭 시 타입(`challengeOptionType`)에 따라 분기한다:
 *  - WRITTEN_FEEDBACK → 서면 `FeedbackModal`
 *  - LIVE_FEEDBACK    → 라이브 `LiveFeedbackReservationModal`
 *    (해당 챌린지의 라이브 세션은 `useLiveFeedbackList`에서 title 매칭으로 가져온다)
 */
export function useChallengeDetail() {
  const params = useParams<{ challengeId: string }>();
  const challengeId = Number(params.challengeId);

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    missionId: 0,
    missionTh: 0,
  });

  // Get challenge title from list
  const { data: challengeListData } = useMentorChallengeListQuery();
  const challenge = challengeListData?.myChallengeMentorVoList.find(
    (c) => c.challengeId === challengeId,
  );
  const challengeTitle = challenge?.title ?? '';

  // Get mission list
  const { data: missionData, isLoading } =
    useMentorMissionFeedbackListQuery(challengeId);
  const missions = missionData?.missionList ?? [];

  // 라이브 피드백 세션 — 이 챌린지(title 매칭)의 회차별 세션 바.
  const { challenges: liveChallenges, allSessionBars } = useLiveFeedbackList();
  const liveRounds = useMemo<LiveFeedbackRound[]>(
    () => liveChallenges.find((c) => c.title === challengeTitle)?.rounds ?? [],
    [liveChallenges, challengeTitle],
  );

  const [liveModalBar, setLiveModalBar] = useState<PeriodBarData | null>(null);
  const [liveSelectedRound, setLiveSelectedRound] =
    useState<LiveFeedbackRound | null>(null);

  const handleClickFeedback = (missionId: number, missionTh: number) => {
    const mission = missions.find((m) => m.id === missionId);

    // 라이브 피드백 미션 → 라이브 모달 (해당 회차 세션으로 네비게이션)
    if (mission?.challengeOptionType === 'LIVE_FEEDBACK') {
      const round =
        liveRounds.find((r) => r.th === missionTh) ?? liveRounds[0] ?? null;
      const firstBar = round?.sessionBars[0] ?? null;
      if (firstBar) {
        setLiveSelectedRound(round);
        setLiveModalBar(firstBar);
      }
      return;
    }

    // 서면 피드백 미션 → 서면 모달
    setFeedbackModal({ isOpen: true, missionId, missionTh });
  };

  const handleCloseModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  const closeLiveModal = () => {
    setLiveSelectedRound(null);
    setLiveModalBar(null);
  };

  /** 라이브 미션(회차)의 예약 세션(멘티) 수 — 없으면 0. */
  const liveMenteeCount = (missionTh: number) => {
    const round =
      liveRounds.find((r) => r.th === missionTh) ?? liveRounds[0] ?? null;
    return round?.sessionBars.length ?? 0;
  };

  /** 라이브 미션(회차)에 열 수 있는 세션이 있는지 — 없으면 버튼 비활성. */
  const canOpenLiveMission = (missionTh: number) =>
    liveMenteeCount(missionTh) > 0;

  return {
    challengeId,
    challenge,
    challengeTitle,
    missions,
    isLoading,
    feedbackModal,
    handleClickFeedback,
    handleCloseModal,
    // 라이브 피드백 모달
    liveModalBar,
    liveSelectedRound,
    allSessionBars,
    setLiveModalBar,
    closeLiveModal,
    canOpenLiveMission,
    liveMenteeCount,
  };
}
