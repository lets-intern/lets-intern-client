import { useGetProgramAdminQuery } from '@/api/program';
import { ProgramStatusEnum } from '@/schema';
import { newProgramTypeToText, programStatusToText } from '@/utils/convert';
import { MenuItem } from '@mui/material';
import { useMemo } from 'react';

const { PROCEEDING, PREV } = ProgramStatusEnum.enum;

export default function useProgramMenuItems() {
  const { data } = useGetProgramAdminQuery({
    page: 1,
    size: 10000,
    status: [PROCEEDING, PREV],
  });

  const programMenuItems = useMemo(
    () => [
      <MenuItem key="null" value="null">
        선택 안 함
      </MenuItem>,
      ...(data?.programList.map((program) => {
        if (program.programInfo.isVisible)
          return (
            <MenuItem
              key={program.programInfo.programType + program.programInfo.id}
              value={`${program.programInfo.programType}-${program.programInfo.id}`}
            >
              {`[${newProgramTypeToText[program.programInfo.programType]}/${programStatusToText[program.programInfo.programStatusType]}] ${program.programInfo.title}`}
            </MenuItem>
          );
      }) ?? []),
    ],
    [data],
  );

  return programMenuItems;
}
