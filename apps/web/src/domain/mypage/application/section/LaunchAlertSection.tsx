'use client';

import { useGetMypageMagnetListQuery } from '@/api/magnet/magnet';
import { MypageMagnetListItem } from '@/api/magnet/magnetSchema';
import dayjs from '@/lib/dayjs';
import { useState } from 'react';
import MoreButton from '../../ui/button/MoreButton';
import { MypageApplicationCard } from '../../ui/card/NewApplicationCard';
import { MypageApplicationCardConfig } from '../utils/applicationCardConfig';
import EmptySection from './EmptySection';

const toLaunchAlertCardConfig = (
  magnet: MypageMagnetListItem,
): MypageApplicationCardConfig => {
  const dateText = magnet.applicationCreateDate
    ? dayjs(magnet.applicationCreateDate).format('YY.MM.DD')
    : '';

  return {
    id: magnet.magnetId,
    programId: magnet.magnetId,
    // getDetailHref 에 매칭 분기가 없는 값 → '#' 반환 → 카드 클릭 비활성화.
    programTypeKey: 'LAUNCH_ALERT',
    thumbnail: magnet.desktopThumbnail ?? '',
    title: magnet.title,
    description: (() => {
      try {
        const parsed = JSON.parse(magnet.description ?? '');
        return parsed.metaDescription ?? '';
      } catch {
        return magnet.description ?? '';
      }
    })(),
    isHtmlDescription: true,
    statusLabel: '신청완료',
    categoryLabel: '출시알림',
    dateLabel: '신청일자',
    dateText,
    isCompleted: false,
  };
};

const LaunchAlertSection = () => {
  const { data, isLoading } = useGetMypageMagnetListQuery({
    typeList: ['LAUNCH_ALERT'],
  });
  const [showMore, setShowMore] = useState(false);

  if (isLoading) return <></>;

  const magnetList = data?.magnetList ?? [];
  const hasMagnets = magnetList.length > 0;
  const list = showMore ? magnetList : magnetList.slice(0, 10);

  return (
    <section className="flex flex-col gap-6">
      {hasMagnets ? (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
            {list.map((magnet) => (
              <MypageApplicationCard
                key={magnet.magnetId}
                config={toLaunchAlertCardConfig(magnet)}
              />
            ))}
          </div>
          {magnetList.length > 10 && !showMore && (
            <MoreButton
              className="border-neutral-80 text-primary hover:!bg-primary/5 !bg-transparent px-3 py-2 transition-colors md:flex md:p-3"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </MoreButton>
          )}
        </>
      ) : (
        <EmptySection
          text="아직 신청한 출시알림이 없어요"
          href="/program"
          buttonText="프로그램 둘러보기"
        />
      )}
    </section>
  );
};

export default LaunchAlertSection;
