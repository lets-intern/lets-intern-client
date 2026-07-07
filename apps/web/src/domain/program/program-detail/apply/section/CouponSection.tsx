'use client';

import CloseIcon from '@/assets/icons/close.svg?react';
import { CouponItem, DUMMY_COUPONS } from '@/domain/mypage/coupon/constants';
import { ICouponForm } from '@/types/interface';
import { useState } from 'react';
import CouponSelectModal from '../ui/CouponSelectModal';

export interface CouponSectionProps {
  setCoupon: (
    coupon: ((prevCoupon: ICouponForm) => ICouponForm) | ICouponForm,
  ) => void;
  maxAmount?: number;
  programType: string;
}

const CouponSection = ({
  setCoupon,
  maxAmount = Infinity,
}: CouponSectionProps) => {
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableCount = DUMMY_COUPONS.length;

  const handleApply = (coupon: CouponItem | null) => {
    setSelectedCoupon(coupon);
    if (!coupon) {
      setCoupon({ id: null, price: 0 });
      return;
    }
    const price =
      coupon.discount === -1
        ? maxAmount === Infinity
          ? 0
          : maxAmount
        : Math.min(coupon.discount, maxAmount);
    setCoupon({ id: coupon.id, price });
  };

  return (
    <>
      <div className="flex items-center justify-between px-3">
        <span>쿠폰</span>
        {selectedCoupon ? (
          <div className="flex items-center gap-1">
            <button className="underline" onClick={() => setIsModalOpen(true)}>
              {selectedCoupon.name}
            </button>
            <button
              className="text-neutral-45"
              onClick={() => {
                setSelectedCoupon(null);
                setCoupon({ id: null, price: 0 });
              }}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setIsModalOpen(true)}
            disabled={availableCount === 0}
          >
            <span>적용 가능</span>{' '}
            <span className="text-primary font-semibold">
              {availableCount}장
            </span>
            <img src="/icons/Chevron_Right_MD.svg" alt="" className="h-5 w-5" />
          </button>
        )}
      </div>
      <CouponSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
        currentCouponId={selectedCoupon?.id ?? null}
        maxAmount={maxAmount}
      />
    </>
  );
};

export default CouponSection;
