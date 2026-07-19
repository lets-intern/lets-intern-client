'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import ProgramCard from '@/domain/program/programs/card/ProgramCard';
import { ProgramInfo } from '@/schema';
import { useSeminarList } from '../hooks/useSeminarList';
import { useSeminarStatusParam } from '../hooks/useSeminarStatusParam';
import { SeminarStatus } from '../utils/seminarStatus';
import SeminarStatusTabs from './SeminarStatusTabs';

const ERROR_MESSAGE =
  "세미나 조회 중 오류가 발생했습니다.\n새로고침 후에도 문제가 지속되면 아래 '채팅문의'를 통해 문의해주세요.";

interface SeminarListContentProps {
  status: SeminarStatus;
  isLoading: boolean;
  isError: boolean;
  programs: ProgramInfo[];
}

/** 세미나 리스트 본문 — 로딩/에러/빈 상태를 early return으로 가드한 뒤 카드 그리드를 렌더한다. */
const SeminarListContent = ({
  isLoading,
  isError,
  programs,
}: SeminarListContentProps) => {
  if (isLoading) return <LoadingContainer text="세미나 조회 중" />;

  if (isError) {
    return <p className="whitespace-pre-line text-center">{ERROR_MESSAGE}</p>;
  }

  if (programs.length === 0) {
    // TODO(2.5): 모집중 0건 빈 상태 UI로 대체
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-y-11">
      {programs.map((program) => (
        <ProgramCard
          key={program.programInfo.programType + program.programInfo.id}
          program={program}
        />
      ))}
    </div>
  );
};

/** 세미나 리스트 섹션(S4) — 모집상태 필터 탭 + LIVE 프로그램 카드 그리드. */
const SeminarListSection = () => {
  const [status] = useSeminarStatusParam();
  const { data, isLoading, isFetching, isError } = useSeminarList(status);
  const programs = data?.programList ?? [];

  return (
    <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 md:gap-11">
      <SeminarStatusTabs />
      <SeminarListContent
        status={status}
        isLoading={isLoading || isFetching}
        isError={isError}
        programs={programs}
      />
    </section>
  );
};

export default SeminarListSection;
