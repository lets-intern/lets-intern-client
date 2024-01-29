import { useRef } from 'react';
import styled from 'styled-components';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

import Card from './Card';

interface SliderButtonProps {
  scrollContainer: React.RefObject<HTMLDivElement>;
  direction: 'prev' | 'next';
  className?: string;
}

interface ProgramListSliderProps {
  programs: any;
  cardType?: '신청 완료' | '참여 중' | '참여 완료' | '';
  loading?: boolean;
  page?: 'main' | 'review' | 'review-create' | 'application';
}

const SlideContent = styled.div`
  scrollbar-width: none; /* FireFox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera, ... */
  }

  &::-ms-scrollbar {
    display: none; /* Internet Explorer, Edge */
  }
`;

const SlideButton = ({
  scrollContainer,
  direction,
  className,
}: SliderButtonProps) => {
  return (
    <button
      className={`hidden text-2xl sm:block${className ? ` ${className}` : ''}`}
      onClick={() => {
        if (scrollContainer.current === null) return;
        const offsetWidth = scrollContainer.current.offsetWidth;
        scrollContainer.current.scrollLeft +=
          direction === 'prev' ? -offsetWidth : offsetWidth;
      }}
    >
      <i>
        {direction === 'prev' ? <MdArrowBackIosNew /> : <MdArrowForwardIos />}
      </i>
    </button>
  );
};

const ProgramListSlider = ({
  programs,
  cardType = '',
  loading,
  page = 'main',
}: ProgramListSliderProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-3">
      <SlideButton scrollContainer={scrollContainer} direction="prev" />
      <SlideContent
        ref={scrollContainer}
        className="flex grow overflow-x-scroll scroll-smooth py-5"
      >
        {loading ? (
          <div className="h-[20rem] w-full"></div>
        ) : programs.length === 0 ? (
          <div className="flex h-[20rem] w-full items-center justify-center text-neutral-grey">
            현재 진행 중인 프로그램이 없습니다.
          </div>
        ) : (
          <div className="flex gap-5">
            {programs.map((program: any) => {
              return (
                <Card
                  key={program.id}
                  program={program}
                  reviewId={10}
                  cardType={cardType}
                  loading={loading}
                  page={page}
                />
              );
            })}
          </div>
        )}
      </SlideContent>
      <SlideButton scrollContainer={scrollContainer} direction="next" />
    </div>
  );
};

export default ProgramListSlider;