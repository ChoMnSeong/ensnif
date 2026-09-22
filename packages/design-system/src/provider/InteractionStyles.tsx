/**
 * 인터랙션 레이어.
 *
 * 컴포넌트가 전부 인라인 style 기반이라 :hover / :active 를 직접 표현할 수 없다.
 * FocusStyles 가 [data-ds-focusable] 어트리뷰트로 포커스 링을 푼 것과 같은 방식으로,
 * [data-ds-interactive="<tone>"] 하나만 붙이면 hover / active / disabled 가 붙도록 한다.
 *
 * variant 가 이미 내보내던 --ds-color-accent-hover-background /
 * --ds-color-accent-active-background 를 여기서 처음으로 실제 소비한다.
 *
 * !important 가 붙은 이유: 컴포넌트가 background 를 인라인 style 로 지정하는데
 * 인라인 선언은 캐스케이드에서 일반 스타일시트 규칙을 이긴다. FocusStyles 는
 * 인라인과 겹치지 않는 box-shadow 만 건드려서 필요 없었지만, 여기는 필요하다.
 */

const NOT_DISABLED =
    ':not(:disabled):not([aria-disabled="true"]):not([data-ds-disabled])'
/** 이미 선택된 항목은 배경을 갈아끼우지 않는다. 선택 표시를 hover 가 지워버리기 때문. */
const NOT_SELECTED =
    ':not([aria-current]):not([aria-selected="true"]):not([aria-pressed="true"])'

