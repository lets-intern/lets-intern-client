import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import MissionCalendarItem from './MissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

const MissionCalendar = ({ schedules, todayTh, isDone }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { selectedMissionTh } = useMissionStore();
  const pathname = usePathname();

  const isMissionPage = useMemo(() => pathname.includes('/me'), [pathname]);

  const targetIndex = useMemo(() => {
    return isMissionPage ? (selectedMissionTh ?? todayTh) : todayTh;
  }, [isMissionPage, selectedMissionTh, todayTh]);

  useEffect(() => {
    const swiper = swiperRef.current;
    const isDesktop = window.innerWidth >= 768;

    if (!swiper || isDesktop) return;

    const startsFromZero = schedules[0]?.missionInfo?.th === 0;
    const visibleLimit = startsFromZero ? 3 : 4;

    if (targetIndex > visibleLimit) {
      swiper.slideTo(startsFromZero ? targetIndex : targetIndex - 1, 100);
    }
  }, [targetIndex, schedules.length, schedules]);

  const todaySchedule = schedules.find((s) => s.missionInfo.th === todayTh);
  const isTodayDone = todaySchedule?.attendanceInfo.result === 'PASS';

  const progress = isDone
    ? 100
    : isTodayDone
      ? Math.min(((todayTh + 1) / schedules.length) * 100, 100)
      : Math.min(((todayTh + 0.5) / schedules.length) * 100, 100);

  return (
    <div>
      <MissionProgressBar totalCards={schedules.length} progress={progress} />
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView="auto"
        breakpoints={{
          768: {
            slidesPerView: 10,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
          },
        }}
      >
        {schedules.map((schedule, index) => (
          <SwiperSlide key={index} className="mt-3 !w-[82px]">
            <MissionCalendarItem
              schedule={schedule}
              todayTh={todayTh}
              isDone={isDone}
              className="w-full cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MissionCalendar;

const SLIDE_WIDTH_PX = 80.5;

const MissionProgressBar = ({
  totalCards,
  progress,
}: {
  totalCards: number;
  progress: number;
}) => (
  <div
    className="bg-neutral-70 relative mt-3 hidden h-1 rounded-full md:block"
    style={{ width: `${totalCards * SLIDE_WIDTH_PX}px`, maxWidth: '100%' }}
  >
    <div
      className="bg-primary absolute h-1 rounded-full"
      style={{ width: `${progress}%` }}
    />
    <div
      className="bg-primary absolute top-1/2 h-2 w-2 rounded-full"
      style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
    />
  </div>
);
