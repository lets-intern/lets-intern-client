export interface CouponItem {
  id: number;
  name: string;
  couponType: 'PARTNERSHIP' | 'EVENT' | 'GRADE';
  discount: number;
  code: string;
  startDate: string;
  endDate: string;
  isUsed: boolean;
}

export const COUPON_TYPE_LABEL: Record<CouponItem['couponType'], string> = {
  PARTNERSHIP: '제휴',
  EVENT: '이벤트',
  GRADE: '등급별 할인',
};

export const DUMMY_COUPONS: CouponItem[] = [
  {
    id: 1,
    name: '신규 가입 축하 쿠폰',
    couponType: 'EVENT',
    discount: 5000,
    code: 'frILT6lvru',
    startDate: '2026-04-29T00:00:00',
    endDate: '2026-06-29T23:59:59',
    isUsed: false,
  },
  {
    id: 2,
    name: '여름 특별 할인 쿠폰',
    couponType: 'EVENT',
    discount: 5000,
    code: 'frILT6lvru',
    startDate: '2026-04-29T00:00:00',
    endDate: '2026-08-05T23:59:59',
    isUsed: false,
  },
  {
    id: 3,
    name: '제휴사 할인 쿠폰',
    couponType: 'PARTNERSHIP',
    discount: 5000,
    code: 'frILT6lvru',
    startDate: '2026-04-29T00:00:00',
    endDate: '2026-08-29T23:59:59',
    isUsed: false,
  },
  {
    id: 4,
    name: '등급 할인 쿠폰',
    couponType: 'GRADE',
    discount: 5000,
    code: 'frILT6lvru',
    startDate: '2026-04-29T00:00:00',
    endDate: '2026-09-29T23:59:59',
    isUsed: false,
  },
];
