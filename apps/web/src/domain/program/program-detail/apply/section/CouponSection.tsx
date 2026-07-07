'use client';

import { DUMMY_COUPONS } from '@/domain/mypage/coupon/constants';
import { ICouponForm } from '@/types/interface';
import { useState } from 'react';

export interface CouponSectionProps {
  setCoupon: (
    coupon: ((prevCoupon: ICouponForm) => ICouponForm) | ICouponForm,
  ) => void;
  maxAmount?: number;
  programType: string;
}

const CouponSection = ({
  setCoupon,
  maxAmount: _maxAmount = Infinity,
}: CouponSectionProps) => {
  const [selectedCoupon, setSelectedCoupon] = useState<
    (typeof DUMMY_COUPONS)[number] | null
  >(null);

  const availableCount = DUMMY_COUPONS.length;

  const handleCancel = () => {
    setSelectedCoupon(null);
    setCoupon({ id: null, price: 0 });
  };

  return (
    <div className="flex items-center justify-between px-3">
      <span>쿠폰</span>
      {selectedCoupon ? (
        <div className="flex items-center gap-2">
          <span className="text-xsmall14 text-primary font-medium">
            {selectedCoupon.discount === -1
              ? '전액 할인'
              : `-${selectedCoupon.discount.toLocaleString()}원`}
          </span>
          <button
            className="text-xsmall14 text-neutral-45 underline"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      ) : (
        <button className="flex items-center gap-0.5">
          <span>적용 가능</span>{' '}
          <span className="text-primary font-semibold">{availableCount}장</span>
          <img src="/icons/Chevron_Right_MD.svg" alt="" className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default CouponSection;
