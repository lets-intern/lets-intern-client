'use client';

import clsx from 'clsx';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  useSectionAnchor,
  type UseSectionAnchorOptions,
} from './useSectionAnchor';

export interface SectionAnchorItem {
  /** 섹션 엘리먼트의 DOM id. 소비 측 섹션에 `scroll-mt-*` 로 offset 을 준다. */
  id: string;
  label: string;
}

export interface SectionAnchorNavProps extends UseSectionAnchorOptions {
  items: SectionAnchorItem[];
  /** nav 컨테이너 클래스. */
  className?: string;
  /** 모든 탭 공통 클래스. */
  itemClassName?: string;
  /** 활성 탭 클래스(색상·굵기 토큰을 소비 측에서 주입). */
  activeItemClassName?: string;
  /** 비활성 탭 클래스. */
  inactiveItemClassName?: string;
  /** 밑줄 인디케이터 클래스(색상 토큰을 소비 측에서 주입). */
  indicatorClassName?: string;
}

const INDICATOR_TRANSITION_MS = 200;

/**
 * 섹션 앵커 밑줄 탭. `useSectionAnchor` 로 활성 섹션을 추적하고 클릭 시 스크롤한다.
 * 색상·테마는 하드코딩하지 않고 `*ClassName` prop(토큰)으로 주입받는다.
 * 구조(레이아웃) 클래스만 내부에서 지정한다.
 */
export function SectionAnchorNav({
  items,
  className,
  itemClassName,
  activeItemClassName,
  inactiveItemClassName,
  indicatorClassName,
  rootMargin,
  threshold,
  onActiveChange,
}: SectionAnchorNavProps) {
  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);
  const { activeId, getAnchorProps } = useSectionAnchor(sectionIds, {
    rootMargin,
    threshold,
    onActiveChange,
  });

  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    if (!navRef.current || !activeRef.current) return;
    setIndicator({
      left: activeRef.current.offsetLeft,
      width: activeRef.current.offsetWidth,
    });
  }, [activeId, items]);

  return (
    <nav
      ref={navRef}
      className={clsx(
        'scrollbar-hide relative flex w-full flex-nowrap overflow-x-auto',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const anchorProps = getAnchorProps(item.id);

        return (
          <button
            key={item.id}
            ref={
              isActive
                ? (el) => {
                    activeRef.current = el;
                  }
                : undefined
            }
            type="button"
            {...anchorProps}
            className={clsx(
              'text-nowrap transition-colors',
              itemClassName,
              isActive ? activeItemClassName : inactiveItemClassName,
            )}
          >
            {item.label}
          </button>
        );
      })}
      <span
        aria-hidden
        className={clsx('absolute bottom-0 h-0.5', indicatorClassName)}
        style={{
          left: indicator.left,
          width: indicator.width,
          transition: `left ${INDICATOR_TRANSITION_MS}ms ease-out, width ${INDICATOR_TRANSITION_MS}ms ease-out`,
        }}
      />
    </nav>
  );
}
