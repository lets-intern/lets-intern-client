'use client';

import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SEMINAR_MAGNET_ID } from '../constants';
import SuggestSeminarModal from '../modal/SuggestSeminarModal';

/**
 * "듣고 싶은 챌린지 제안하기" CTA 카드.
 * 클릭 시 마그넷(SEMINAR_MAGNET_ID, env 세팅) 신청 모달을 연다.
 * 신청에는 로그인이 필요하므로 비로그인 시 로그인 페이지로 보낸 뒤 /seminar 로 복귀시킨다.
 */
const SuggestSeminarCta = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent('/seminar')}`);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="bg-primary-5 mx-auto flex w-full max-w-[720px] flex-col items-center gap-4 rounded-md px-6 py-8 md:py-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xsmall16 md:text-small18 text-primary font-bold">
          듣고 싶은 챌린지 주제가 있으신가요?
        </p>
        <p className="text-xxsmall12 md:text-xsmall14 text-neutral-45">
          보고 싶은 기업·직무 현직자와 세미나 주제를 알려주세요!
        </p>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="bg-primary text-xsmall14 md:text-xsmall16 rounded-xs min-h-[44px] px-5 py-3 font-semibold text-neutral-100"
      >
        듣고 싶은 챌린지 제안하기
      </button>

      {isModalOpen && (
        <SuggestSeminarModal
          magnetId={SEMINAR_MAGNET_ID}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SuggestSeminarCta;
