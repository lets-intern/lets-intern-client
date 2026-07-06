'use client';

import PlusIcon from '@/assets/icons/plus.svg?react';
import { CategoryTabs } from '@letscareer/ui';
import { useState } from 'react';
import { DUMMY_COUPONS } from './constants';
import CouponCard from './ui/CouponCard';
import CouponRegisterModal from './ui/CouponRegisterModal';

type CouponTab = 'AVAILABLE';

const COUPON_TAB_OPTIONS: { value: CouponTab; label: string }[] = [
  { value: 'AVAILABLE', label: '보유 쿠폰' },
];

const CouponSection = () => {
  const [tab, setTab] = useState<CouponTab>('AVAILABLE');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex w-full flex-col gap-6 md:gap-10">
      <div className="-mx-5 -mt-[18px] flex items-center justify-between gap-2 md:mx-0 md:mt-0 md:gap-3">
        <CategoryTabs
          options={COUPON_TAB_OPTIONS}
          selected={tab}
          onChange={setTab}
        />
        <button
          className="text-xsmall14 border-neutral-80 rounded-xxs mr-5 flex flex-shrink-0 items-center gap-1 rounded border px-3 py-1.5 font-medium text-neutral-50 md:mr-0"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          쿠폰 등록
        </button>
      </div>
      <CouponRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="flex flex-col gap-3 md:gap-5">
        {DUMMY_COUPONS.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </main>
  );
};

export default CouponSection;
