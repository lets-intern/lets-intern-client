import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import axios from '../../../../../utils/axios';
import TD from '../../../ui/table/TD';
import { bankTypeToText, wishJobToText } from '../../../../../utils/convert';
import parseInflowPath from '../../../../../utils/parseInflowPath';
import parseGrade from '../../../../../utils/parseGrade';
import { useState } from 'react';

interface Props {
  application: any;
  program: any;
  handleApplicationStatusChange: any;
}

const TableRow = ({
  application,
  program,
  handleApplicationStatusChange,
}: Props) => {
  const [isFeeConfirmed, setIsFeeConfirmed] = useState(
    application.application.feeIsConfirmed,
  );

  const editIsFeeConfirmed = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `/application/${application.application.id}`,
        {
          feeIsConfirmed: !isFeeConfirmed,
        },
      );
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      setIsFeeConfirmed(!isFeeConfirmed);
    },
  });

  return (
    <tr>
      <TD>
        {application.application.type === 'USER'
          ? '회원'
          : application.application.type === 'GUEST' && '비회원'}
      </TD>
      <TD>{parseInflowPath(application.application.inflowPath)}</TD>
      <TD>{application.application.email}</TD>
      <TD>
        {application.optionalInfo ? (
          <Link
            to={`/admin/users/${application.optionalInfo.userId}`}
            className="cursor-pointer text-neutral-grey underline"
          >
            {application.application.name}
          </Link>
        ) : (
          <span>{application.application.name}</span>
        )}
      </TD>
      <TD>{application.application.phoneNum}</TD>
      <TD>
        {application.optionalInfo ? application.optionalInfo.university : ''}
      </TD>
      <TD>{parseGrade(application.application.grade)}</TD>
      <TD>{application.optionalInfo ? application.optionalInfo.major : ''}</TD>
      <TD>
        {application.optionalInfo
          ? `${bankTypeToText[application.optionalInfo.accountType] || ''} ${
              application.optionalInfo.accountNumber || ''
            }`
          : ''}
      </TD>
      <TD whiteSpace="wrap">
        <Checkbox
          checked={isFeeConfirmed}
          onChange={() => editIsFeeConfirmed.mutate()}
        />
      </TD>
      <TD whiteSpace="wrap">
        {wishJobToText[application.application.wishJob]}
      </TD>
      <TD whiteSpace="wrap">{application.application.wishCompany}</TD>
      <TD whiteSpace="wrap">{application.application.applyMotive}</TD>
      <TD>
        {application.application.way === 'OFFLINE'
          ? '오프라인'
          : application.application.way === 'ONLINE'
          ? '온라인'
          : ''}
      </TD>
      <TD>
        <FormControl>
          <InputLabel id="status">참가 확정</InputLabel>
          <Select
            labelId="status"
            id="status"
            label="참가 확정"
            name="status"
            value={application.application.status}
            onChange={(e) =>
              handleApplicationStatusChange(e, application.application.id)
            }
            disabled={program.status === 'DONE'}
          >
            <MenuItem value="APPLIED">대기</MenuItem>
            <MenuItem value="IN_PROGRESS">참가확정</MenuItem>
            <MenuItem value="APPLIED_NOT_APPROVED">미선발</MenuItem>
          </Select>
        </FormControl>
      </TD>
      <TD>{application.application.createdAt}</TD>
      <TD whiteSpace="wrap">{application.application.preQuestions}</TD>
    </tr>
  );
};

export default TableRow;