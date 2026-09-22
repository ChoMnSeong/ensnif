import {
    cloneElement,
    isValidElement,
    useId,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react'
import { mergeStyles } from './types.js'

export type FormFieldProps = {
    label?: ReactNode
    htmlFor?: string
    required?: boolean
    description?: ReactNode
    error?: ReactNode
    hint?: ReactNode
    children: ReactNode
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export const FormField = ({
    label,
    htmlFor,
    required,
    description,
    error,
    hint,
    children,
    style,
    ref,
    ...rest
}: FormFieldProps) => {
    const uid = useId()
    const fieldId = htmlFor ?? `${uid}-field`
    const descriptionId = description ? `${uid}-description` : undefined
    const messageId = error || hint ? `${uid}-message` : undefined
    const describedBy =
        [descriptionId, messageId].filter(Boolean).join(' ') || undefined

    // Fragment 는 props 를 받지 못하고 조용히 버린다. 자식이 여럿이면 어느 것에
    // 붙일지 알 수 없다. 두 경우 모두 주입을 건너뛰고, 라벨도 없는 id 를 가리키지
    // 않도록 htmlFor 를 비운다(연결되지 않은 label 은 스크린리더를 더 헷갈리게 한다).
    const injectable =
        isValidElement(children) && typeof children.type !== 'symbol'

    const control = injectable
        ? cloneElement(children as ReactElement<Record<string, unknown>>, {
              id:
                  ((children as ReactElement<Record<string, unknown>>).props
                      .id as string | undefined) ?? fieldId,
              'aria-describedby':
                  ((children as ReactElement<Record<string, unknown>>).props[
                      'aria-describedby'
                  ] as string | undefined) ?? describedBy,
              'aria-invalid':
                  ((children as ReactElement<Record<string, unknown>>).props[
                      'aria-invalid'
                  ] as boolean | undefined) ?? (error ? true : undefined),
          })
        : children

    const labelFor = htmlFor ?? (injectable ? fieldId : undefined)

    return (
        <div
            ref={ref}
            style={mergeStyles(
                {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                },
                style,
            )}
            {...rest}
        >
            {label && (
                <label
                    htmlFor={labelFor}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--ds-color-foreground-secondary)',
                        lineHeight: 1.4,
                    }}
                >
                    {label}
                    {required && (
                        <span
                            aria-hidden
                            style={{ color: 'var(--ds-color-state-danger)' }}
                        >
                            *
                        </span>
                    )}
                </label>
            )}
            {description && (
                <span
                    id={descriptionId}
                    style={{
                        fontSize: '11px',
                        color: 'var(--ds-color-foreground-tertiary)',
                        lineHeight: 1.5,
                    }}
                >
                    {description}
                </span>
            )}
            {control}
            {(error || hint) && (
                <span
                    id={messageId}
                    role={error ? 'alert' : undefined}
                    style={{
                        fontSize: '11px',
                        color: error
                            ? 'var(--ds-color-state-danger)'
                            : 'var(--ds-color-foreground-tertiary)',
                        lineHeight: 1.5,
                    }}
                >
                    {error ?? hint}
                </span>
            )}
        </div>
    )
}

export type FormProps = HTMLAttributes<HTMLFormElement> & {
    ref?: Ref<HTMLFormElement>
}

export const Form = ({ style, ref, ...rest }: FormProps) => (
    <form
        ref={ref}
        style={mergeStyles(
            { display: 'flex', flexDirection: 'column', gap: '16px' },
            style,
        )}
        {...rest}
    />
)
