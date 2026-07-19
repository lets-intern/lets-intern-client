'use client';

import { useGetLaunchAlertQuery } from '@/api/magnet/magnet';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

/**
 * "듣고 싶은 챌린지 제안하기" CTA 카드 — magnet 출시알림(LAUNCH_ALERT) 리드 수집으로 연결한다.
 *
 * NOTE(O1): 제안 대상 magnet 을 런타임에 해석한다. `GET /magnet/launch-alert`(타입 필터 없음)는
 * 활성 LAUNCH_ALERT 마그넷 중 가장 최근(id desc, fetchFirst) 것을 반환한다. 그 magnetId 로
 * `/library/{magnetId}/apply?type=launch-alert` 신청 페이지(선례 흐름)로 이동한다(링크형 — 최소 위험).
 * - 활성 마그넷이 없으면 BE 가 결과 없음 → 조회 에러이므로 버튼을 비활성화하고 안내만 노출한다.
 * - 이미 신청했으면(appliedLaunchAlert) "제안 완료" 상태로 낮게 표시한다.
 * 어드민이 향후 프로그램 타입별로 마그넷을 분리하면 여기 programTypeList 를 넘겨 좁히면 된다.
 */
const SuggestSeminarCta = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { data, isLoading, isError } = useGetLaunchAlertQuery({
    enabled: true,
  });

  const magnetId = data?.magnetId;
  const alreadyApplied = data?.appliedLaunchAlert ?? false;
  const unavailable = isError || (!isLoading && !magnetId);
  const disabled = isLoading || unavailable || alreadyApplied;

  const handleClick = () => {
    if (disabled || !magnetId) return;
    const path = `/library/${magnetId}/apply?type=launch-alert`;
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  const helperText = alreadyApplied
    ? '이미 제안해 주셨어요. 소중한 의견 감사합니다!'
    : unavailable
      ? '지금은 제안을 받고 있지 않아요. 곧 다시 열릴게요!'
      : null;

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
        disabled={disabled}
        className={`text-xsmall14 md:text-xsmall16 rounded-xs min-h-[44px] px-5 py-3 font-semibold text-neutral-100 ${disabled ? 'bg-neutral-70 cursor-not-allowed' : 'bg-primary'}`}
      >
        {alreadyApplied ? '제안 완료' : '듣고 싶은 챌린지 제안하기'}
      </button>

      {helperText && (
        <p className="text-xxsmall12 md:text-xsmall14 text-neutral-45 text-center">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default SuggestSeminarCta;
