import { useState } from 'react';

import InputContent from '../apply/content/InputContent';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';
import { ProgramType } from '../../../../../pages/common/program/ProgramDetail';
import PayContent from '../apply/content/PayContent';
import CautionContent from '../apply/content/CautionContent';
import { PayInfo } from './ApplySection';
import { IAction } from '../../../../../interfaces/interface';
import ScheduleContent from '../apply/content/ScheduleContent';

interface ProgramDate {
  deadline: string;
  startDate: string;
  endDate: string;
  beginning: string;
}

interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  contactEmail: string;
  motivate: string;
  question: string;
}

interface MobileApplySectionProps {
  programType: ProgramType;
  programId: number;
  programTitle: string;
  toggleApplyModal: () => void;
  toggleDrawer: () => void;
  drawerDispatch: (value: IAction) => void;
  setApplied: (isApplied: boolean) => void;
}

const MobileApplySection = ({
  programType,
  programId,
  programTitle,
  toggleApplyModal,
  toggleDrawer,
  drawerDispatch,
  setApplied,
}: MobileApplySectionProps) => {
  const [contentIndex, setContentIndex] = useState(0);
  const [programDate, setProgramDate] = useState<ProgramDate>({
    deadline: '',
    startDate: '',
    endDate: '',
    beginning: '',
  });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    motivate: '',
    question: '',
  });
  const [criticalNotice, setCriticalNotice] = useState<string>('');
  const [priceId, setPriceId] = useState<number>(0);
  const [payInfo, setPayInfo] = useState<PayInfo>({
    priceId: 0,
    price: 0,
    discount: 0,
    accountNumber: '',
    deadline: '',
    accountType: '',
    livePriceType: '',
    challengePriceType: '',
    couponId: null,
    couponPrice: 0,
  });
  const [isCautionChecked, setIsCautionChecked] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  useQuery({
    queryKey: [programType, programId, 'application'],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/application`);
      const data = res.data.data;
      setUserInfo({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        contactEmail: data.contactEmail,
        motivate: '',
        question: '',
      });
      setCriticalNotice(data.criticalNotice);
      setIsApplied(data.applied);
      if (programType === 'challenge') {
        setPriceId(data.priceList[0].priceId);
        setPayInfo({
          priceId: data.priceList[0].priceId,
          couponId: null,
          price: data.priceList[0].price,
          discount: data.priceList[0].discount,
          couponPrice: 0,
          accountNumber: data.priceList[0].accountNumber,
          deadline: data.priceList[0].deadline,
          accountType: data.priceList[0].accountType,
          livePriceType: data.priceList[0].livePriceType,
          challengePriceType: data.priceList[0].challengePriceType,
        });
      } else {
        setPriceId(data.price.priceId);
        setPayInfo({
          priceId: data.price.priceId,
          couponId: null,
          price: data.price.price,
          discount: data.price.discount,
          couponPrice: 0,
          accountNumber: data.price.accountNumber,
          deadline: data.price.deadline,
          accountType: data.price.accountType,
          livePriceType: data.price.livePriceType,
          challengePriceType: data.price.challengePriceType,
        });
      }
      return res.data;
    },
  });

  useQuery({
    queryKey: [programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}`);
      const data = res.data.data;
      setProgramDate({
        deadline: data.deadline,
        startDate: data.startDate,
        endDate: data.endDate,
        beginning: data.beginning,
      });
      return res.data;
    },
  });

  const applyProgram = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/application/${programId}`,
        {
          paymentInfo: {
            priceId: priceId,
            couponId: 0,
          },
          motivate: userInfo.motivate,
          question: userInfo.question,
        },
        {
          params: {
            type: programType.toUpperCase(),
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      setApplied(true);
    },
  });

  const handleApplyButtonClick = () => {
    applyProgram.mutate();
    toggleDrawer();
    toggleApplyModal();
  };

  return (
    <section className="w-full">
      {contentIndex === 0 && (
        <ScheduleContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programDate={programDate}
          programType={programType}
          programTitle={programTitle}
          isApplied={isApplied}
        />
      )}
      {contentIndex === 1 && (
        <InputContent
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          programType={programType}
          drawerDispatch={drawerDispatch}
        />
      )}
      {contentIndex === 2 && (
        <CautionContent
          contentIndex={contentIndex}
          criticalNotice={criticalNotice}
          setContentIndex={setContentIndex}
          isCautionChecked={isCautionChecked}
          setIsCautionChecked={setIsCautionChecked}
        />
      )}
      {contentIndex === 3 && (
        <PayContent
          payInfo={payInfo}
          setPayInfo={setPayInfo}
          handleApplyButtonClick={handleApplyButtonClick}
          contentIndex={contentIndex}
          setContentIndex={setContentIndex}
          programType={programType}
        />
      )}
    </section>
  );
};

export default MobileApplySection;
