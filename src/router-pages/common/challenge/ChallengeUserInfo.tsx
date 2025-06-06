import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useGetChallengeGoal,
  useGetChallengeTitle,
  useGetUserChallengeInfo,
  usePostChallengeGoal,
} from '@/api/challenge';
import { useGetChallengeQuery } from '@/api/program';
import { usePatchUser, useUserQuery } from '@/api/user';
import { GOAL_DATE } from '@components/common/challenge/ui/layout/ChallengeLayout';
import TextArea from '@components/common/ui/input/TextArea';
import GradeDropdown from '../../../components/common/mypage/privacy/form-control/GradeDropdown';
import Input from '../../../components/common/ui/input/Input';

const ChallengeUserInfo = () => {
  const params = useParams();
  const programId = params.programId;
  const navigate = useNavigate();

  const [value, setValue] = useState({
    university: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
    goal: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { data: challenge, isLoading: challengeIsLoading } =
    useGetChallengeQuery({
      challengeId: Number(programId),
      enabled: !!programId && !isNaN(Number(programId)),
    });

  const { data: userData, isLoading: userDataIsLoading } = useUserQuery();

  const { data: challengeGoal, isLoading: challengeGoalIsLoading } =
    useGetChallengeGoal(programId);

  const { data: isValidUserInfoData, isLoading: isValidUserInfoLoading } =
    useGetUserChallengeInfo();

  const { data: programTitleData, isLoading: programTitleDataIsLoading } =
    useGetChallengeTitle(Number(programId));

  useEffect(() => {
    if (userData || challengeGoal) {
      setValue({
        university: userData?.university ?? '',
        grade: userData?.grade ?? '',
        major: userData?.major ?? '',
        wishJob: userData?.wishJob ?? '',
        wishCompany: userData?.wishCompany ?? '',
        goal: challengeGoal?.goal ?? '',
      });
    }
  }, [userData, challengeGoal]);

  const programTitle = programTitleData?.title;
  const username = userData?.name;

  const isValidUserInfo = isValidUserInfoData?.pass;
  const hasChallengeGoal = challengeGoal?.goal;
  const isLoading =
    isValidUserInfoLoading ||
    programTitleDataIsLoading ||
    userDataIsLoading ||
    challengeGoalIsLoading ||
    challengeIsLoading;
  const isStartAfterGoal =
    challenge?.startDate && GOAL_DATE.isBefore(challenge.startDate);

  const { mutateAsync: tryPatchUser, isPending: patchUserIsPending } =
    usePatchUser();

  const { mutateAsync: tryPostGoal, isPending: postGoalIsPending } =
    usePostChallengeGoal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue({ ...value, goal: e.target.value });
  };

  const handleGradeChange = (grade: string) => {
    setValue({ ...value, grade });
  };

  const handleSubmit = async () => {
    if (patchUserIsPending || postGoalIsPending || !programId) {
      return;
    }

    try {
      await tryPatchUser({
        university: value.university,
        grade: value.grade,
        major: value.major,
        wishJob: value.wishJob,
        wishCompany: value.wishCompany,
      });

      await tryPostGoal({
        challengeId: programId,
        goal: value.goal,
      });

      navigate(`/challenge/${params.applicationId}/${programId}`);
    } catch (error) {
      console.error(error);
      alert(`입력에 실패했습니다. 다시 시도해주세요.\n${error}`);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !value.university ||
        !value.grade ||
        !value.major ||
        !value.wishJob ||
        !value.wishCompany ||
        !value.goal,
    );
  }, [value]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isStartAfterGoal) {
      if (isValidUserInfo && hasChallengeGoal) {
        navigate(`/challenge/${params.applicationId}/${programId}`);
        return;
      }
    } else if (isValidUserInfo) {
      navigate(`/challenge/${params.applicationId}/${programId}`);
      return;
    }
  }, [
    isValidUserInfo,
    isLoading,
    navigate,
    hasChallengeGoal,
    isStartAfterGoal,
    params.applicationId,
    programId,
  ]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 pb-24 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-semibold">
          챌린지 대시보드 추가정보 입력
        </h1>
        <p className="text-center text-neutral-40">
          안녕하세요, {username}님! {programTitle}에 입장하신 걸 환영합니다!
          <br />
          챌린지 대시보드 입장을 위해 추가정보를 입력해주세요.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">기본 정보</h2>
            <p className="text-neutral-40">
              * 기본 정보를 바탕으로 더 유익한 학습콘텐츠를 제공해드릴게요!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="university" className="text-1-medium">
                학교<span className="text-requirement">*</span>
              </label>
              <Input
                id="university"
                name="university"
                placeholder="렛츠대학교"
                value={value.university}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="grade" className="text-1-medium">
                학년<span className="text-requirement">*</span>
              </label>
              <GradeDropdown
                value={value.grade}
                setValue={handleGradeChange}
                type="MYPAGE"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="major" className="text-1-medium">
                전공<span className="text-requirement">*</span>
              </label>
              <Input
                id="major"
                name="major"
                placeholder="OO학과"
                value={value.major}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishJob" className="text-1-medium">
                희망 직무<span className="text-requirement">*</span>
              </label>
              <Input
                id="wishJob"
                name="wishJob"
                placeholder="희망 직무를 입력해주세요."
                value={value.wishJob}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishCompany" className="text-1-medium">
                희망 기업<span className="text-requirement">*</span>
              </label>
              <Input
                id="wishCompany"
                name="wishCompany"
                placeholder="희망 기업을 입력해주세요."
                value={value.wishCompany}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="wishCompany" className="text-1-medium">
                챌린지 목표<span className="text-requirement">*</span>
              </label>
              <TextArea
                id="goal"
                name="goal"
                wrapperClassName="h-28"
                placeholder={`챌린지를 신청한 목적과 계기,\n또는 챌린지 참여를 통해 이루고 싶은 목표를 자유롭게 작성해주세요.`}
                className="text-xsmall14 font-normal"
                value={value.goal}
                onChange={handleGoalChange}
                maxLength={200}
              />
            </div>
          </div>
        </section>

        <button
          className="rounded-md bg-primary px-4 py-3 font-medium text-white disabled:bg-neutral-60"
          onClick={handleSubmit}
          disabled={buttonDisabled}
        >
          챌린지 대시보드 입장하기
        </button>
      </div>
    </main>
  );
};

export default ChallengeUserInfo;
