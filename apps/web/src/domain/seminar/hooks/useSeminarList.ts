import { useGetUserProgramQuery } from '@/api/program';
import { PROGRAM_TYPE } from '@/utils/programConst';
import {
  SeminarStatus,
  seminarStatusToProgramStatus,
} from '../utils/seminarStatus';

/** figma 2행 그리드 기준 초기 로드 개수 */
const SEMINAR_LIST_SIZE = 8;

/**
 * 무료 세미나(LIVE 프로그램) 목록 조회 훅.
 * 모집상태별로 LIVE 프로그램을 조회한다. TanStack `UseQueryResult`를 그대로 반환한다.
 */
export const useSeminarList = (status: SeminarStatus) =>
  useGetUserProgramQuery({
    pageable: { page: 1, size: SEMINAR_LIST_SIZE },
    searchParams: {
      type: PROGRAM_TYPE.LIVE,
      status: seminarStatusToProgramStatus(status),
    },
  });
