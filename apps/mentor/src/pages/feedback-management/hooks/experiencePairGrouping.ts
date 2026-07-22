import type { MentorMissionType } from '@/api/challenge/challengeSchema';

/**
 * 경험정리(EXPERIENCE_1/EXPERIENCE_2) 미션 그룹핑 유틸.
 *
 * 관리자가 같은 회차(`th`)에 경험정리 미션을 `missionType = EXPERIENCE_1`/`EXPERIENCE_2`
 * 두 개의 별도 `missionId`로 등록해, 멘토 피드백 표에서 멘티가 두 행으로 중복 표시된다
 * (PRD §1). 같은 `challengeId`+`th`의 EXPERIENCE_1/EXPERIENCE_2 쌍을 찾아 두는 게 첫 단계다.
 */

/** 페어 판별에 필요한 미션 최소 정보 — 챌린지 컨텍스트(challengeId)를 함께 받는다. */
export interface ExperienceMissionInput {
  challengeId: number;
  th: number;
  missionId: number;
  missionType?: MentorMissionType | null;
}

/** 같은 회차의 경험정리 페어 — 각 타입의 `missionId`. */
export interface ExperiencePair {
  exp1MissionId: number;
  exp2MissionId: number;
}

/** 페어 키: `${challengeId}-${th}` */
export type ExperiencePairKey = string;

/**
 * 같은 `challengeId`+`th` 안에서 EXPERIENCE_1/EXPERIENCE_2 미션을 짝짓는다.
 * 한쪽만 있는 경우(짝이 안 맞음)는 페어에 넣지 않아 원래대로 표시되게 한다.
 * 경험정리 아닌 미션(OT/POOL/BONUS/null 등)은 조기 skip 한다.
 */
export function findExperienceMissionPairs(
  missions: ExperienceMissionInput[],
): Map<ExperiencePairKey, ExperiencePair> {
  const byKey = new Map<
    ExperiencePairKey,
    { exp1MissionId?: number; exp2MissionId?: number }
  >();

  for (const mission of missions) {
    if (
      mission.missionType !== 'EXPERIENCE_1' &&
      mission.missionType !== 'EXPERIENCE_2'
    ) {
      continue;
    }
    const key = `${mission.challengeId}-${mission.th}`;
    const entry = byKey.get(key) ?? {};
    if (mission.missionType === 'EXPERIENCE_1') {
      entry.exp1MissionId = mission.missionId;
    } else {
      entry.exp2MissionId = mission.missionId;
    }
    byKey.set(key, entry);
  }

  const pairs = new Map<ExperiencePairKey, ExperiencePair>();
  for (const [key, entry] of byKey) {
    if (entry.exp1MissionId !== undefined && entry.exp2MissionId !== undefined) {
      pairs.set(key, {
        exp1MissionId: entry.exp1MissionId,
        exp2MissionId: entry.exp2MissionId,
      });
    }
  }
  return pairs;
}
