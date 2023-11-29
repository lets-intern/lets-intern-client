import styled from 'styled-components';
import { IoIosSearch } from 'react-icons/io';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Input from '../../Input';
import ActionButton from '../ActionButton';

interface FilterProps {
  searchValues: any;
  managers: any[];
  onChangeSearchValues: (e: any) => void;
}

const Filter = ({
  searchValues,
  managers,
  onChangeSearchValues,
}: FilterProps) => {
  return (
    <FilterBlock>
      <SearchWrapper>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="이름, 이메일 주소, 휴대폰 번호"
            name="keyword"
            value={searchValues.keyword ? searchValues.keyword : ''}
            onChange={onChangeSearchValues}
          />
          <SearchIcon>
            <IoIosSearch />
          </SearchIcon>
        </SearchBar>
        <SearchButton>검색</SearchButton>
      </SearchWrapper>
      <DropdownWrapper>
        <FormControl fullWidth>
          <InputLabel id="type">프로그램 유형</InputLabel>
          <Select
            labelId="type"
            id="type"
            label="프로그램 유형"
            sx={{ backgroundColor: 'white' }}
            name="type"
            value={searchValues.type ? searchValues.type : ''}
            onChange={onChangeSearchValues}
          >
            <MenuItem value="CHALLENGE_FULL">챌린지(전체)</MenuItem>
            <MenuItem value="CHALLENGE_HALF">챌린지(일부)</MenuItem>
            <MenuItem value="BOOTCAMP">부트캠프</MenuItem>
            <MenuItem value="LETS_CHAT">렛츠챗</MenuItem>
          </Select>
        </FormControl>
        <Input
          label="기수"
          placeholder="기수"
          type="number"
          name="th"
          value={searchValues.th ? searchValues.th : ''}
          onChange={onChangeSearchValues}
        />
        <FormControl fullWidth>
          <InputLabel id="manager">담당 매니저</InputLabel>
          <Select
            labelId="manager"
            id="manager"
            label="프로그램 유형"
            sx={{ backgroundColor: 'white' }}
            name="manager"
            value={searchValues.manager ? searchValues.manager : ''}
            onChange={onChangeSearchValues}
          >
            {managers.map((manager: any) => (
              <MenuItem key={manager.id} value={manager.name}>
                {manager.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <Input
          label="담당 매니저"
          placeholder="담당 매니저"
          name="manager"
          value={searchValues.manager ? searchValues.manager : ''}
          onChange={onChangeSearchValues}
        /> */}
      </DropdownWrapper>
      <ActionButtonGroup>
        <ActionButton bgColor="blue" width="8rem">
          필터 검색
        </ActionButton>
        <ActionButton bgColor="lightBlue" width="8rem">
          전체 보기
        </ActionButton>
      </ActionButtonGroup>
    </FilterBlock>
  );
};

export default Filter;

const FilterBlock = styled.div`
  background-color: #bfbfbf;
  padding: 1.5rem 1.5rem;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SearchBar = styled.div`
  width: 300px;
  padding: 0.25rem 0.5rem;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  outline: none;
`;

const SearchIcon = styled.i`
  color: #9a9a9a;
  font-size: 1.25rem;
`;

const SearchButton = styled.button`
  background-color: #aac2ff;
  border-radius: 0.25rem;
  padding: 0.25rem 0.75rem;
`;

const DropdownWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;