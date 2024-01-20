import { useEffect, useState } from 'react';

import StartContent from './StartContent';
import MemberSelect from './MemberSelect';
import InputContent from './InputContent';
import CautionContent from './CautionContent';
import ResultContent from './ResultContent';
import AlertModal from '../../AlertModal';

import './ApplyAside.scss';

interface ApplyAsdieProps {
  program: any;
  participated: boolean;
}

const ApplyAside = ({ program, participated }: ApplyAsdieProps) => {
  const [applyPageIndex, setApplyPageIndex] = useState(0);
  const [formData, setFormData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [announcementDate, setAnnouncementDate] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    title: '',
    message: '',
  });

  const handleModalClose = () => {
    if (applyPageIndex === 3) {
      setApplyPageIndex(0);
    } else {
      setApplyPageIndex(applyPageIndex - 1);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  let content;
  let modalContent;

  if (applyPageIndex === 0) {
    content = (
      <StartContent
        program={program}
        participated={participated}
        isLoggedIn={isLoggedIn}
        setApplyPageIndex={setApplyPageIndex}
      />
    );
    modalContent = null;
  } else if (applyPageIndex === 1) {
    content = (
      <StartContent
        program={program}
        participated={participated}
        isLoggedIn={isLoggedIn}
        setApplyPageIndex={setApplyPageIndex}
      />
    );
    modalContent = <MemberSelect setApplyPageIndex={setApplyPageIndex} />;
  } else if (applyPageIndex === 2) {
    content = (
      <InputContent
        program={program}
        formData={formData}
        isLoggedIn={isLoggedIn}
        setFormData={setFormData}
        setApplyPageIndex={setApplyPageIndex}
        setShowAlert={setShowAlert}
        setAlertInfo={setAlertInfo}
      />
    );
    modalContent = null;
  } else if (applyPageIndex === 3) {
    content = (
      <CautionContent
        program={program}
        formData={formData}
        isLoggedIn={isLoggedIn}
        setApplyPageIndex={setApplyPageIndex}
        setAnnouncementDate={setAnnouncementDate}
      />
    );
    modalContent = null;
  } else if (applyPageIndex === 4) {
    content = (
      <CautionContent
        program={program}
        formData={formData}
        isLoggedIn={isLoggedIn}
        setApplyPageIndex={setApplyPageIndex}
        setAnnouncementDate={setAnnouncementDate}
      />
    );
    modalContent = (
      <ResultContent
        announcementDate={announcementDate}
        setApplyPageIndex={setApplyPageIndex}
      />
    );
  }

  return (
    <>
      {showAlert && (
        <AlertModal
          onConfirm={() => setShowAlert(false)}
          title={alertInfo.title}
          showCancel={false}
          highlight="confirm"
        >
          <p>{alertInfo.message}</p>
        </AlertModal>
      )}
      {modalContent && (
        <div className="apply-black-background" onClick={handleModalClose}>
          <div className="apply-modal">{modalContent}</div>
        </div>
      )}
      <div className="apply-aside">
        <aside className="apply-aside-content">
          <div className="aside-inner-content content">{content}</div>
        </aside>
      </div>
    </>
  );
};

export default ApplyAside;