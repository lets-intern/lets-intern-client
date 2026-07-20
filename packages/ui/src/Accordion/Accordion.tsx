'use client';

import clsx from 'clsx';
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface AccordionContextValue {
  isItemOpen: (value: string) => boolean;
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`${component}는 <Accordion> 안에서만 사용할 수 있습니다.`);
  }
  return ctx;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function useAccordionItemContext(component: string): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      `${component}는 <AccordionItem> 안에서만 사용할 수 있습니다.`,
    );
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

interface AccordionCommonProps {
  className?: string;
  children: ReactNode;
}

interface AccordionSingleProps extends AccordionCommonProps {
  type: 'single';
  /** 제어형: 열린 항목의 value(''=모두 닫힘). 지정 시 비제어 상태를 무시한다. */
  value?: string;
  /** 비제어형 초기 열림 항목. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface AccordionMultipleProps extends AccordionCommonProps {
  type: 'multiple';
  /** 제어형: 열린 항목 value 배열. */
  value?: string[];
  /** 비제어형 초기 열림 항목 배열. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

function Accordion(props: AccordionProps) {
  const { type, className, children } = props;

  // 열림 집합을 항상 배열로 정규화해 single/multiple 로직을 통일한다.
  const [uncontrolled, setUncontrolled] = useState<string[]>(() => {
    if (props.defaultValue == null) return [];
    return Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.defaultValue];
  });

  // onValueChange 최신 참조를 ref로 추적해 toggleItem이 매 렌더 재생성되지 않도록 한다.
  const onValueChangeRef = useRef(props.onValueChange);
  onValueChangeRef.current = props.onValueChange;

  const isControlled = props.value != null;
  const openValues: string[] = isControlled
    ? Array.isArray(props.value)
      ? props.value
      : props.value
        ? [props.value]
        : []
    : uncontrolled;

  const isItemOpen = useCallback(
    (value: string) => openValues.includes(value),
    [openValues],
  );

  const toggleItem = useCallback(
    (value: string) => {
      const isOpen = openValues.includes(value);

      if (type === 'single') {
        const next = isOpen ? '' : value;
        if (!isControlled) setUncontrolled(next ? [next] : []);
        (onValueChangeRef.current as AccordionSingleProps['onValueChange'])?.(
          next,
        );
        return;
      }

      const next = isOpen
        ? openValues.filter((v) => v !== value)
        : [...openValues, value];
      if (!isControlled) setUncontrolled(next);
      (onValueChangeRef.current as AccordionMultipleProps['onValueChange'])?.(
        next,
      );
    },
    [openValues, type, isControlled],
  );

  const ctx = useMemo<AccordionContextValue>(
    () => ({ isItemOpen, toggleItem }),
    [isItemOpen, toggleItem],
  );

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Item                                                                       */
/* -------------------------------------------------------------------------- */

interface AccordionItemProps {
  value: string;
  className?: string;
  children: ReactNode;
}

function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { isItemOpen } = useAccordionContext('AccordionItem');
  const reactId = useId();

  const itemCtx = useMemo<AccordionItemContextValue>(
    () => ({
      value,
      isOpen: isItemOpen(value),
      triggerId: `accordion-trigger-${reactId}`,
      contentId: `accordion-content-${reactId}`,
    }),
    [value, isItemOpen, reactId],
  );

  return (
    <AccordionItemContext.Provider value={itemCtx}>
      <div
        className={className}
        data-state={itemCtx.isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trigger                                                                    */
/* -------------------------------------------------------------------------- */

interface AccordionTriggerProps {
  className?: string;
  children: ReactNode;
}

function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  const { toggleItem } = useAccordionContext('AccordionTrigger');
  const { value, isOpen, triggerId, contentId } =
    useAccordionItemContext('AccordionTrigger');

  // <button> 이므로 Enter/Space 토글은 네이티브로 처리된다(별도 keydown 불필요).
  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={isOpen}
      aria-controls={contentId}
      data-state={isOpen ? 'open' : 'closed'}
      onClick={() => toggleItem(value)}
      className={className}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

function AccordionContent({ className, children }: AccordionContentProps) {
  const { isOpen, triggerId, contentId } =
    useAccordionItemContext('AccordionContent');

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      className={clsx(className)}
    >
      {children}
    </div>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionSingleProps,
  type AccordionMultipleProps,
};
