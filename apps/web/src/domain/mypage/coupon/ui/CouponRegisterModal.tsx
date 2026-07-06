'use client';

import BaseModal from '@/common/modal/BaseModal';
import { useState } from 'react';

interface CouponRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CouponRegisterModal = ({ isOpen, onClose }: CouponRegisterModalProps) => {
  const [code, setCode] = useState('');

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="mx-4 max-w-[400px]">
      <div className="relative flex flex-col gap-6 px-4 pb-6 pt-9 md:px-6 md:pt-10">
        <img
          src="/icons/menu_close_md.svg"
          alt="close"
          onClick={onClose}
          className="absolute right-6 top-6 h-6 w-6 cursor-pointer md:h-6 md:w-6"
        />
        <p className="text-neutral-0 text-lg font-bold">쿠폰 등록</p>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="쿠폰 코드를 입력해주세요"
            className="border-neutral-80 rounded-xs placeholder:text-neutral-70 focus:border-primary w-full border px-4 py-3 text-sm outline-none"
          />
        </div>
        <button
          className="bg-primary rounded-xs w-full py-3 font-semibold text-white"
          onClick={onClose}
        >
          등록
        </button>
      </div>
    </BaseModal>
  );
};

export default CouponRegisterModal;