const INTERACTION_CSS = `
[data-ds-interactive] {
    /* 모바일 더블탭 줌 대기(약 300ms) 제거 */
    touch-action: manipulation;
    transition-property: background, background-color, border-color, color, box-shadow, opacity, transform !important;
    transition-duration: var(--ds-motion-duration-fast) !important;
    transition-timing-function: var(--ds-motion-easing-ease-out) !important;
}

/* accent: 주 액션. variant 가 정의한 hover/active 토큰을 그대로 쓴다. */
[data-ds-interactive="accent"]:hover${NOT_DISABLED} {
    background: var(--ds-color-accent-hover-background) !important;
}
[data-ds-interactive="accent"]:active${NOT_DISABLED} {
    background: var(--ds-color-accent-active-background) !important;
    transform: translateY(1px) scale(0.985) !important;
}

/* outline: 테두리만 있는 컨트롤(secondary 버튼, 입력 트리거 등). */
[data-ds-interactive="outline"]:hover${NOT_DISABLED} {
    background: var(--ds-color-background-muted) !important;
    border-color: var(--ds-color-border-strong) !important;
}
[data-ds-interactive="outline"]:active${NOT_DISABLED} {
    background: var(--ds-color-background-inset) !important;
    transform: translateY(1px) !important;
}

/* subtle: 배경 없는 컨트롤(ghost 버튼, 메뉴 항목, 탭, 트리 노드, 페이지네이션).
   선택된 항목은 배경을 유지하고 눌림 피드백만 받는다. */
[data-ds-interactive="subtle"]:hover${NOT_DISABLED}${NOT_SELECTED} {
    background: var(--ds-color-background-muted) !important;
}
[data-ds-interactive="subtle"]:active${NOT_DISABLED}${NOT_SELECTED} {
    background: var(--ds-color-background-inset) !important;
}
[data-ds-interactive="subtle"]:active${NOT_DISABLED} {
    transform: translateY(1px) !important;
}

/* 의미색 버튼. 전용 hover 토큰이 없어 전경색을 섞어 명도를 움직인다.
   라이트 모드에서는 어두워지고 다크 모드에서는 밝아져 양쪽 모두에서 반응이 보인다. */
[data-ds-interactive="success"]:hover${NOT_DISABLED} {
    background: color-mix(in oklab, var(--ds-color-state-success) 88%, var(--ds-color-foreground-primary)) !important;
}
[data-ds-interactive="success"]:active${NOT_DISABLED} {
    background: color-mix(in oklab, var(--ds-color-state-success) 78%, var(--ds-color-foreground-primary)) !important;
    transform: translateY(1px) scale(0.985) !important;
}
[data-ds-interactive="warning"]:hover${NOT_DISABLED} {
    background: color-mix(in oklab, var(--ds-color-state-warning) 88%, var(--ds-color-foreground-primary)) !important;
}
[data-ds-interactive="warning"]:active${NOT_DISABLED} {
    background: color-mix(in oklab, var(--ds-color-state-warning) 78%, var(--ds-color-foreground-primary)) !important;
    transform: translateY(1px) scale(0.985) !important;
}
[data-ds-interactive="danger"]:hover${NOT_DISABLED} {
    background: color-mix(in oklab, var(--ds-color-state-danger) 88%, var(--ds-color-foreground-primary)) !important;
}
[data-ds-interactive="danger"]:active${NOT_DISABLED} {
    background: color-mix(in oklab, var(--ds-color-state-danger) 78%, var(--ds-color-foreground-primary)) !important;
    transform: translateY(1px) scale(0.985) !important;
}

/* 표면 자체가 눌리는 컨트롤(카드, 리스트 행, 업로드 드롭존). */
[data-ds-interactive="surface"]:hover${NOT_DISABLED} {
    border-color: var(--ds-color-border-strong) !important;
    box-shadow: var(--ds-shadow-md) !important;
}
[data-ds-interactive="surface"]:active${NOT_DISABLED} {
    box-shadow: var(--ds-shadow-xs) !important;
    transform: translateY(1px) !important;
}

/* control: Checkbox / Radio / Switch. label 이 hit area 이고 실제로 보이는 것은
   자식 [data-ds-focus-visual] 이라 hover 를 자식으로 내려보낸다. */
[data-ds-interactive="control"]:hover${NOT_DISABLED} [data-ds-focus-visual] {
    border-color: var(--ds-color-border-strong) !important;
}
[data-ds-interactive="control"]:active${NOT_DISABLED} [data-ds-focus-visual] {
    transform: scale(0.94) !important;
}

[data-ds-interactive]:disabled,
[data-ds-interactive][aria-disabled="true"],
[data-ds-interactive][data-ds-disabled] {
    cursor: not-allowed;
}

/* 뉴모피즘은 눌림을 음영 반전으로 표현하는 것이 고유 문법이라 따로 둔다. */
[data-ds-variant="neumorphism"] [data-ds-interactive="accent"]:active${NOT_DISABLED},
[data-ds-variant="neumorphism"] [data-ds-interactive="surface"]:active${NOT_DISABLED} {
    box-shadow: var(--ds-shadow-inner) !important;
    transform: none !important;
}

/* Button/Spinner 가 인스턴스마다 <style> 을 심던 것을 하나로 모은다. */
@keyframes ds-spin {
    to { transform: rotate(360deg); }
}

/* 긴 목록에서 화면 밖 항목의 레이아웃·페인트를 건너뛴다. 가상화 라이브러리 없이
   초기 렌더 비용을 줄이는 방법이라, 목록이 실제로 길 때만 컴포넌트가 이 속성을 붙인다.
   contain-intrinsic-size 의 auto 는 마지막으로 그렸던 크기를 기억해 스크롤바 튐을 막는다. */
[data-ds-list-item] {
    content-visibility: auto;
    contain-intrinsic-size: auto var(--ds-list-item-size, 36px);
}

/* 숫자 정렬. DataTable/Stat/Gauge/Pagination/차트처럼 값이 세로로 쌓이는 곳에서
   비례폭 숫자가 흔들리는 것을 막는다. */
[data-ds-numeric] {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1;
}

@media (prefers-reduced-motion: reduce) {
    [data-ds-mode] *,
    [data-ds-mode] *::before,
    [data-ds-mode] *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    [data-ds-interactive]:active${NOT_DISABLED} {
        transform: none !important;
    }
    /* 로딩 표시는 진행 중이라는 필수 피드백이라 멈추지 않고 속도만 낮춘다. */
    [data-ds-spinner],
    [data-ds-spinner] * {
        animation-duration: 1.6s !important;
        animation-iteration-count: infinite !important;
    }
}

/* 투명도 저감 환경에서는 유리 표면을 불투명으로 내린다.
   backdrop-filter 만 끄면 반투명 배경이 그라디언트 위에 남아 대비가 무너진다. */
@media (prefers-reduced-transparency: reduce) {
    [data-ds-variant="glassmorphism"] {
        --ds-surface-panel-backdrop-filter: none !important;
        --ds-surface-card-backdrop-filter: none !important;
        --ds-surface-overlay-backdrop-filter: none !important;
        --ds-surface-inset-backdrop-filter: none !important;
    }
    [data-ds-variant="glassmorphism"][data-ds-mode="light"] {
        --ds-surface-panel-background: var(--ds-palette-neutral-50) !important;
        --ds-surface-card-background: var(--ds-palette-neutral-50) !important;
        --ds-surface-overlay-background: var(--ds-palette-neutral-50) !important;
        --ds-surface-inset-background: var(--ds-palette-neutral-100) !important;
    }
    [data-ds-variant="glassmorphism"][data-ds-mode="dark"] {
        --ds-surface-panel-background: var(--ds-palette-neutral-800) !important;
        --ds-surface-card-background: var(--ds-palette-neutral-800) !important;
        --ds-surface-overlay-background: var(--ds-palette-neutral-900) !important;
        --ds-surface-inset-background: var(--ds-palette-neutral-900) !important;
    }
}
`.trim()

export const InteractionStyles = () => (
    <style
        data-ds-interaction-styles
        dangerouslySetInnerHTML={{ __html: INTERACTION_CSS }}
    />
)
