import { CouponItem } from '../constants';

interface CouponCardProps {
  coupon: CouponItem;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
};

const calcDDay = (endDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const CouponCard = ({ coupon }: CouponCardProps) => {
  const dDay = calcDDay(coupon.endDate);
  const showDDayBadge = dDay >= 0 && dDay <= 30;

  return (
    <div className="rounded-xs border-neutral-85 flex flex-col gap-2 border p-4">
      {showDDayBadge && (
        <span className="bg-primary-10 text-primary text-xxsmall12 w-fit rounded-[3px] px-2 py-1 font-medium">
          D-{dDay}
        </span>
      )}
      <div className="flex flex-col gap-0.5">
        <p className="text-small18 text-neutral-0 font-bold">
          {coupon.discount === -1
            ? '전액 할인'
            : `${coupon.discount.toLocaleString()}원`}
        </p>
        <p className="text-xsmall16 text-neutral-0 font-semibold">
          {coupon.name}
        </p>
        <div className="text-xsmall14 text-neutral-30 flex flex-col font-medium">
          <p>쿠폰코드 : {coupon.code}</p>
          <p>
            유효기간 : {formatDate(coupon.startDate)} ~{' '}
            {formatDate(coupon.endDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
