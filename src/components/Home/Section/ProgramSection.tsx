import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../utils/axios';
import { typeToText } from '../../../utils/converTypeToText';
import formatDateString from '../../../utils/formatDateString';
import CardListSlider from '../../CardListSlider';
import CardListPlaceholder from '../../CardListPlaceholder';
import ProgramCard from '../../ProgramCard';

import './ProgramSection.scss';

const ProgramSection = () => {
  const [programList, setProgramList] = useState<any>();
  const [loading, setLoading] = useState(true);

  const { isError } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const res = await axios.get('/program');
      const { programList } = res.data;
      const newProgramList = programList.filter(
        (program: any) => program.status === 'OPEN',
      );
      setProgramList(newProgramList);
      setLoading(false);
      return res.data;
    },
  });

  return (
    <section className="program-section">
      <div className="section-content">
        <h2 className="section-title small-text">모집 중인 프로그램</h2>
        <p className="section-description">
          아래에서 모집 중인 프로그램을 확인해 보세요!
        </p>
        <div className="bottom-content">
          {isError ? (
            <CardListSlider className="program-list" isEmpty={true}>
              <CardListPlaceholder>에러 발생</CardListPlaceholder>
            </CardListSlider>
          ) : loading ? (
            <CardListSlider className="program-list">
              <CardListPlaceholder />
            </CardListSlider>
          ) : programList.length === 0 ? (
            <CardListSlider className="program-list" isEmpty={true}>
              <CardListPlaceholder>
                현재 진행 중인 프로그램이 없습니다.
              </CardListPlaceholder>
            </CardListSlider>
          ) : (
            <CardListSlider className="program-list">
              {programList.map((program: any) => (
                <ProgramCard
                  key={program.id}
                  to={`/program/detail/${program.id}`}
                >
                  <div className="card-top">
                    <h2>{typeToText[program.type]}</h2>
                    <h3>{program.title}</h3>
                  </div>
                  <div className="card-bottom">
                    <div className="card-bottom-item">
                      <strong>모집 마감</strong>
                      <span>{formatDateString(program.dueDate)}</span>
                    </div>
                    <div className="card-bottom-item">
                      <strong>시작 일자</strong>
                      <span>{formatDateString(program.startDate)}</span>
                    </div>
                  </div>
                </ProgramCard>
              ))}
            </CardListSlider>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;