import { useQuery } from '@tanstack/react-query';

import axios from '@/utils/axios';

import type { CouponItem } from '../constants';

export function useMyCoupons() {
  return useQuery({
    queryKey: ['coupon', 'my'],
    queryFn: async (): Promise<CouponItem[]> => {
      const res = await axios.get('/coupon/my', {
        params: { programType: 'ALL' },
      });
      return res.data.data.couponList;
    },
  });
}
