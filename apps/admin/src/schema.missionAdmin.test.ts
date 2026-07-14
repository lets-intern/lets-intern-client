import { describe, expect, it } from 'vitest';

import { missionAdmin } from './schema';

// BE(MissionAdminResponseDto)는 대기(확인중) 인원을 waitingAttendanceCount 로 내려준다.
// FE 화면(ChallengeOperationAttendances)은 waitingCount 로 읽으므로,
// missionAdmin 스키마가 필드명을 올바르게 매핑하는지 검증한다.
describe('missionAdmin 스키마 - waitingCount 필드명 정합', () => {
  const baseMission = {
    id: 1,
    th: 1,
    missionTag: '태그',
    missionType: 'OT',
    missionStatusType: 'WAITING',
    attendanceCount: 3,
    lateAttendanceCount: 0,
    wrongAttendanceCount: 0,
    waitingAttendanceCount: 5,
    applicationCount: 10,
    score: 100,
    lateScore: 50,
    missionTemplateId: 123,
    startDate: '2026-06-01T00:00:00',
    endDate: '2026-06-03T00:00:00',
    challengeOptionId: null,
    challengeOptionCode: null,
    essentialContentsList: null,
    additionalContentsList: null,
  };

  it('BE의 waitingAttendanceCount 를 화면용 waitingCount 로 매핑한다', () => {
    const result = missionAdmin.parse({ missionList: [baseMission] });

    expect(result.missionList[0].waitingCount).toBe(5);
  });

  it('waitingAttendanceCount 가 null 이면 waitingCount 도 null 로 유지한다', () => {
    const result = missionAdmin.parse({
      missionList: [{ ...baseMission, waitingAttendanceCount: null }],
    });

    expect(result.missionList[0].waitingCount).toBeNull();
  });

  it('변환 후 결과에는 waitingAttendanceCount 키가 남지 않는다', () => {
    const result = missionAdmin.parse({ missionList: [baseMission] });

    expect('waitingAttendanceCount' in result.missionList[0]).toBe(false);
  });
});
