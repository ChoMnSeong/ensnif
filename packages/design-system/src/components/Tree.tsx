import { useState, type CSSProperties, type ReactNode } from 'react'
import { mergeStyles } from './types.js'
import { IconChevronRight } from './icons.js'

export type TreeNode = {
    id: string
    label: ReactNode
    icon?: ReactNode
    children?: TreeNode[]
}

export type TreeProps = {
    data: TreeNode[]
    defaultExpanded?: string[]
    selectedId?: string
    onSelect?: (id: string) => void
    style?: CSSProperties
}

export const Tree = ({
    data,
    defaultExpanded = [],
    selectedId,
    onSelect,
    style,
}: TreeProps) => {
    const [expanded, setExpanded] = useState<Set<string>>(
        () => new Set(defaultExpanded),
    )

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <div
            role="tree"
            style={mergeStyles(
                {
                    fontSize: '13px',
                    color: 'var(--ds-color-foreground-primary)',
                    fontFamily: 'inherit',
                },
                style,
            )}
        >
            {data.map((node) => (
                <TreeItem
                    key={node.id}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    onToggle={toggle}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}

const TreeItem = ({
    node,
    depth,
    expanded,
    onToggle,
    selectedId,
    onSelect,
}: {
    node: TreeNode
    depth: number
    expanded: Set<string>
    onToggle: (id: string) => void
    selectedId?: string
    onSelect?: (id: string) => void
}) => {
    const isOpen = expanded.has(node.id)
    const isSelected = selectedId === node.id
    const hasChildren = !!node.children && node.children.length > 0
    return (
        <div role="treeitem" aria-expanded={hasChildren ? isOpen : undefined}>
            <div
                onClick={() => {
                    if (hasChildren) onToggle(node.id)
                    onSelect?.(node.id)
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    paddingLeft: `${8 + depth * 16}px`,
                    borderRadius: 'var(--ds-radius-sm)',
                    cursor: 'pointer',
                    background: isSelected
                        ? 'var(--ds-color-background-inset)'
                        : 'transparent',
                    color: isSelected
                        ? 'var(--ds-color-foreground-primary)'
                        : 'var(--ds-color-foreground-secondary)',
                    fontWeight: isSelected ? 600 : 500,
                    transition: 'background 80ms ease',
                }}
            >
                <span
                    style={{
                        width: '16px',
                        height: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        opacity: hasChildren ? 1 : 0,
                        transform: isOpen ? 'rotate(90deg)' : 'none',
                        transition: 'transform 120ms ease',
                        color: 'var(--ds-color-foreground-tertiary)',
                    }}
                >
                    <IconChevronRight size={14} />
                </span>
                {node.icon && (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'var(--ds-color-foreground-tertiary)',
                            flexShrink: 0,
                        }}
                    >
                        {node.icon}
                    </span>
                )}
                <span style={{ flex: 1, minWidth: 0 }}>{node.label}</span>
            </div>
            {hasChildren && isOpen && (
                <div role="group">
                    {node.children!.map((child) => (
                        <TreeItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            expanded={expanded}
                            onToggle={onToggle}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
