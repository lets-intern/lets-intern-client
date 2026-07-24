import { useQuery } from '@tanstack/react-query';

import axios from '@/utils/axios';

import type { CouponItem } from '../constants';

export function useMyCoupons(programType: string = 'ALL') {
  const type = programType.toUpperCase();
  return useQuery({
    queryKey: ['coupon', 'my', type],
    queryFn: async (): Promise<CouponItem[]> => {
      const res = await axios.get('/coupon/my', {
        params: { programType: type },
      });
      return res.data.data.couponList;
    },
  });
}
