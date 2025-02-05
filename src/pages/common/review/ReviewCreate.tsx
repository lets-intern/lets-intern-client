import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ConfirmSection from '@/components/common/review/section/ConfirmSection';
import StarScoreSection from '@/components/common/review/section/StarScoreSection';
import TenScoreSection from '@/components/common/review/section/TenScoreSection';
import TextAreaSection from '@/components/common/review/section/TextAreaSection';
import axios from '@/utils/axios';
import ReportReviewSection from '@components/common/review/section/ReportReviewSection';

const ReviewCreate = ({ isEdit }: { isEdit: boolean }) => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [starScore, setStarScore] = useState<number>(0);
  const [tenScore, setTenScore] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');
  const [hasRecommendationExperience, setHasRecommendationExperience] =
    useState<boolean | null>(null);
  const [npsAns, setNpsAns] = useState('');
  const [howHelpful, setHowHelpful] = useState<string>('');

  const reviewId = params.reviewId;
  const applicationId = searchParams.get('application');
  const programId = params.programId;
  const programType = params.programType?.toLowerCase();

  const { data: reviewDetailData } = useQuery({
    queryKey: ['review', applicationId],
    queryFn: async () => {
      const res = await axios.get(`/review/${reviewId}`);
      return res.data.data;
    },
    enabled: isEdit,
    retry: 1,
  });

  useEffect(() => {
    if (isEdit && reviewDetailData) {
      setStarScore(reviewDetailData.score);
      setTenScore(reviewDetailData.nps);
      setHasRecommendationExperience(reviewDetailData.npsCheckAns);
      setNpsAns(reviewDetailData.npsAns ?? '');
      setContent(reviewDetailData.content);
      setHowHelpful(reviewDetailData.programDetail);
    }
  }, [reviewDetailData, isEdit]);

  const { data: programTitle } = useQuery({
    queryKey: ['program', programId, programType],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/title`);
      return res.data.data.title;
    },
    retry: 1,
  });

  const addReview = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        '/review',
        {
          programId,
          npsAns,
          npsCheckAns:
            hasRecommendationExperience === null
              ? false
              : hasRecommendationExperience,
          nps: tenScore,
          content,
          score: starScore,
          programDetail: programType === 'report' ? howHelpful : '',
        },
        { params: { applicationId } },
      );
      return res.data;
    },
    onSuccess: () => {
      alert('리뷰가 등록되었습니다.');
      navigate(-1);
    },
  });

  const editReview = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/review/${reviewId}`, {
        npsAns,
        npsCheckAns:
          hasRecommendationExperience === null
            ? false
            : hasRecommendationExperience,
        nps: tenScore,
        content,
        score: starScore,
        programDetail: programType === 'report' ? howHelpful : '',
      });
      return res.data;
    },
    onSuccess: () => {
      alert('리뷰가 수정되었습니다.');
      navigate(-1);
    },
  });

  const handleConfirm = () => {
    if (isEdit) {
      if (
        starScore === 0 ||
        tenScore === null ||
        !npsAns ||
        (programType === 'report' && howHelpful === '')
      ) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
      editReview.mutate();
      return;
    } else {
      if (
        starScore === 0 ||
        tenScore === null ||
        !npsAns ||
        (programType === 'report' && howHelpful === '')
      ) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
      addReview.mutate();
      return;
    }
  };

  return (
    <div className="mx-auto bg-neutral-0/50 md:fixed md:inset-0 md:z-50 md:flex md:flex-col md:items-center md:justify-center">
      <main className="relative md:overflow-hidden md:rounded-xl">
        <div className="flex w-full flex-col gap-16 bg-white px-5 md:max-h-[45rem] md:w-[40rem] md:overflow-y-scroll md:rounded-xl md:px-14 md:pb-6 md:pt-12">
          <img
            src="/icons/menu_close_md.svg"
            alt="close"
            className="absolute right-6 top-6 hidden cursor-pointer md:block"
            onClick={() => {
              navigate(-1);
            }}
          />
          <StarScoreSection
            starScore={starScore}
            setStarScore={setStarScore}
            title={programTitle}
          />
          <TenScoreSection
            programTitle={programTitle}
            tenScore={tenScore}
            setTenScore={setTenScore}
            hasRecommendationExperience={hasRecommendationExperience}
            setHasRecommendationExperience={setHasRecommendationExperience}
            npsAns={npsAns}
            setNpsAns={setNpsAns}
          />
          {programType !== 'report' ? (
            <TextAreaSection content={content} setContent={setContent} />
          ) : (
            <ReportReviewSection
              programTitle={programTitle}
              howHelpful={howHelpful}
              setHowHelpful={setHowHelpful}
            />
          )}
          <ConfirmSection
            isEdit={isEdit}
            onConfirm={handleConfirm}
            isDisabled={
              starScore === 0 ||
              tenScore === null ||
              tenScore === 0 ||
              !npsAns ||
              (programType === 'report' && howHelpful === '')
            }
          />
        </div>
      </main>
    </div>
  );
};

export default ReviewCreate;
