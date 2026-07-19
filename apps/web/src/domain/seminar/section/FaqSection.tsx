'use client';

import { Accordion } from '@letscareer/ui';
import channelService from '@/ChannelService';
import { SEMINAR_FAQ_HEAD, SEMINAR_FAQS } from '../data/faqs';
import FaqItem from '../ui/FaqItem';

/**
 * S10 FAQ 섹션 — Push1 헤드리스 Accordion(single)을 소비한다.
 * 한 번에 하나의 항목만 열리며, 해소되지 않은 문의는 채널톡으로 연결한다.
 */
const FaqSection = () => {
  return (
    <section className="w-full px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xsmall14 md:text-xsmall16 text-primary font-semibold">
            {SEMINAR_FAQ_HEAD.eyebrow}
          </p>
          <h2 className="text-small20 md:text-large26 text-neutral-0 font-bold">
            {SEMINAR_FAQ_HEAD.title}
          </h2>
        </div>

        <Accordion type="single" className="flex flex-col gap-3">
          {SEMINAR_FAQS.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </Accordion>

        <div className="bg-neutral-95 flex flex-col items-center gap-3 rounded-md px-6 py-5 md:flex-row md:justify-between">
          <span className="text-xsmall14 md:text-small18 text-neutral-35 font-semibold">
            아직 궁금증이 풀리지 않았다면?
          </span>
          <button
            type="button"
            onClick={() => channelService.showMessenger()}
            className="border-neutral-70 text-xsmall14 md:text-xsmall16 text-neutral-0 rounded-sm border bg-neutral-100 px-5 py-3 font-medium"
          >
            1:1 채팅 문의하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
