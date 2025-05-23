import { useUserQuery } from '@/api/user';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import { ReactNode } from 'react';
import KakaoChannel from './KakaoChannel';
import LoginLink from './LoginLink';
import SignUpLink from './SignUpLink';

interface Props {
  children?: ReactNode;
  isNextRouter: boolean;
  isOpen: boolean;
  onClose: () => void;
}

function SideNavContainer({ children, isNextRouter, isOpen, onClose }: Props) {
  const { isLoggedIn, logout } = useAuthStore();

  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });

  return (
    <div
      id="sideNavigation"
      className={twMerge(
        'fixed right-0 top-0 z-50 flex h-screen w-[18.25rem] flex-col bg-white shadow-md transition-all duration-300 sm:w-[22rem]',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="flex w-full items-center justify-between p-5">
        <img
          className="h-7 w-auto"
          src="/logo/logo-gradient-text.svg"
          alt="렛츠커리어"
        />
        <i
          className="h-6 w-6 cursor-pointer"
          aria-label="메뉴 닫기"
          aria-controls="sideNavigation"
          aria-expanded={isOpen}
          onClick={onClose}
        >
          <img className="h-auto w-full" src="/icons/x-close.svg" alt="" />
        </i>
      </div>
      <hr />
      <KakaoChannel />
      <div className="flex h-full flex-col gap-5 overflow-y-auto pb-36 pt-10">
        <div className="mx-5 flex justify-between">
          {isLoggedIn ? (
            <span className="flex w-full items-center justify-between gap-4 text-neutral-0 sm:p-0">
              <span>
                환영합니다, <span className="text-primary">{user?.name}</span>님
              </span>
              <button
                type="button"
                className="text-primary"
                onClick={() => {
                  logout();
                  window.location.href = '/';
                  onClose();
                }}
              >
                로그아웃
              </button>
            </span>
          ) : (
            <div className="flex gap-6 text-xsmall14">
              <LoginLink
                className="p-0 font-normal"
                isNextRouter={isNextRouter}
                force={isNextRouter}
              />
              <SignUpLink
                className="bg-transparent p-0 font-normal text-black"
                isNextRouter={isNextRouter}
                force={isNextRouter}
              />
            </div>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-2" onClick={onClose}>
          {children}
        </nav>
      </div>
    </div>
  );
}

export default SideNavContainer;
