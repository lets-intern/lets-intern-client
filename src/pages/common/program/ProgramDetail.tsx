import { useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplyModal from '../../../components/common/program/program-detail/apply/modal/ApplyModal';
import FilledButton from '../../../components/common/program/program-detail/button/FilledButton';
import NotiButton from '../../../components/common/program/program-detail/button/NotiButton';
import Header from '../../../components/common/program/program-detail/header/Header';
import ApplySection from '../../../components/common/program/program-detail/section/ApplySection';
import MobileApplySection from '../../../components/common/program/program-detail/section/MobileApplySection';
import TabSection from '../../../components/common/program/program-detail/section/TabSection';
import applyReducer from '../../../reducers/applyReducer';
import drawerReducer from '../../../reducers/drawerReducer';
import useAuthStore from '../../../store/useAuthStore';
import axios from '../../../utils/axios';

export type ProgramType = 'challenge' | 'live';

interface ProgramDetailProps {
  programType: ProgramType;
}

const ProgramDetail = ({ programType }: ProgramDetailProps) => {
  const params = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [programTitle, setProgramTitle] = useState('');
  const programId = Number(params.programId);
  const matches = useMediaQuery('(min-width: 991px)');
  const [isOpen, drawerDispatch] = useReducer(drawerReducer, false);
  const [isComplete, applyDispatch] = useReducer(applyReducer, false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [programInfo, setProgramInfo] = useState({
    beginning: '',
    deadline: '',
  });
  const [disabledButton, setDisabledButton] = useState(false);

  useQuery({
    queryKey: [programType, programId, 'application'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/${programType}/${programId}/application`);
        const data = res.data.data;
        setIsAlreadyApplied(data.applied);
        setDisabledButton(!data.applied);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });

  // 프로그램 제목 가져오기
  useQuery({
    queryKey: [programType, programId, 'title'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/title`);
      setProgramTitle(res.data.data.title);
      return res.data;
    },
  });
  // 프로그램 일정 가져오기
  useQuery({
    queryKey: [programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}`);
      const { beginning, deadline } = res.data.data;
      setProgramInfo({ beginning, deadline });
      setDisabledButton(
        new Date() < new Date(beginning) || new Date() > new Date(deadline),
      );
      return res.data;
    },
  });

  const toggleApplyModal = () => {
    applyDispatch({ type: 'toggle' });
  };
  const toggleDrawer = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    drawerDispatch({ type: 'toggle' });
  };
  const handleDrawer = () => {
    if (!isAlreadyApplied && !disabledButton) toggleDrawer();
  };
  const clickNotiButton = () => {
    window.open('https://forms.gle/u6ePSE2WoRYjxyGS6', '_blank');
  };

  return (
    <div className="px-5">
      <div className="mx-auto max-w-5xl">
        <Header programTitle={programTitle} />
        <div className="flex min-h-screen flex-col">
          {/* 프로그램 상세 */}
          <section className="flex items-start gap-10 md:mt-8">
            <TabSection programId={programId} programType={programType} />
            {matches && (
              <ApplySection
                programType={programType}
                programId={programId}
                programTitle={programTitle}
                toggleApplyModal={toggleApplyModal}
              />
            )}
          </section>

          {/* 모바일 신청 세션 */}
          {!matches && (
            <div className="fixed bottom-0 left-0 right-0 z-30 flex max-h-[25rem] w-screen flex-col items-center overflow-y-auto rounded-t-lg bg-static-100 px-5 py-3 shadow-05 scrollbar-hide">
              <div
                onClick={handleDrawer}
                className={clsx(
                  'mb-3 h-[5px] w-[70px] cursor-pointer rounded-full bg-neutral-80',
                )}
              />
              {isOpen ? (
                <MobileApplySection
                  programTitle={programTitle}
                  programType={programType}
                  programId={programId}
                  toggleApplyModal={toggleApplyModal}
                  toggleDrawer={toggleDrawer}
                  drawerDispatch={drawerDispatch}
                  setApplied={setIsAlreadyApplied}
                />
              ) : // 모집 예정 or 모집 종료이면 출시알림신청 버튼 표시
              programInfo.beginning === '' || programInfo.deadline === '' ? (
                <FilledButton
                  onClick={() => {}}
                  caption={'로딩 중 ...'}
                  isAlreadyApplied={false}
                  className="opacity-0"
                />
              ) : new Date() < new Date(programInfo.beginning) ||
                new Date() > new Date(programInfo.deadline) ? (
                <NotiButton
                  onClick={clickNotiButton}
                  caption={'출시알림신청'}
                  className="early_button"
                />
              ) : (
                <FilledButton
                  onClick={toggleDrawer}
                  caption={isAlreadyApplied ? '신청완료' : '신청하기'}
                  isAlreadyApplied={isAlreadyApplied}
                  className="apply_button"
                />
              )}
            </div>
          )}
        </div>
      </div>
      {isComplete && <ApplyModal toggle={toggleApplyModal} />}
    </div>
  );
};

export default ProgramDetail;
