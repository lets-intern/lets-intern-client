'use client';

import CheckBox from '@/common/box/CheckBox';

// 회원가입 동의(AgreementSection)·footer와 동일한 서비스 이용약관 노션 URL.
const TERMS_URL =
  'https://letsintern.notion.site/251208-2c35e77cbee1800bb2b5cfbd4c2f1525?pvs=21';

interface PaymentTermsAgreementProps {
  agreed: boolean;
  onToggle: () => void;
  /** 미동의 상태에서 결제를 시도해 안내를 노출할지 여부 */
  showWarning: boolean;
}

/**
 * 결제 버튼 위 서비스 이용약관 동의 체크박스.
 * 미동의 상태로 결제를 누르면 showWarning=true 로 안내 문구를 띄운다.
 * "서비스 이용약관" 클릭 시 노션 약관 페이지를 새 창으로 연다.
 */
const PaymentTermsAgreement = ({
  agreed,
  onToggle,
  showWarning,
}: PaymentTermsAgreementProps) => (
  <div className="flex flex-col gap-1">
    {/* 토글 버튼(체크박스)과 약관 링크는 형제로 둔다(button 중첩 불가). */}
    <div className="flex items-center gap-2">
      <span className="text-xsmall14 text-neutral-0">
        [필수]{' '}
        <a
          href={TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          서비스 이용약관
        </a>{' '}
        동의
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-checked={agreed}
        role="checkbox"
        aria-label="서비스 이용약관 동의"
      >
        <CheckBox checked={agreed} width="w-6" showCheckIcon />
      </button>
    </div>
    {showWarning && !agreed && (
      <p className="text-requirement text-xxsmall12">
        서비스 이용약관에 동의해 주세요.
      </p>
    )}
  </div>
);

export default PaymentTermsAgreement;
