import {
    useCallback,
    useRef,
    useState,
    type CSSProperties,
    type DragEvent,
    type ReactNode,
} from 'react'
import { mergeStyles } from './types.js'
import { IconClose, IconPlus } from './icons.js'

export type FileUploadProps = {
    value?: File[]
    defaultValue?: File[]
    onChange?: (files: File[]) => void
    accept?: string
    multiple?: boolean
    maxSize?: number
    disabled?: boolean
    placeholder?: ReactNode
    description?: ReactNode
    style?: CSSProperties
}

const formatBytes = (n: number): string => {
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
    return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export const FileUpload = ({
    value: controlled,
    defaultValue = [],
    onChange,
    accept,
    multiple,
    maxSize,
    disabled,
    placeholder = '파일을 끌어다 놓거나 클릭해서 선택하세요',
    description,
    style,
}: FileUploadProps) => {
    const [internal, setInternal] = useState<File[]>(defaultValue)
    const files = controlled ?? internal
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const update = useCallback(
        (next: File[]) => {
            const filtered = maxSize
                ? next.filter((f) => f.size <= maxSize)
                : next
            if (controlled === undefined) setInternal(filtered)
            onChange?.(filtered)
        },
        [controlled, onChange, maxSize],
    )

    const onPick = (incoming: FileList | null) => {
        if (!incoming) return
        const arr = Array.from(incoming)
        update(multiple ? [...files, ...arr] : arr.slice(0, 1))
    }

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
        if (disabled) return
        onPick(e.dataTransfer.files)
    }

    const removeAt = (idx: number) => {
        update(files.filter((_, i) => i !== idx))
    }

    return (
        <div style={mergeStyles({ width: '100%' }, style)}>
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault()
                    if (!disabled) setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '24px 16px',
                    minHeight: '120px',
                    background: dragOver
                        ? 'var(--ds-color-background-inset)'
                        : 'var(--ds-surface-inset-background)',
                    border: dragOver
                        ? '2px dashed var(--ds-color-accent-background)'
                        : '2px dashed var(--ds-color-border-subtle)',
                    borderRadius: 'var(--ds-radius-md)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 120ms ease',
                    color: 'var(--ds-color-foreground-secondary)',
                    textAlign: 'center',
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--ds-color-background-inset)',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ds-color-foreground-tertiary)',
                    }}
                >
                    <IconPlus size={16} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                    {placeholder}
                </div>
                {description && (
                    <div
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                        }}
                    >
                        {description}
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(e) => onPick(e.target.files)}
                    style={{ display: 'none' }}
                />
            </div>

            {files.length > 0 && (
                <ul
                    style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '12px 0 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    {files.map((f, idx) => (
                        <li
                            key={`${f.name}-${idx}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                padding: '8px 12px',
                                background:
                                    'var(--ds-color-background-inset)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                fontSize: '12px',
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: 'var(--ds-color-foreground-primary)',
                                }}
                            >
                                {f.name}
                            </div>
                            <span
                                style={{
                                    fontFamily:
                                        'var(--ds-typography-fontFamily-mono)',
                                    color: 'var(--ds-color-foreground-tertiary)',
                                    fontSize: '11px',
                                }}
                            >
                                {formatBytes(f.size)}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeAt(idx)
                                }}
                                aria-label="Remove"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--ds-color-foreground-tertiary)',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <IconClose size={14} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
