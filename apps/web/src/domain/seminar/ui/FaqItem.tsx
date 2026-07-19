import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@letscareer/ui';
import type { SeminarFaq } from '../data/faqs';

/**
 * S10 FAQ 항목 — Push1 헤드리스 Accordion(Item/Trigger/Content)에 figma 디자인을 입힌다.
 * 열림 상태는 data-state 로 노출되며, 아이콘 회전으로 표현한다.
 */
const FaqItem = ({ faq }: { faq: SeminarFaq }) => (
  <AccordionItem
    value={faq.id}
    className="border-neutral-85 overflow-hidden rounded-md border"
  >
    <AccordionTrigger className="bg-neutral-95 text-xsmall16 md:text-small18 text-neutral-0 group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold data-[state=open]:bg-neutral-100">
      <span>{faq.question}</span>
      <svg
        className="text-neutral-40 shrink-0 transition-transform group-data-[state=open]:rotate-180"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </AccordionTrigger>
    <AccordionContent className="text-xsmall14 md:text-xsmall16 text-neutral-30 whitespace-pre-line px-5 py-4 leading-relaxed">
      {faq.answer}
    </AccordionContent>
  </AccordionItem>
);

export default FaqItem;
