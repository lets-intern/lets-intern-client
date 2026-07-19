import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './index';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  {
    value: 'q1',
    question: '수강 신청은 어떻게 하나요?',
    answer: '세미나 목록에서 원하는 세미나를 선택해 신청합니다.',
  },
  {
    value: 'q2',
    question: '수강료가 있나요?',
    answer: '무료 세미나는 별도 비용 없이 참여할 수 있습니다.',
  },
  {
    value: 'q3',
    question: '다시보기(VOD)를 제공하나요?',
    answer: '일부 세미나는 참여자에게 VOD를 제공합니다.',
  },
];

// 디자인 없는 헤드리스 프리미티브라 스토리에서 최소 스타일만 className 으로 주입한다.
const itemClass = 'border-neutral-80 border-b';
const triggerClass =
  'text-xsmall16 text-neutral-0 flex w-full items-center justify-between py-4 text-left font-semibold';
const contentClass = 'text-xsmall14 text-neutral-40 pb-4';

function Marker({ value }: { value: string }) {
  return <span aria-hidden>{value}</span>;
}

// 하나만 열리는 single 모드(비제어).
export const Single: Story = {
  args: { type: 'single' },
  render: (args) => (
    <Accordion {...args} className="max-w-md">
      {ITEMS.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={itemClass}
        >
          <AccordionTrigger className={triggerClass}>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className={contentClass}>
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

// 여러 개를 동시에 열 수 있는 multiple 모드.
export const Multiple: Story = {
  args: { type: 'multiple' },
  render: (args) => (
    <Accordion {...args} className="max-w-md">
      {ITEMS.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={itemClass}
        >
          <AccordionTrigger className={triggerClass}>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className={contentClass}>
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

// 초기 열림 항목 지정(single: defaultValue='q2').
export const InitiallyOpen: Story = {
  args: { type: 'single', defaultValue: 'q2' },
  render: (args) => (
    <Accordion {...args} className="max-w-md">
      {ITEMS.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={itemClass}
        >
          <AccordionTrigger className={triggerClass}>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className={contentClass}>
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

// 키보드 검증: Tab 으로 트리거 이동 후 Enter/Space 로 토글(네이티브 button).
export const KeyboardAccessible: Story = {
  args: { type: 'multiple', defaultValue: ['q1'] },
  render: (args) => (
    <div className="max-w-md">
      <p className="text-xsmall14 text-neutral-40 mb-3">
        Tab 으로 각 항목 제목에 포커스한 뒤 Enter 또는 Space 로 펼치고 접을 수
        있습니다.
      </p>
      <Accordion {...args}>
        {ITEMS.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className={itemClass}
          >
            <AccordionTrigger className={triggerClass}>
              <span>{item.question}</span>
              <Marker value={item.value} />
            </AccordionTrigger>
            <AccordionContent className={contentClass}>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};
