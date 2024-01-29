import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import cn from 'classnames';

import axios from '../../utils/axios';
import ClosedCard from './ClosedCard';

import './Programs.scss';
import CardListSlider from '../CardListSlider';
import CardListPlaceholder from '../CardListPlaceholder';
import ProgramCard from '../ProgramCard';
import { typeToText } from '../../utils/converTypeToText';
import formatDateString from '../../utils/formatDateString';

const Programs = () => {
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState<any>(null);
  const [closedPrograms, setClosedPrograms] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const category = searchParams.get('category') || 'ALL';

  useEffect(() => {
    const params = !category || category === 'ALL' ? {} : { type: category };
    setLoading(true);
    axios
      .get('/program', {
        params,
        headers: {
          Authorization: '',
        },
      })
      .then((res) => {
        return res.data.programList;
      })
      .then((programs) => {
        setPrograms(
          programs.filter((program: any) => program.status === 'OPEN'),
        );
        setClosedPrograms(
          programs.filter((program: any) => program.status !== 'OPEN'),
        );
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <>
      <div className="program-list-page">
        <main>
          <section className="filter-section">
            <ul className="category-button-group">
              <li
                className={cn('category-button', {
                  active: category === 'ALL',
                })}
              >
                <Link to="/program">전체 프로그램</Link>
              </li>
              <li
                className={cn('category-button', {
                  active: category === 'CHALLENGE',
                })}
              >
                <Link to="/program?category=CHALLENGE">챌린지</Link>
              </li>
              <li
                className={cn('category-button', {
                  active: category === 'BOOTCAMP',
                })}
              >
                <Link to="/program?category=BOOTCAMP">부트캠프</Link>
              </li>
              <li
                className={cn('category-button', {
                  active: category === 'LETS_CHAT',
                })}
              >
                <Link to="/program?category=LETS_CHAT">렛츠챗</Link>
              </li>
            </ul>
          </section>
          <section className="opened-programs">
            <div className="content">
              <h2>현재 모집중이에요</h2>
              <p>아래에서 모집중인 프로그램을 확인해보세요!</p>
              {loading ? (
                <CardListSlider>
                  <CardListPlaceholder />
                </CardListSlider>
              ) : !programs || programs.length === 0 ? (
                <CardListSlider isEmpty={true}>
                  <CardListPlaceholder>
                    현재 진행 중인 프로그램이 없습니다.
                  </CardListPlaceholder>
                </CardListSlider>
              ) : (
                <CardListSlider className="program-list">
                  {programs
                    .filter((program: any) => program.status === 'OPEN')
                    .map((program: any) => (
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
          </section>
          <section className="closed-programs">
            <div className="content">
              <h2>아쉽지만 마감되었어요</h2>
              <p>더 많은 프로그램들이 준비되어 있으니 걱정마세요!</p>
              {loading || closedPrograms.length === 0 ? (
                <div className="closed-card-list">
                  <div className="placeholder" />
                </div>
              ) : (
                <div className="closed-card-list">
                  <div className="card-list">
                    {closedPrograms.map((program: any) => (
                      <ClosedCard key={program.id} program={program} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Programs;