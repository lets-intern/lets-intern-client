'use client';

import {
  useGetUserMagnetQuestionsQuery,
  usePostMagnetApplicationMutation,
} from '@/api/magnet/magnet';
import { UserMagnetQuestionItem } from '@/api/magnet/magnetSchema';
import { PatchUserBody, usePatchUser, useUserQuery } from '@/api/user/user';
import { SelectButton } from '@/common/button/SelectButton';
import LineInput from '@/common/input/LineInput';
import ModalOverlay from '@/common/ModalOverlay';
import ModalPortal from '@/common/ModalPortal';
import type { MagnetQuestion } from '@/domain/library/apply/MagnetSurveySection';
import CareerModals from '@/domain/mypage/career/CareerModal';
import { useCareerModals } from '@/hooks/useCareerModals';
import { extractHttpStatus } from '@/utils/sentry';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

/** 마그넷 질문 응답 → 내부 형태 (library apply 페이지와 동일 매핑). */
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
 * - 희망 직군: 유저 프로필의 희망 직군 세팅 재사용(JOB_FIELD_ROLES, CareerModal). 프로필에 값이 없을 때 여기서 받아 저장.
 * - 듣고 싶은 세미나 주제: 항상 노출되는 자유 텍스트. 마그넷의 주관식 질문에 매핑해
 *   `POST /magnet-application/{id}` magnetAnswerList로 전송한다.
 * 로그인 사용자 전제(CTA에서 가드).
 */
const SuggestSeminarModal = ({
  magnetId,
  onClose,
}: SuggestSeminarModalProps) => {
  const { data: user } = useUserQuery();
  const { data: questionsData } = useGetUserMagnetQuestionsQuery(magnetId);
  const { mutateAsync: postApplication, isPending: submitting } =
    usePostMagnetApplicationMutation();
  const { mutateAsync: patchUser } = usePatchUser();

  // 희망 직군 선택 — 프로필과 동일한 CareerModal 흐름 재사용(직군 단계만 사용).
  const {
    modalStep,
    setModalStep,
    selectedField,
    setSelectedField,
    selectedPositions,
    setSelectedPositions,
    selectedIndustries,
    setSelectedIndustries,
    getFieldDisplayText,
    closeModal,
  } = useCareerModals();

  const questions = (questionsData?.magnetQuestionList ?? []).map(
    toMagnetQuestion,
  );
  // 세미나 주제 자유 텍스트를 담을 마그넷 주관식 질문.
  const topicQuestion = questions.find((q) => q.questionType === 'SUBJECTIVE');

  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (user?.wishField) setSelectedField(user.wishField);
  }, [user?.wishField, setSelectedField]);

  // 모달 열림 동안 배경 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const canSubmit = !!email.trim() && !!selectedField && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMsg(null);

    // 세미나 주제 텍스트를 마그넷 주관식 질문 답변으로 매핑.
    const magnetAnswerList =
      topicQuestion && topic.trim()
        ? [{ magnetQuestionId: topicQuestion.questionId, answer: topic.trim() }]
        : [];

    try {
      // 프로필 변경분(이메일·희망 직군)만 반영 — 마그넷은 직군을 받지 않으므로 프로필에 저장.
      const patchBody: PatchUserBody = {};
      if (email.trim() && email.trim() !== (user?.email ?? '')) {
        patchBody.email = email.trim();
      }
      if (selectedField && selectedField !== (user?.wishField ?? '')) {
        patchBody.wishField = selectedField;
      }
      if (Object.keys(patchBody).length > 0) {
        try {
          await patchUser(patchBody);
        } catch {
          // 프로필 저장 실패는 무시하고 제안 전송을 계속한다.
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

              {/* 희망 직군 — 프로필 세팅 재사용 */}
              <SelectButton
                label="희망 직군"
                isRequired
                value={getFieldDisplayText()}
                placeholder="희망 직군을 선택해 주세요."
                onClick={() => setModalStep('field')}
              />

              {/* 듣고 싶은 세미나 주제 — 항상 노출되는 자유 텍스트 */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="seminar-suggest-topic"
                  className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-medium"
                >
                  듣고 싶은 세미나 주제를 작성해 주세요
                </label>
                <LineInput
                  id="seminar-suggest-topic"
                  name="topic"
                  placeholder="듣고 싶은 세미나를 자유롭게 적어주세요"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

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

        {/* 희망 직군 선택 모달 (직군 단계만 사용) */}
        <CareerModals
          setModalStep={setModalStep}
          modalStep={modalStep}
          initialField={selectedField}
          initialPositions={selectedPositions}
          initialIndustries={selectedIndustries}
          userGrade=""
          onGradeComplete={() => closeModal()}
          onFieldComplete={(field) => {
            setSelectedField(field);
            closeModal();
          }}
          onPositionsComplete={(positions) => {
            setSelectedPositions(positions);
            closeModal();
          }}
          onIndustriesComplete={(industries) => {
            setSelectedIndustries(industries);
            closeModal();
          }}
          onClose={closeModal}
        />
      </div>
    </ModalPortal>
  );
};

export default SuggestSeminarModal;
