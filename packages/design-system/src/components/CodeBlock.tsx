import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { mergeStyles } from './types.js'
import { IconCheck } from './icons.js'

export type CodeBlockProps = {
    code: string
    language?: string
    fileName?: ReactNode
    showLineNumbers?: boolean
    showCopy?: boolean
    maxHeight?: number | string
    ref?: Ref<HTMLDivElement>
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export const CodeBlock = ({
    code,
    language,
    fileName,
    showLineNumbers,
    showCopy = true,
    maxHeight,
    style,
    ref,
    ...rest
}: CodeBlockProps) => {
    const [copied, setCopied] = useState(false)
    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
        } catch {
            /* ignore */
        }
    }
    const lines = code.split('\n')
    const lineNumberWidth = String(lines.length).length

    return (
        <div
            ref={ref}
            style={mergeStyles(
                {
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-md)',
                    overflow: 'hidden',
                    background: 'var(--ds-color-background-inset)',
                    fontFamily: 'var(--ds-typography-fontFamily-mono)',
                },
                style,
            )}
            {...rest}
        >
            {(fileName || language || showCopy) && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px 6px 14px',
                        background: 'var(--ds-color-background-card)',
                        borderBottom: '1px solid var(--ds-color-border-subtle)',
                        fontSize: '11px',
                    }}
                >
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily:
                                'var(--ds-typography-fontFamily-mono)',
                        }}
                    >
                        {fileName && <span>{fileName}</span>}
                        {language && (
                            <span
                                style={{
                                    padding: '2px 6px',
                                    background:
                                        'var(--ds-color-background-inset)',
                                    border: '1px solid var(--ds-color-border-subtle)',
                                    borderRadius: 'var(--ds-radius-xs)',
                                    fontWeight: 600,
                                    fontSize: '10px',
                                }}
                            >
                                {language}
                            </span>
                        )}
                    </span>
                    {showCopy && (
                        <button
                            type="button"
                            onClick={onCopy}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                background: 'transparent',
                                color: copied
                                    ? 'var(--ds-color-state-success)'
                                    : 'var(--ds-color-foreground-secondary)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 600,
                                fontFamily: 'inherit',
                            }}
                        >
                            {copied && <IconCheck size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    )}
                </div>
            )}
            <pre
                style={{
                    margin: 0,
                    padding: '14px 16px',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: 'var(--ds-color-foreground-secondary)',
                    overflowX: 'auto',
                    maxHeight:
                        typeof maxHeight === 'number'
                            ? `${maxHeight}px`
                            : maxHeight,
                }}
            >
                {showLineNumbers ? (
                    <code>
                        {lines.map((line, i) => (
                            <div key={i} style={{ display: 'flex' }}>
                                <span
                                    aria-hidden
                                    style={{
                                        flex: '0 0 auto',
                                        width: `${lineNumberWidth}ch`,
                                        marginRight: '14px',
                                        color: 'var(--ds-color-foreground-muted)',
                                        userSelect: 'none',
                                        textAlign: 'right',
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <span style={{ flex: 1, whiteSpace: 'pre' }}>
                                    {line || ' '}
                                </span>
                            </div>
                        ))}
                    </code>
                ) : (
                    <code>{code}</code>
                )}
            </pre>
        </div>
    )
}
