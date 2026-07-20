import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionAnchorNav } from './index';

const meta = {
  title: 'UI/SectionAnchorNav',
  component: SectionAnchorNav,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionAnchorNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  { id: 'intro', label: '소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'mentor', label: '멘토' },
  { id: 'faq', label: 'FAQ' },
];

const SECTION_COLORS = ['bg-primary-xlight', 'bg-secondary-10', 'bg-point-100'];

// 클릭 → 스크롤 → active 하이라이트 데모.
// 색상은 하드코딩하지 않고 *ClassName prop(토큰)으로 주입한다.
// 소비 측 섹션은 `scroll-mt-16` 으로 sticky nav 높이만큼 offset 을 보정한다.
export const Default: Story = {
  args: {
    items: ITEMS,
    className: 'border-neutral-85 gap-6 border-b bg-white px-5',
    itemClassName: 'text-xsmall16 py-3',
    activeItemClassName: 'text-neutral-0 font-semibold',
    inactiveItemClassName: 'text-neutral-45 hover:text-neutral-10 font-medium',
    indicatorClassName: 'bg-primary',
  },
  render: (args) => (
    <div>
      <div className="sticky top-0 z-10">
        <SectionAnchorNav {...args} />
      </div>
      {ITEMS.map((item, i) => (
        <section
          key={item.id}
          id={item.id}
          className={`flex h-[70vh] scroll-mt-16 items-center justify-center ${SECTION_COLORS[i % SECTION_COLORS.length]}`}
        >
          <h2 className="text-xlarge28 text-neutral-0 font-bold">
            {item.label}
          </h2>
        </section>
      ))}
    </div>
  ),
};
