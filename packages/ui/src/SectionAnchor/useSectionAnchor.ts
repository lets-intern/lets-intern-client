'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseSectionAnchorOptions {
  /** IntersectionObserver rootMargin. 상단 고정 헤더가 있으면 음수 top 으로 활성 판정을 보정한다. */
  rootMargin?: string;
  threshold?: number | number[];
  /** 활성 섹션이 바뀔 때 호출된다. */
  onActiveChange?: (id: string) => void;
}

export interface AnchorProps {
  'aria-current': 'location' | undefined;
  'data-active': boolean;
  onClick: () => void;
}

export interface UseSectionAnchorReturn {
  activeId: string;
  /** 해당 섹션으로 부드럽게 스크롤한다. */
  scrollTo: (id: string) => void;
  /** 앵커(탭/링크)에 스프레드할 접근성·클릭 props 를 만든다. */
  getAnchorProps: (id: string) => AnchorProps;
}

/**
 * 섹션 스크롤 스파이 + 앵커 이동 헤드리스 훅.
 *
 * 마크업·색상·스크롤 offset 을 포함하지 않는다. 스크롤 위치 보정이 필요하면
 * 소비 측 섹션 엘리먼트에 `scroll-mt-*`(예: `scroll-mt-16`) 를 지정한다.
 * (JS 상수로 `rect.top - 70` 같은 offset 을 박지 않는다.)
 *
 * @param sectionIds 관찰할 섹션 엘리먼트 id 목록(DOM `id` 와 일치).
 */
export function useSectionAnchor(
  sectionIds: string[],
  options: UseSectionAnchorOptions = {},
): UseSectionAnchorReturn {
  const { rootMargin, threshold = 0.5, onActiveChange } = options;
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  // 최신 콜백을 effect 재실행 없이 참조하기 위한 ref.
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 보이는 섹션 중 가장 위쪽(문서 순서상 먼저) 것을 활성으로 삼는다.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (!next) return;
        setActiveId((prev) => {
          if (prev === next) return prev;
          onActiveChangeRef.current?.(next);
          return next;
        });
      },
      { rootMargin, threshold },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // threshold 가 배열이면 참조가 매번 바뀌므로 직렬화해 안정화한다.
  }, [sectionIds, rootMargin, JSON.stringify(threshold)]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const getAnchorProps = useCallback(
    (id: string): AnchorProps => ({
      'aria-current': activeId === id ? 'location' : undefined,
      'data-active': activeId === id,
      onClick: () => scrollTo(id),
    }),
    [activeId, scrollTo],
  );

  return { activeId, scrollTo, getAnchorProps };
}
