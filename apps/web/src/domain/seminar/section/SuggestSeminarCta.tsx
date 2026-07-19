'use client';

import { useGetLaunchAlertQuery } from '@/api/magnet/magnet';
import useAuthStore from '@/store/useAuthStore';
import { useToast } from '@letscareer/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SEMINAR_MAGNET_ID } from '../constants';
import SuggestSeminarModal from '../modal/SuggestSeminarModal';

/**
 * "듣고 싶은 챌린지 제안하기" CTA 카드.
 * 클릭 시 마그넷(SEMINAR_MAGNET_ID, env 세팅) 신청 모달을 연다.
 * - 비로그인: 로그인 페이지로 보낸 뒤 /seminar 로 복귀.
 * - 이미 제안(신청)한 경우: 모달 대신 "이미 제안했다" 토스트로 안내.
 *   (마그넷 99 = 출시알림 마그넷이므로 appliedLaunchAlert 로 제출 여부 판단.)
 */
const SuggestSeminarCta = () => {
  const router = useRouter();
  const toast = useToast();
  const { isLoggedIn } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: launchAlert } = useGetLaunchAlertQuery({
    enabled: isLoggedIn,
  });
  const alreadyApplied = launchAlert?.appliedLaunchAlert === true;

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent('/seminar')}`);
      return;
    }
    if (alreadyApplied) {
      toast.success('이미 제안해 주셨어요. 소중한 의견 감사합니다!');
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
