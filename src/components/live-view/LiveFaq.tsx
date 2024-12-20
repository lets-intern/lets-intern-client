import { useParams } from 'react-router-dom';

import { useGetLiveFaq } from '@/api/program';
import { FaqCard } from '@components/challenge-view/ChallengeFaq';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { LIVE_FAQ_ID } from '@components/ProgramDetailNavigation';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

function LiveFaq() {
  const { id } = useParams();

  const { data } = useGetLiveFaq(id ?? '');

  const faqList = data?.faqList;

  if (!faqList) return <></>;

  return (
    <section
      id={LIVE_FAQ_ID}
      className="live-faq flex w-full max-w-[1000px] flex-col px-5 py-20 md:items-center md:px-10 md:py-40 lg:px-0"
    >
      <SuperTitle className="mb-6 text-primary md:mb-12">FAQ</SuperTitle>
      <SuperTitle className="text-primary">{superTitle}</SuperTitle>
      <Heading2 className="mb-10 md:mb-20">{title}</Heading2>

      <div className="flex flex-col gap-3 md:w-full md:max-w-[800px]">
        {faqList.map((faq) => (
          <FaqCard key={faq.id} faq={faq} />
        ))}
      </div>
    </section>
  );
}

export default LiveFaq;
