import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useIsMentorQuery } from '@/api/user';
import NavItem from '@/components/common/mypage/ui/nav/NavItem';
import MobileCarousel from '@/components/common/ui/carousel/MobileCarousel';
import useAuthStore from '@/store/useAuthStore';

const MyPage = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: isMentor } = useIsMentorQuery();
  const isReviewCreatePage = location.pathname.startsWith('/mypage/review/new');
  const isReviewPage =
    location.pathname.startsWith('/mypage/review/challenge') ||
    location.pathname.startsWith('/mypage/review/live') ||
    location.pathname.startsWith('/mypage/review/report') ||
    location.pathname.startsWith('/mypage/review/challenge');

  const navItems = useMemo(() => {
    const baseItems = [
      {
        to: '/mypage/application',
        active: location.pathname === '/mypage/application',
        icon: 'edit-list-unordered',
        label: '신청현황',
      },
      {
        to: '/mypage/review',
        active: location.pathname === '/mypage/review',
        icon: 'commu-chat-remove',
        label: '후기작성',
      },
      {
        to: '/mypage/credit',
        active: location.pathname.startsWith('/mypage/credit'),
        icon: 'credit-list',
        label: '결제내역',
      },
      {
        to: '/mypage/privacy',
        active: location.pathname === '/mypage/privacy',
        icon: 'user-user-circle',
        label: '개인정보',
      },
    ];

    if (isMentor) {
      baseItems.push({
        to: '/mypage/feedback',
        active: location.pathname === '/mypage/feedback',
        icon: 'user-challenge-feedback',
        label: '챌린지 피드백',
      });
    }

    return baseItems;
  }, [location.pathname, isMentor]);

  useEffect(() => {
    // login 페이지로 넘어간 이후 이 useEffect가 한번 더 실행되는 케이스가 있어서 방어로직 추가
    if (!isLoggedIn && window.location.pathname.startsWith('/mypage')) {
      const newUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', `${newUrl.pathname}?${newUrl.search}`);
      navigate(`/login?${searchParams.toString()}`);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex w-full flex-col items-center justify-start lg:px-[7.5rem]">
      <div className="flex w-full flex-col items-start justify-center gap-x-20 md:flex-row md:p-10 lg:px-5 lg:py-[3.75rem]">
        <nav
          className={clsx(
            'flex w-full items-center justify-center md:w-auto',
            // 후기 작성 화면에서는 네비 바 숨김
            { hidden: isReviewCreatePage || isReviewPage },
          )}
        >
          <div className="flex w-full items-center justify-center pb-8 md:w-[12.5rem] md:p-0 md:py-8">
            <MobileCarousel
              items={navItems}
              renderItem={(item) => (
                <NavItem to={item.to} active={item.active}>
                  <img
                    src={`/icons/${item.icon}${item.active ? '-black' : ''}.svg`}
                    alt={item.label}
                    className="hidden h-[1.625rem] w-[1.625rem] md:block"
                  />
                  {item.label}
                </NavItem>
              )}
              itemWidth="auto"
              spaceBetween={8}
              containerWidth="100%"
              getItemKey={(item) => item.to}
              className="md:w-full md:flex-col md:p-2"
            />
          </div>
        </nav>
        <div className="flex w-full grow flex-col items-start justify-center pb-8 md:w-auto">
          <div className="flex w-full flex-col items-start justify-center gap-y-8 lg:mx-auto lg:max-w-[37.5rem]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
