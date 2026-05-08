import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { mergeStyles } from './types.js'
import { IconCheck } from './icons.js'

export type StepperStep = {
    label: ReactNode
    description?: ReactNode
}

export type StepperProps = {
    steps: StepperStep[]
    current: number
    direction?: 'horizontal' | 'vertical'
} & HTMLAttributes<HTMLOListElement>

const dotSize = 24
const lineThickness = 2

const dotBaseStyle = (
    isCompleted: boolean,
    isActive: boolean,
): CSSProperties => ({
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'inherit',
    background:
        isCompleted || isActive
            ? 'var(--ds-color-accent-background)'
            : 'var(--ds-color-background-inset)',
    color:
        isCompleted || isActive
            ? 'var(--ds-color-accent-color)'
            : 'var(--ds-color-foreground-tertiary)',
    border: isActive
        ? `2px solid var(--ds-color-accent-background)`
        : `1px solid ${
              isCompleted
                  ? 'var(--ds-color-accent-background)'
                  : 'var(--ds-color-border-subtle)'
          }`,
    transition: 'all 160ms ease',
    position: 'relative',
    zIndex: 1,
})

const labelTextStyle = (
    isCompleted: boolean,
    isActive: boolean,
): CSSProperties => ({
    fontSize: '13px',
    fontWeight: isActive ? 700 : 600,
    color:
        isActive || isCompleted
            ? 'var(--ds-color-foreground-primary)'
            : 'var(--ds-color-foreground-tertiary)',
})

const descriptionStyle: CSSProperties = {
    fontSize: '11px',
    color: 'var(--ds-color-foreground-tertiary)',
    marginTop: '2px',
    lineHeight: 1.4,
}

export const Stepper = ({
    steps,
    current,
    direction = 'horizontal',
    style,
    ...rest
}: StepperProps) => {
    if (direction === 'vertical') {
        return (
            <ol
                style={mergeStyles(
                    {
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                    },
                    style,
                )}
                {...rest}
            >
                {steps.map((step, idx) => {
                    const isCompleted = idx < current
                    const isActive = idx === current
                    const isLast = idx === steps.length - 1
                    return (
                        <li
                            key={idx}
                            aria-current={isActive ? 'step' : undefined}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `${dotSize}px 1fr`,
                                columnGap: '12px',
                                rowGap: 0,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: `${dotSize}px`,
                                }}
                            >
                                <span style={dotBaseStyle(isCompleted, isActive)}>
                                    {isCompleted ? (
                                        <IconCheck size={14} />
                                    ) : (
                                        idx + 1
                                    )}
                                </span>
                                {!isLast && (
                                    <span
                                        style={{
                                            width: `${lineThickness}px`,
                                            flex: 1,
                                            minHeight: '24px',
                                            background: isCompleted
                                                ? 'var(--ds-color-accent-background)'
                                                : 'var(--ds-color-border-subtle)',
                                        }}
                                    />
                                )}
                            </div>
                            <div
                                style={{
                                    paddingBottom: !isLast ? '20px' : 0,
                                    paddingTop: '2px',
                                    textAlign: 'left',
                                    minWidth: 0,
                                }}
                            >
                                <div style={labelTextStyle(isCompleted, isActive)}>
                                    {step.label}
                                </div>
                                {step.description && (
                                    <div style={descriptionStyle}>
                                        {step.description}
                                    </div>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
        )
    }

    // horizontal
    return (
        <ol
            style={mergeStyles(
                {
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                },
                style,
            )}
            {...rest}
        >
            {steps.map((step, idx) => {
                const isCompleted = idx < current
                const isActive = idx === current
                const isFirst = idx === 0
                const isLast = idx === steps.length - 1
                const leftCompleted = idx <= current
                const rightCompleted = idx < current

                return (
                    <li
                        key={idx}
                        aria-current={isActive ? 'step' : undefined}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            minWidth: 0,
                        }}
                    >
                        {!isFirst && (
                            <span
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    top: `${dotSize / 2 - lineThickness / 2}px`,
                                    left: 0,
                                    right: '50%',
                                    height: `${lineThickness}px`,
                                    marginRight: `${dotSize / 2 + 2}px`,
                                    background: leftCompleted
                                        ? 'var(--ds-color-accent-background)'
                                        : 'var(--ds-color-border-subtle)',
                                }}
                            />
                        )}
                        {!isLast && (
                            <span
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    top: `${dotSize / 2 - lineThickness / 2}px`,
                                    left: '50%',
                                    right: 0,
                                    height: `${lineThickness}px`,
                                    marginLeft: `${dotSize / 2 + 2}px`,
                                    background: rightCompleted
                                        ? 'var(--ds-color-accent-background)'
                                        : 'var(--ds-color-border-subtle)',
                                }}
                            />
                        )}
                        <span style={dotBaseStyle(isCompleted, isActive)}>
                            {isCompleted ? (
                                <IconCheck size={14} />
                            ) : (
                                idx + 1
                            )}
                        </span>
                        <div
                            style={{
                                marginTop: '8px',
                                textAlign: 'center',
                                minWidth: 0,
                                width: '100%',
                                padding: '0 4px',
                            }}
                        >
                            <div style={labelTextStyle(isCompleted, isActive)}>
                                {step.label}
                            </div>
                            {step.description && (
                                <div style={descriptionStyle}>
                                    {step.description}
                                </div>
                            )}
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}
