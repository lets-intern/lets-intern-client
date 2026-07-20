import { Checkbox, Chip, FormControlLabel, Typography } from '@mui/material';
import { useState } from 'react';

import {
  PLACEHOLDER_CHALLENGE_TYPES,
  PLACEHOLDER_LIVE_PROGRAMS,
  useCouponTargetState,
} from '../hooks/useCouponTargetState';
import ExpandableRow from '../ui/ExpandableRow';

export type {
  ConditionType,
  TargetCondition,
} from '../hooks/useCouponTargetState';

interface Props {
  value: import('../hooks/useCouponTargetState').TargetCondition[];
  onChange: (
    conditions: import('../hooks/useCouponTargetState').TargetCondition[],
  ) => void;
}

const CouponTargetSection = ({ value, onChange }: Props) => {
  const {
    allPayers,
    toggleAllPayers,
    challenge,
    live,
    chips,
    removeChip,
    resetAll,
  } = useCouponTargetState(value, onChange);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    challenge: true,
  });

  return (
    <div>
      {/* 전체 결제자 */}
      <div
        role="button"
        onClick={toggleAllPayers}
        className={`mb-2 cursor-pointer rounded-sm border px-4 py-1 transition-colors hover:bg-gray-50 ${allPayers ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
      >
        <FormControlLabel
          onClick={(e) => e.stopPropagation()}
          control={
            <Checkbox
              checked={allPayers}
              onChange={toggleAllPayers}
              size="small"
            />
          }
          label={
            <span className="flex items-center gap-2">
              <span className="font-medium">전체</span>
              <Typography variant="caption" color="text.secondary">
                전체 결제자 (결제 이력이 있는 모든 유저)
              </Typography>
            </span>
          }
        />
      </div>

      <div
        className={`space-y-2 ${allPayers ? 'pointer-events-none opacity-45' : ''}`}
      >
        {/* 챌린지 */}
        <div
          className={`overflow-hidden rounded-sm border transition-colors ${challenge.mode !== 'none' ? 'border-blue-200' : 'border-gray-200'}`}
        >
          <ExpandableRow
            checked={challenge.mode === 'all'}
            indeterminate={challenge.mode === 'partial'}
            label="챌린지"
            isOpen={expanded.challenge}
            badge={
              challenge.mode !== 'none' && (
                <Chip
                  label={
                    challenge.mode === 'all'
                      ? '전체'
                      : `일부 ${challenge.count}`
                  }
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )
            }
            onToggleExpand={() =>
              setExpanded((p) => ({ ...p, challenge: !p.challenge }))
            }
            onToggleCheck={challenge.toggleAll}
            className={`px-4 py-1 ${challenge.mode !== 'none' ? 'bg-blue-50/60' : 'bg-white'}`}
          />

          {expanded.challenge && (
            <div className="border-t border-gray-100 bg-white">
              {challenge.mode === 'all' && (
                <p className="text-xxsmall12 px-4 pt-3 text-blue-500">
                  · 챌린지 전체 선택 상태입니다. 향후 추가되는 챌린지도 자동
                  포함됩니다.
                </p>
              )}
              <div className="space-y-1 p-3">
                {PLACEHOLDER_CHALLENGE_TYPES.map((t) => {
                  const tKey = `type:${t.challengeType}`;
                  const typeMode = challenge.typeMode[t.challengeType];

                  return (
                    <div
                      key={t.challengeType}
                      className="rounded-md border border-gray-100"
                    >
                      <ExpandableRow
                        checked={typeMode === 'all'}
                        indeterminate={typeMode === 'partial'}
                        disabled={challenge.mode === 'all'}
                        label={t.desc}
                        isOpen={!!expanded[tKey]}
                        onToggleExpand={() =>
                          setExpanded((p) => ({ ...p, [tKey]: !p[tKey] }))
                        }
                        onToggleCheck={() =>
                          challenge.toggleType(t.challengeType)
                        }
                        className="px-3 py-1"
                      />
                      {expanded[tKey] && (
                        <div className="border-t border-gray-50 px-3 py-2 pl-6">
                          <div className="grid grid-cols-2 gap-y-1">
                            {t.challengeList.map((p) => (
                              <FormControlLabel
                                key={p.id}
                                control={
                                  <Checkbox
                                    checked={challenge.checkedPrograms.has(
                                      p.id,
                                    )}
                                    disabled={typeMode === 'all'}
                                    onChange={() =>
                                      challenge.toggleProgram(
                                        t.challengeType,
                                        p.id,
                                      )
                                    }
                                    size="small"
                                  />
                                }
                                label={p.title}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* LIVE 클래스 */}
        <div
          className={`overflow-hidden rounded-sm border transition-colors ${live.mode !== 'none' ? 'border-blue-200' : 'border-gray-200'}`}
        >
          <ExpandableRow
            checked={live.mode === 'all'}
            indeterminate={live.mode === 'partial'}
            label="LIVE 클래스"
            isOpen={expanded.live}
            badge={
              live.mode !== 'none' && (
                <Chip
                  label={live.mode === 'all' ? '전체' : `일부 ${live.count}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )
            }
            onToggleExpand={() => setExpanded((p) => ({ ...p, live: !p.live }))}
            onToggleCheck={live.toggleAll}
            className={`px-4 py-1 ${live.mode !== 'none' ? 'bg-blue-50/60' : 'bg-white'}`}
          />
          {expanded.live && (
            <div className="border-t border-gray-100 bg-white px-4 py-3">
              {live.mode === 'all' && (
                <p className="mb-2 text-xs text-blue-500">
                  · LIVE 클래스 전체 선택 상태입니다. 향후 추가되는 LIVE도 자동
                  포함됩니다.
                </p>
              )}
              <div className="grid grid-cols-2 gap-y-1">
                {PLACEHOLDER_LIVE_PROGRAMS.map((p) => (
                  <FormControlLabel
                    key={p.id}
                    control={
                      <Checkbox
                        checked={live.checkedPrograms.has(p.id)}
                        disabled={live.mode === 'all'}
                        onChange={() => live.toggleProgram(p.id)}
                        size="small"
                      />
                    }
                    label={p.title}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 선택 요약 칩 */}
      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">
            선택된 대상 <span className="text-blue-600">{chips.length}</span>
          </span>
          {!allPayers && chips.length > 0 && (
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              전체 해제
            </button>
          )}
        </div>
        {chips.length === 0 ? (
          <p className="text-xs text-gray-400">
            미설정 시 등록형 쿠폰으로 저장됩니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip, i) => (
              <Chip
                key={i}
                label={chip.label}
                size="small"
                variant="outlined"
                onDelete={() => removeChip(chip)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponTargetSection;
