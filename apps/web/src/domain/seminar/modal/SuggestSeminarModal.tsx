'use client';

import {
  useGetUserMagnetQuestionsQuery,
  usePostMagnetApplicationMutation,
} from '@/api/magnet/magnet';
import { UserMagnetQuestionItem } from '@/api/magnet/magnetSchema';
import { PatchUserBody, usePatchUser, useUserQuery } from '@/api/user/user';
import LineInput from '@/common/input/LineInput';
import ModalOverlay from '@/common/ModalOverlay';
import ModalPortal from '@/common/ModalPortal';
import MagnetSurveySection, {
  MagnetQuestion,
  MagnetSurveyAnswer,
} from '@/domain/library/apply/MagnetSurveySection';
import { extractHttpStatus } from '@/utils/sentry';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

/** 마그넷 질문 응답 → MagnetSurveySection용 형태 (library apply 페이지와 동일 매핑). */
function toMagnetQuestion(item: UserMagnetQuestionItem): MagnetQuestion {
  const options = item.options
    ? item.options.split(',').map((v) => v.trim())
    : [];
  return {
    questionId: item.magnetQuestionId,
    questionType: item.answerType === 'TEXT' ? 'SUBJECTIVE' : 'OBJECTIVE',
    isRequired: item.isRequired ? 'REQUIRED' : 'OPTIONAL',
    question: item.question,
    description: item.description,
    selectionMethod: item.choiceType ?? 'SINGLE',
    items: options.map((value, index) => ({ itemId: index + 1, value })),
  };
}

interface SuggestSeminarModalProps {
  magnetId: number;
  onClose: () => void;
}

/**
 * "듣고 싶은 챌린지 제안하기" 모달 — 마그넷(SEMINAR_MAGNET_ID) 신청 폼.
 *
 * - 연락처: 유저 프로필(읽기 전용).
 * - 이메일: 유저 프로필 기본값(수정 가능) → 변경 시 프로필에 반영.
 * - 희망 직군·듣고 싶은 세미나 주제 등 나머지 질문: **어드민 신청폼에 세팅한 마그넷 질문을 그대로 렌더**한다.
 *   질문명·객관식 선택지·주관식 입력 모두 어드민 세팅과 완전히 동기화되며, 답변은 magnetAnswerList로 전송된다.
 * 로그인 사용자 전제(CTA에서 가드).
 */
const SuggestSeminarModal = ({
  magnetId,
  onClose,
}: SuggestSeminarModalProps) => {
  const { data: user } = useUserQuery();
  const { data: questionsData, isLoading } =
    useGetUserMagnetQuestionsQuery(magnetId);
  const { mutateAsync: postApplication, isPending: submitting } =
    usePostMagnetApplicationMutation();
  const { mutateAsync: patchUser } = usePatchUser();

  const questions = (questionsData?.magnetQuestionList ?? []).map(
    toMagnetQuestion,
  );

  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<MagnetSurveyAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  // 모달 열림 동안 배경 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleAnswerChange = (
    questionId: number,
    answer: MagnetSurveyAnswer,
  ) => {
    setAnswers((prev) => {
      const exists = prev.find((a) => a.questionId === questionId);
      if (exists) {
        return prev.map((a) => (a.questionId === questionId ? answer : a));
      }
      return [...prev, answer];
    });
  };

  const hasUnansweredRequired = questions.some((q) => {
    if (q.isRequired !== 'REQUIRED') return false;
    const a = answers.find((x) => x.questionId === q.questionId);
    if (!a) return true;
    return q.questionType === 'SUBJECTIVE'
      ? !a.subjectiveText.trim()
      : a.selectedItemIds.length === 0;
  });

  const canSubmit = !!email.trim() && !hasUnansweredRequired && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMsg(null);

    // 답변 → magnetAnswerList (질문 세팅 그대로 매핑).
    const magnetAnswerList = answers.map((a) => {
      const question = questions.find((q) => q.questionId === a.questionId);
      let answer = '';
      if (question?.questionType === 'SUBJECTIVE') {
        answer = a.subjectiveText;
      } else {
        answer = (question?.items ?? [])
          .filter((item) => a.selectedItemIds.includes(item.itemId))
          .map((item) => item.value)
          .join(',');
      }
      return { magnetQuestionId: a.questionId, answer };
    });

    try {
      // 이메일이 바뀌었으면 프로필에 반영(부가 작업 — 실패해도 제안 전송은 진행).
      if (email.trim() && email.trim() !== (user?.email ?? '')) {
        const patchBody: PatchUserBody = { email: email.trim() };
        try {
          await patchUser(patchBody);
        } catch {
          // 이메일 저장 실패는 무시하고 제안 전송을 계속한다.
        }
      }
      await postApplication({ magnetId, body: { magnetAnswerList } });
      setSubmitted(true);
    } catch (e) {
      if (extractHttpStatus(e) === 409) {
        setSubmitted(true);
        return;
      }
      setErrorMsg('제안 전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-40 flex items-center justify-center px-5">
        <ModalOverlay onClose={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="듣고 싶은 챌린지 제안하기"
          className="relative z-10 max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-lg bg-white p-6 md:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-40 hover:text-neutral-0 absolute right-5 top-5"
          >
            <X className="h-6 w-6" />
          </button>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <p className="text-small18 md:text-medium22 text-neutral-0 font-bold">
                제안이 전송되었어요!
              </p>
              <p className="text-xsmall14 md:text-xsmall16 text-neutral-40">
                가장 빠르게 섭외하고, 무료 세미나가 열리면
                <br />
                누구보다 먼저 알려드릴게요.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-primary rounded-xs mt-2 min-h-[48px] w-full px-5 py-3 font-semibold text-neutral-100"
              >
                확인
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pr-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-small18 md:text-medium22 text-neutral-0 font-bold">
                  보고 싶은 기업·직무 현직자와
                  <br />
                  세미나 주제를 알려주세요!
                </h2>
                <p className="text-xsmall14 md:text-xsmall16 text-neutral-40">
                  가장 빠르게 섭외하고,
                  <br />
                  무료 세미나가 열리면 누구보다 먼저 알려드립니다.
                </p>
              </div>

              {/* 연락처 (읽기 전용) */}
              <div className="bg-primary-5 rounded-xs flex flex-col gap-1 px-4 py-3">
                <span className="text-xxsmall12 md:text-xsmall14 text-neutral-40">
                  연락처
                </span>
                <span className="text-xsmall16 text-neutral-0 font-medium">
                  {user?.phoneNum || '등록된 연락처가 없어요'}
                </span>
              </div>

              {/* 이메일 */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="seminar-suggest-email"
                  className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-medium"
                >
                  이메일
                </label>
                <LineInput
                  id="seminar-suggest-email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력해 주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* 마그넷 질문 — 어드민 신청폼 세팅 그대로 렌더(희망 직군·듣고 싶은 세미나 주제 등) */}
              {isLoading ? (
                <p className="text-xsmall14 text-neutral-40">
                  질문을 불러오는 중이에요…
                </p>
              ) : (
                questions.length > 0 && (
                  <MagnetSurveySection
                    questions={questions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                )
              )}

              {errorMsg && (
                <p className="text-xsmall14 text-system-error">{errorMsg}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`rounded-xs text-xsmall16 mt-2 min-h-[48px] w-full px-5 py-3 font-semibold text-neutral-100 ${canSubmit ? 'bg-primary' : 'bg-neutral-70 cursor-not-allowed'}`}
              >
                {submitting ? '전송 중…' : '보내기'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};

export default SuggestSeminarModal;
