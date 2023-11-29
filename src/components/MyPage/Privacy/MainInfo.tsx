import styled from 'styled-components';

import { SectionTitle } from '../Section';
import Input from './Input';
import FormButton from './FormButton';
import Label from './Label';
import ButtonGroup from './ButtonGroup';
import InputControl from './InputControl';

interface MainInfoProps {
  mainInfoValues: any;
  onChangeMainInfo: (e: any) => void;
  onSubmitMainInfo: (e: any) => void;
  onDeleteAccount: () => void;
}

const MainInfo = ({
  mainInfoValues,
  onChangeMainInfo,
  onSubmitMainInfo,
  onDeleteAccount,
}: MainInfoProps) => {
  return (
    <MainInfoBlock onSubmit={onSubmitMainInfo}>
      <SectionTitle>개인정보</SectionTitle>
      <Form>
        <InputControl>
          <Label>이름</Label>
          <Input
            placeholder="이름을 입력하세요."
            name="name"
            value={mainInfoValues.name}
            onChange={onChangeMainInfo}
            autoComplete="off"
          />
        </InputControl>
        <InputControl>
          <Label>이메일</Label>
          <Input
            placeholder="이메일을 입력하세요."
            name="email"
            value={mainInfoValues.email}
            onChange={onChangeMainInfo}
            autoComplete="off"
          />
        </InputControl>
        <InputControl>
          <Label>휴대폰 번호</Label>
          <Input
            placeholder="휴대폰 번호을 입력하세요."
            name="phoneNum"
            value={mainInfoValues.phoneNum}
            onChange={onChangeMainInfo}
            autoComplete="off"
          />
        </InputControl>
        <ButtonGroup>
          <FormButton type="submit">정보 수정</FormButton>
          <FormButton type="button" onClick={onDeleteAccount}>
            회원 탈퇴
          </FormButton>
        </ButtonGroup>
      </Form>
    </MainInfoBlock>
  );
};

export default MainInfo;

const MainInfoBlock = styled.section``;

const Form = styled.form``;