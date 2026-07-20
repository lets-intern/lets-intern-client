export interface CouponItem {
  couponId: number;
  couponType: 'PARTNERSHIP' | 'EVENT' | 'GRADE';
  couponProgramTypeList: string[];
  name: string;
  code: string;
  discount: number;
  time: number;
  remainTime: number;
  startDate: string;
  endDate: string;
}

export const COUPON_TYPE_LABEL: Record<CouponItem['couponType'], string> = {
  PARTNERSHIP: '제휴',
  EVENT: '이벤트',
  GRADE: '등급별 할인',
};
