import dayjs from '@/lib/dayjs';
import { useQuery } from '@tanstack/react-query';
// import MissionCalendar from '../../../components/common/challenge/dashboard/mission-calendar/MissionCalendar';
import { useParams } from 'react-router-dom';
import { useUserQuery } from '../../../api/user';
import DailyMissionSection from '../../../components/common/challenge/dashboard/section/DailyMissionSection';
import EndDailyMissionSection from '../../../components/common/challenge/dashboard/section/EndDailyMissionSection';
import GuideSection from '../../../components/common/challenge/dashboard/section/GuideSection';
import NoticeSection from '../../../components/common/challenge/dashboard/section/NoticeSection';
import ScoreSection from '../../../components/common/challenge/dashboard/section/ScoreSection';
import MissionCalendar from '../../../components/common/challenge/my-challenge/mission-calendar/MissionCalendar';
import MissionTooltipQuestion from '../../../components/common/challenge/ui/tooltip-question/MissionTooltipQuestion';
import { useCurrentChallenge } from '../../../context/CurrentChallengeProvider';
import {
  challengeGuides,
  challengeNotices,
  challengeScore,
  Schedule,
} from '../../../schema';
import axios from '../../../utils/axios';

const getScoreFromSchedule = (schedule: Schedule) => {
  switch (schedule.attendanceInfo.status) {
    case 'ABSENT':
      return 0;
    case 'LATE':
    case 'PRESENT':
    case 'UPDATED':
      return 0;
  }
  return 0;
};

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

const getIsChallengeSubmitDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate).add(2, 'day'));
};

const ChallengeDashboard = () => {
  const { currentChallenge, schedules, dailyMission } = useCurrentChallenge();

  const params = useParams();

  const todayTh =
    dailyMission?.th ||
    schedules.reduce((th, schedule) => {
      return Math.max(th, schedule.missionInfo.th || 0);
    }, 0) + 1;

  const { data: notices = [] } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'notices', { size: 99 }],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${currentChallenge?.id}/notices`,
        { params: { size: 99 } },
      );
      return challengeNotices.parse(res.data.data).challengeNoticeList;
    },
  });

  const { data: guides = [] } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'guides'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${currentChallenge?.id}/guides`);
      return challengeGuides.parse(res.data.data).challengeGuideList;
    },
  });

  const { data: user } = useUserQuery();

  const { data: scoreGroup } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: ['challenge', currentChallenge?.id, 'score'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${currentChallenge?.id}/score`);
      return challengeScore.parse(res.data.data);
    },
  });

  const { data: programData } = useQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const programEndDate = programData?.data?.endDate;

  const totalScore = scoreGroup?.totalScore || 0;
  const currentScore = scoreGroup?.currentScore || 0;

  const isChallengeDone = getIsChallengeDone(programEndDate);
  const isChallengeSubmitDone = getIsChallengeSubmitDone(programEndDate);

  return (
    <main className="mr-[-1rem] pl-6">
      <header>
        <h1 className="text-2xl font-semibold">{user?.name}님의 대시보드</h1>
      </header>
      <div className="flex flex-col gap-4">
        <div className="mt-4 flex gap-4">
          {dailyMission ? (
            <DailyMissionSection dailyMission={dailyMission} />
          ) : (
            isChallengeDone && <EndDailyMissionSection />
          )}
          <div className="flex w-[12rem] flex-col gap-4">
            <ScoreSection
              programName={currentChallenge?.title || ''}
              isProgramDone={dayjs(new Date()).isAfter(
                currentChallenge?.endDate,
              )}
              desc={currentChallenge?.shortDesc || ''}
              startDate={
                currentChallenge?.startDate?.format('YYYY.MM.DD') || ''
              }
              endDate={currentChallenge?.endDate?.format('YYYY.MM.DD') || ''}
              userName={user?.name || ''}
              totalScore={totalScore}
              currentScore={currentScore}
            />
            <NoticeSection notices={notices} />
          </div>
          {/* <div className="flex h-full w-full max-w-[12rem] flex-col gap-4"> */}
          <GuideSection guides={guides} />
          {/* </div> */}
        </div>
        <div className="flex gap-4">
          <section className="flex-1 rounded-xl border border-neutral-80 px-10 py-8">
            <div className="flex items-center gap-2">
              <h2 className="text-1-bold text-neutral-30">
                일정 및 미션 제출 현황
              </h2>
              <MissionTooltipQuestion />
            </div>
            {schedules && (
              // myChallenge 에 있는 미션캘린더 가져옴
              <MissionCalendar
                className="mt-4"
                schedules={schedules}
                todayTh={todayTh}
                isDone={isChallengeSubmitDone}
              />
            )}
          </section>
          {/* <CurriculumSection /> */}
        </div>
      </div>
    </main>
  );
};

export default ChallengeDashboard;
