import { GoArrowRight } from 'react-icons/go';
import { Link } from 'react-router-dom';

import { useBlogListQuery } from '@/api/blog';
import { getBlogPathname } from '@/utils/url';
import Heading from '../ui/Heading';

const ReviewSection = () => {
  const { data: programReviewsData } = useBlogListQuery({
    pageable: { page: 1, size: 5 },
    type: 'PROGRAM_REVIEWS',
  });
  const { data: jobSuccessStoriesData } = useBlogListQuery({
    pageable: { page: 1, size: 5 },
    type: 'JOB_SUCCESS_STORIES',
  });

  const data = [
    ...(programReviewsData?.blogInfos ?? []),
    ...(jobSuccessStoriesData?.blogInfos ?? []),
  ].sort((a, b) => {
    const displayDateA = a.blogThumbnailInfo.displayDate ?? '';
    const displayDateB = b.blogThumbnailInfo.displayDate ?? '';

    if (displayDateA > displayDateB) return -1;
    if (displayDateA < displayDateB) return 1;
    return 0;
  });

  return (
    <section className="px-5">
      <div className="flex items-center justify-between">
        <Heading>생생한 참여 후기</Heading>
        <Link
          className="flex cursor-pointer items-center gap-1 text-neutral-40"
          to="/blog/list"
        >
          <span>더보기</span>
          <GoArrowRight size={20} />
        </Link>
      </div>
      <div className="custom-scrollbar mt-6 flex items-center gap-4 overflow-x-auto">
        {data.slice(0, 5).map(({ blogThumbnailInfo }) => (
          <Link
            to={getBlogPathname(blogThumbnailInfo)}
            key={blogThumbnailInfo.id}
            className="review_card shrink-0"
          >
            <img
              className="h-[180px] w-auto rounded-xs object-contain sm:h-[250px]"
              src={blogThumbnailInfo.thumbnail ?? ''}
              alt="참여 후기 썸네일"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
