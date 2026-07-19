---
name: headless-component
description: 렛츠커리어에서 재사용 가능한 헤드리스 컴포넌트·훅을 만드는 기준. 로직과 디자인을 분리해 packages/ui·packages/hooks에 공용 프리미티브(탭·아코디언·캐러셀·앵커·토글·모달 등)를 만들거나, 도메인 컴포넌트에서 재사용 로직을 추출·승격할 때 자동 활성화. "공통 컴포넌트로 빼줘", "헤드리스로 만들어", "재사용 가능하게", "packages/ui에 만들어", "중복 로직 추출", "이거 여러 군데서 쓰니까 공용화" 같은 요청이면 반드시 이 기준을 따른다. 새 컴포넌트를 만들 때도 공용화 여부와 계층 분리를 먼저 이 기준으로 판단하라.
---

# 헤드리스 컴포넌트 제작 기준

## 왜 헤드리스인가

로직(상태·이펙트·접근성)과 디자인(마크업·스타일)을 분리하면 같은 동작을 여러 디자인에 재사용할 수 있고, 디자인 변경이 로직을 깨지 않는다. 렛츠커리어에는 같은 섹션 앵커 로직이 5곳에 복붙돼 있고(각자 색상·offset 하드코딩), FAQ 토글이 4곳에 중복된다. 이게 헤드리스로 분리하지 않았을 때 치르는 비용이다.

## 1단계 — 뺄 것인가부터 판단 (과추출 금지)

공용화는 공짜가 아니다. AGENTS.md 원칙은 **"premature abstraction보다 중복이 낫다"** 이다. 아래를 만족할 때만 공용으로 뺀다.

- **3의 법칙**: 실제로 3곳 이상에서 쓰이거나 쓰일 게 확실할 때만.
- 이미 검증된 구현이 도메인에 있으면 새로 만들지 말고 **승격(promote)** 한다 — 파일을 `packages`로 옮기고 import 경로만 갱신(로직 무변경). 예: `domain/membership/ui/useCarouselDots.ts`.
- 1~2곳만 쓰면 도메인 안에 두고 중복을 허용한다. 억지로 빼면 오히려 결합만 늘어난다.

배치 규칙(folder-structure 스킬과 동일):

| 사용 범위 | 위치 |
|---|---|
| 1 도메인 | `domain/{d}/` |
| 인접 2~3 도메인 | 상위/주 도메인 |
| 무관한 3곳+ | UI = `packages/ui`, 훅 = `packages/hooks`, 유틸 = `packages/utils` |

## 2단계 — 3계층으로 나눈다

컴포넌트를 세 층으로 생각한다. 전부 만들 필요는 없고 필요한 층만 만든다.

1. **헤드리스 로직** (`packages/hooks` 또는 `packages/ui/<name>/use*.ts`): 상태·이펙트·접근성 배선만. 마크업·색상·offset 없음. 훅 또는 renderless.
2. **디자인 전용** (`packages/ui`): controlled props(`value`/`onChange` 등)를 받아 렌더만. 스크롤·페치 같은 동작 없음. `className` 주입 허용.
3. **조합** (도메인): 1+2를 엮어 실제 데이터·디자인을 연결. 도메인 폴더에 둔다.

코드베이스 실물 레퍼런스:

- 디자인 전용 예: `packages/ui/src/CategoryTabs/index.tsx` — controlled 밑줄 탭, 제네릭 `<Value extends string>`, 스크롤 동작 없음.
- 헤드리스 훅 예: `apps/web/src/domain/membership/ui/useCarouselDots.ts` — IntersectionObserver로 active 슬라이드 추적 + `scrollToSlide`, 디자인 무관.
- 안티패턴(융합) 예: `apps/web/src/common/dropdown/FaqDropdown.tsx` — 토글 state·디자인·아이콘이 한 덩어리이고 `Faq` 스키마에 강결합 → 재사용 불가.

더 많은 예시와 배경은 `.claude/docs/letscareer/headless-components.md` 참고.

## 3단계 — 구현 기준

- **스타일 주입**: 색상·간격을 하드코딩하지 말고 `className`/토큰 prop으로 받는다. 기존 앵커들이 인라인 `style={{ color: '#4d55f5' }}` 로 박아 재사용을 막은 것이 반면교사.
- **offset은 CSS로**: 스크롤 위치 보정을 JS 상수(`rect.top - 70`)로 박지 말고 소비 측 `scroll-mt-*` 로 넘긴다. `scrollIntoView` 위임이 가장 이식성 높다.
- **접근성**: 상호작용 프리미티브는 aria가 필수다. 아코디언은 `aria-expanded`·`aria-controls`·`role="region"`, 탭은 `role="tab"`, 키보드 이동을 지원한다. 로직 계층에서 배선한다.
- **제네릭 타입**: 값 유니온을 `<Value extends string>` 으로 받아 타입 안전하게(CategoryTabs 참고).
- **컴파운드 패턴**: 구조가 있는 컴포넌트는 컴파운드로 나눈다. 예: `<Accordion><AccordionItem><AccordionTrigger/><AccordionContent/></AccordionItem></Accordion>`. 공유 상태는 Context로.
- **controlled 우선**: `value`/`onChange` 를 받는 controlled를 기본으로, 필요 시 uncontrolled(`defaultValue`)도 지원.
- **'use client'**: 상태·이펙트가 있으면 명시하고, 없으면 RSC로 남긴다.
- **export**: `packages/ui/src/index.ts` 또는 `packages/hooks/src/index.ts` 에 추가해야 소비처에서 import된다. 빼먹으면 만들어도 못 쓴다.
- **Storybook**: `packages/ui` 신규 컴포넌트는 `<Name>.stories.tsx` 로 동작을 문서화·검증한다.

## 4단계 — 기존 코드는 건드리지 않는다

공용 프리미티브를 새로 만들 때 **기존 중복 구현을 즉시 리팩터하지 않는다.** 새 것을 만들어 두고 신규 기능부터 사용한 뒤, 기존 사용처 이관은 별도 후속 작업으로 분리한다. 배포 리스크와 리뷰 범위를 줄이기 위함이다. FAQ 4곳·앵커 5곳을 한 PR에서 한꺼번에 갈아엎지 않는다.

## 체크리스트

- 3의 법칙을 충족하는가 (아니면 도메인에 두고 중복 허용)
- 이미 있는 구현을 승격하면 되는가 (새로 만들기 전에 확인)
- 로직/디자인 계층을 분리했는가
- 색상·offset을 하드코딩하지 않았는가 (className·토큰·scroll-mt)
- 접근성(aria·키보드)을 배선했는가
- `index.ts` 에 export 했는가
- Storybook을 추가했는가 (packages/ui)
- 기존 중복 구현은 무수정으로 보존했는가
