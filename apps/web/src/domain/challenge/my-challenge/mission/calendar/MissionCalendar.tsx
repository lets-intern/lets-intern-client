import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const barRef = useRef<HTMLDivElement>(null);
  const { selectedMissionTh } = useMissionStore();
  const pathname = usePathname();

  const [isLocked, setIsLocked] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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

  const getStep = (swiper: SwiperType) => {
    return Math.max(Math.round(swiper.slidesPerViewDynamic() / 2), 1);
  };

  const updateEdgeState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrev = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const step = getStep(swiper);
    swiper.slideTo(Math.max(swiper.activeIndex - step, 0));
  };

  const handleNext = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const step = getStep(swiper);
    swiper.slideTo(
      Math.min(swiper.activeIndex + step, swiper.slides.length - 1),
    );
  };

  const todaySchedule = schedules.find((s) => s.missionInfo.th === todayTh);
  const isTodayDone = todaySchedule?.attendanceInfo.result === 'PASS';

  const progress = isDone
    ? 100
    : isTodayDone
      ? Math.min(((todayTh + 1) / schedules.length) * 100, 100)
      : Math.min(((todayTh + 0.5) / schedules.length) * 100, 100);

  return (
    <div>
      <div
        className="hidden md:block"
        style={{ overflow: 'hidden', padding: '4px 0', margin: '-4px 0' }}
      >
        <div ref={barRef}>
          <MissionProgressBar
            totalCards={schedules.length}
            progress={progress}
          />
        </div>
      </div>
      <div className="group relative">
        {!isLocked && !isBeginning && (
          <button
            type="button"
            aria-label="이전 미션 보기"
            onClick={handlePrev}
            className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900/20 text-white transition hover:bg-neutral-900/40 md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {!isLocked && !isEnd && (
          <button
            type="button"
            aria-label="다음 미션 보기"
            onClick={handleNext}
            className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-neutral-900/20 text-white transition hover:bg-neutral-900/40 md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        )}
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsLocked(swiper.isLocked);
            updateEdgeState(swiper);
          }}
          onSlideChange={updateEdgeState}
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
          onTouchMove={(swiper) => {
            if (barRef.current) {
              barRef.current.style.transition = 'none';
              barRef.current.style.transform = `translateX(${swiper.translate}px)`;
            }
          }}
          onTransitionStart={(swiper) => {
            const s = swiper as SwiperType;
            if (barRef.current) {
              barRef.current.style.transition = `transform ${s.params.speed}ms ease`;
              barRef.current.style.transform = `translateX(${s.translate}px)`;
            }
          }}
          onTransitionEnd={(swiper) => {
            const s = swiper as SwiperType;
            if (barRef.current) {
              barRef.current.style.transition = 'none';
              barRef.current.style.transform = `translateX(${s.translate}px)`;
            }
            updateEdgeState(swiper);
          }}
          slidesPerView="auto"
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
    className="bg-neutral-70 relative mt-3 h-1 rounded-full"
    style={{ width: `${totalCards * SLIDE_WIDTH_PX}px` }}
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
