import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { mentorFeedbackManagementSchema } from '../challengeSchema';

/**
 * 공유 MSW 핸들러(@letscareer/mocks)가 멘토 서면 피드백 현황 엔드포인트에 대해
 * BE 스키마(mentorFeedbackManagementSchema)를 통과하는 응답을 돌려주는지 검증한다.
 *
 * (기존 feedback-management/mocks/writtenChallengeMock.ts 시나리오 이관 결과 가드)
 * 와일드카드 prefix 패턴이라 임의 origin 으로 요청해도 매칭된다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('멘토 서면 피드백 현황 MSW 핸들러', () => {
  it('GET /challenge/mentor/feedback-management → mentorFeedbackManagementSchema 통과', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    expect(parsed.challengeList.length).toBeGreaterThan(0);
    expect(parsed.challengeList[0].challengeId).toBe(1);
    expect(parsed.challengeList[0].feedbackMissions.length).toBeGreaterThan(0);
  });

  it('feedbackMissions의 feedbackStatusCounts가 스키마 enum을 따른다', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    const allCounts = parsed.challengeList.flatMap((c) =>
      c.feedbackMissions.flatMap((m) => m.feedbackStatusCounts),
    );
    expect(allCounts.length).toBeGreaterThan(0);
    for (const item of allCounts) {
      expect(['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CONFIRMED']).toContain(
        item.feedbackStatus,
      );
    }
  });

  it('generic */challenge/:id 패턴보다 먼저 매칭되어 가로채이지 않는다', async () => {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    // feedback-management 핸들러가 우선 매칭되어 challengeList를 반환해야 한다.
    expect(body.data).toHaveProperty('challengeList');
    expect(body.data).not.toHaveProperty('liveFeedbackList');
  });
});

describe('경험정리 EXPERIENCE_1/EXPERIENCE_2 페어 목업 시나리오', () => {
  /** 같은 challengeId+th를 공유하는 EXPERIENCE_1/EXPERIENCE_2 미션 쌍을 찾는다. */
  async function findExperiencePairs() {
    const res = await fetch(`${BASE}/challenge/mentor/feedback-management`);
    const body = await res.json();
    const parsed = mentorFeedbackManagementSchema.parse(body.data);

    const pairs: Array<{
      challengeId: number;
      th: number;
      exp1: { submittedCount: number };
      exp2: { submittedCount: number };
    }> = [];
    for (const challenge of parsed.challengeList) {
      const byTh = new Map<
        number,
        { exp1?: { submittedCount: number }; exp2?: { submittedCount: number } }
      >();
      for (const mission of challenge.feedbackMissions) {
        if (
          mission.missionType !== 'EXPERIENCE_1' &&
          mission.missionType !== 'EXPERIENCE_2'
        )
          continue;
        const entry = byTh.get(mission.th) ?? {};
        if (mission.missionType === 'EXPERIENCE_1') entry.exp1 = mission;
        else entry.exp2 = mission;
        byTh.set(mission.th, entry);
      }
      for (const [th, entry] of byTh) {
        if (entry.exp1 && entry.exp2)
          pairs.push({
            challengeId: challenge.challengeId,
            th,
            exp1: entry.exp1,
            exp2: entry.exp2,
          });
      }
    }
    return pairs;
  }

  it('같은 challengeId+th를 공유하는 EXPERIENCE_1/EXPERIENCE_2 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(pairs.length).toBeGreaterThanOrEqual(3);
  });

  it('케이스 A: EXPERIENCE_1만 제출된 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(
      pairs.some(
        (p) => p.exp1.submittedCount > 0 && p.exp2.submittedCount === 0,
      ),
    ).toBe(true);
  });

  it('케이스 B: EXPERIENCE_2만 제출된 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(
      pairs.some(
        (p) => p.exp1.submittedCount === 0 && p.exp2.submittedCount > 0,
      ),
    ).toBe(true);
  });

  it('케이스 C: 두 미션 모두 제출 기록이 있는 페어가 존재한다', async () => {
    const pairs = await findExperiencePairs();
    expect(
      pairs.some((p) => p.exp1.submittedCount > 0 && p.exp2.submittedCount > 0),
    ).toBe(true);
  });
});
