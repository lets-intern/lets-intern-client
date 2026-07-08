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
      <div className="flex items-center gap-3">
        <div className="bg-neutral-95 flex flex-1 items-center justify-between rounded-md p-3">
          <span className="text-xsmall14 md:text-xsmall16 font-normal">
            {selectedCoupon ? (
              <span className="font-medium">{selectedCoupon.name}</span>
            ) : (
              <>
                적용 가능한 쿠폰이{' '}
                <span className="text-primary">{availableCount}장</span>
                있습니다.
              </>
            )}
          </span>
          {selectedCoupon && (
            <button
              className="text-neutral-45"
              onClick={() => {
                setSelectedCoupon(null);
                setCoupon({ id: null, price: 0 });
              }}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          className="bg-primary text-xsmall16 rounded-sm px-5 py-[9px] text-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setIsModalOpen(true)}
          disabled={availableCount === 0}
        >
          쿠폰 적용
        </button>
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
