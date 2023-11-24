import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TD from '../TD';

const UserTableBody = () => {
  return (
    <tbody>
      <tr>
        <TD>회원</TD>
        <TD>에브리타임</TD>
        <TD>mshong1007@gmail.com</TD>
        <TD>010-3449-6933</TD>
        <TD>성균관대학교</TD>
        <TD>2학년</TD>
        <TD>컴퓨터교육과</TD>
        <TD>프론트엔드</TD>
        <TD>스타트업, 대기업</TD>
        <TD>좋아요</TD>
        <TD>
          <FormControl sx={{ width: 100 }}>
            <InputLabel id="type">참여 확정</InputLabel>
            <Select labelId="type" id="type" label="참여 확정">
              <MenuItem value="PUBLIC">승인</MenuItem>
              <MenuItem value="PRIVATE">거절</MenuItem>
            </Select>
          </FormControl>
        </TD>
        <TD>2023-05-05</TD>
      </tr>
    </tbody>
  );
};

export default UserTableBody;