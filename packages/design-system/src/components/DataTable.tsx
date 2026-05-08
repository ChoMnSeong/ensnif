import {
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from './Table.js'
import { Input } from './Input.js'
import { ComboBox, type ComboBoxOption } from './ComboBox.js'
import { Pagination } from './Pagination.js'
import { Empty } from './Empty.js'
import { Popover } from './Popover.js'
import { useOutsideClick } from './useOutsideClick.js'
import {
    IconChevronDown,
    IconChevronUp,
    IconClose,
    IconSearch,
} from './icons.js'
import { mergeStyles } from './types.js'

export type DataTableFilter =
    | { type: 'text'; placeholder?: string }
    | { type: 'select'; options: ComboBoxOption[]; placeholder?: string }

export type DataTableColumn<T> = {
    id: string
    header: ReactNode
    accessor: (row: T) => unknown
    cell?: (row: T) => ReactNode
    sortable?: boolean
    width?: string | number
    align?: 'left' | 'right' | 'center'
    filter?: DataTableFilter
}

export type DataTableProps<T> = {
    columns: DataTableColumn<T>[]
    data: T[]
    pageSize?: number
    showSearch?: boolean
    searchPlaceholder?: string
    searchKeys?: (keyof T | ((row: T) => string))[]
    emptyState?: ReactNode
    rowKey?: (row: T, idx: number) => string | number
    onRowClick?: (row: T) => void
    style?: CSSProperties
}

type SortState = { columnId: string; direction: 'asc' | 'desc' } | null

const compare = (a: unknown, b: unknown): number => {
    if (typeof a === 'number' && typeof b === 'number') return a - b
    const sa = String(a ?? '').toLowerCase()
    const sb = String(b ?? '').toLowerCase()
    return sa < sb ? -1 : sa > sb ? 1 : 0
}

const align = (a?: 'left' | 'right' | 'center'): CSSProperties =>
    a === 'right'
        ? { textAlign: 'right' }
        : a === 'center'
          ? { textAlign: 'center' }
          : { textAlign: 'left' }

const FilterIconSvg = ({ active }: { active: boolean }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        style={{ display: 'block' }}
    >
        <path
            d="M2 3 L14 3 L10 9 L10 13 L6 11 L6 9 Z"
            fill={active ? 'var(--ds-palette-primary-500)' : 'none'}
            stroke={
                active
                    ? 'var(--ds-palette-primary-500)'
                    : 'currentColor'
            }
            strokeWidth="1.4"
            strokeLinejoin="round"
        />
    </svg>
)

type FilterButtonProps = {
    columnId: string
    columnHeader: ReactNode
    filter: DataTableFilter
    value: string
    onChange: (v: string) => void
}

const FilterButton = ({
    columnId,
    columnHeader,
    filter,
    value,
    onChange,
}: FilterButtonProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick([popoverRef, triggerRef], () => setOpen(false), open)
    const active = !!value

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen((v) => !v)
                }}
                aria-label={`Filter ${columnId}`}
                data-ds-focusable=""
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    padding: 0,
                    background: active
                        ? 'color-mix(in srgb, var(--ds-palette-primary-500) 14%, transparent)'
                        : 'transparent',
                    color: active
                        ? 'var(--ds-palette-primary-500)'
                        : 'var(--ds-color-foreground-tertiary)',
                    border: 'none',
                    borderRadius: 'var(--ds-radius-sm)',
                    cursor: 'pointer',
                    flexShrink: 0,
                }}
            >
                <FilterIconSvg active={active} />
            </button>
            <Popover
                open={open}
                triggerRef={triggerRef}
                offset={6}
                minWidth={220}
                align="start"
            >
                <div
                    ref={popoverRef}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        padding: '10px',
                        background: 'var(--ds-surface-overlay-background)',
                        backdropFilter:
                            'var(--ds-surface-overlay-backdrop-filter)',
                        border: 'var(--ds-surface-overlay-border)',
                        borderRadius: 'var(--ds-surface-overlay-radius)',
                        boxShadow: 'var(--ds-surface-overlay-shadow)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        minWidth: '220px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--ds-color-foreground-tertiary)',
                        }}
                    >
                        {typeof columnHeader === 'string'
                            ? columnHeader
                            : columnId}{' '}
                        필터
                    </div>
                    {filter.type === 'select' ? (
                        <ComboBox
                            options={[
                                { value: '', label: '전체' },
                                ...filter.options,
                            ]}
                            value={value}
                            onChange={(v) => {
                                onChange(v)
                                setOpen(false)
                            }}
                            placeholder={filter.placeholder ?? '선택...'}
                            width="100%"
                        />
                    ) : (
                        <Input
                            placeholder={filter.placeholder ?? '값 입력...'}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                    )}
                    {active && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange('')
                                setOpen(false)
                            }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                padding: '6px 8px',
                                background: 'transparent',
                                color: 'var(--ds-color-foreground-secondary)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '11px',
                                fontWeight: 600,
                            }}
                        >
                            <IconClose size={12} /> 초기화
                        </button>
                    )}
                </div>
            </Popover>
        </>
    )
}

export function DataTable<T>({
    columns,
    data,
    pageSize = 10,
    showSearch = true,
    searchPlaceholder = '검색...',
    searchKeys,
    emptyState,
    rowKey,
    onRowClick,
    style,
}: DataTableProps<T>) {
    const [sort, setSort] = useState<SortState>(null)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        let out = data
        const q = search.trim().toLowerCase()
        if (q) {
            out = out.filter((row) => {
                if (searchKeys) {
                    return searchKeys.some((k) => {
                        const v =
                            typeof k === 'function'
                                ? k(row)
                                : (row as Record<string, unknown>)[k as string]
                        return String(v ?? '')
                            .toLowerCase()
                            .includes(q)
                    })
                }
                return columns.some((c) =>
                    String(c.accessor(row) ?? '')
                        .toLowerCase()
                        .includes(q),
                )
            })
        }
        for (const [colId, fv] of Object.entries(filters)) {
            if (!fv) continue
            const col = columns.find((c) => c.id === colId)
            if (!col) continue
            const lower = fv.toLowerCase()
            out = out.filter((row) =>
                String(col.accessor(row) ?? '')
                    .toLowerCase()
                    .includes(lower),
            )
        }
        if (sort) {
            const col = columns.find((c) => c.id === sort.columnId)
            if (col) {
                const dir = sort.direction === 'asc' ? 1 : -1
                out = [...out].sort(
                    (a, b) => compare(col.accessor(a), col.accessor(b)) * dir,
                )
            }
        }
        return out
    }, [data, columns, sort, search, filters, searchKeys])

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage = Math.min(page, pageCount)
    const start = (safePage - 1) * pageSize
    const pageRows = filtered.slice(start, start + pageSize)

    const onSort = (colId: string) => {
        setSort((prev) => {
            if (!prev || prev.columnId !== colId)
                return { columnId: colId, direction: 'asc' }
            if (prev.direction === 'asc')
                return { columnId: colId, direction: 'desc' }
            return null
        })
        setPage(1)
    }

    const onFilterChange = (colId: string, value: string) => {
        setFilters((prev) => ({ ...prev, [colId]: value }))
        setPage(1)
    }

    const activeFilterCount = Object.values(filters).filter(Boolean).length

    return (
        <div
            style={mergeStyles(
                {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '100%',
                },
                style,
            )}
        >
            {showSearch && (
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Input
                        prefix={<IconSearch size={14} />}
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        style={{ minWidth: '240px' }}
                    />
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={() => setFilters({})}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 10px',
                                background: 'transparent',
                                color: 'var(--ds-color-foreground-secondary)',
                                border: '1px solid var(--ds-color-border-subtle)',
                                borderRadius: 'var(--ds-radius-sm)',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '11px',
                                fontWeight: 600,
                            }}
                        >
                            <IconClose size={12} />
                            필터 {activeFilterCount}개 초기화
                        </button>
                    )}
                </div>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((c) => {
                            const isSorted = sort?.columnId === c.id
                            const dir = sort?.direction
                            const justify =
                                c.align === 'right'
                                    ? 'flex-end'
                                    : c.align === 'center'
                                      ? 'center'
                                      : 'flex-start'
                            return (
                                <TableHeaderCell
                                    key={c.id}
                                    style={{
                                        width:
                                            typeof c.width === 'number'
                                                ? `${c.width}px`
                                                : c.width,
                                        userSelect: 'none',
                                        ...align(c.align),
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            justifyContent: justify,
                                            width: '100%',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                cursor: c.sortable
                                                    ? 'pointer'
                                                    : 'default',
                                            }}
                                            onClick={
                                                c.sortable
                                                    ? () => onSort(c.id)
                                                    : undefined
                                            }
                                        >
                                            {c.header}
                                            {c.sortable && (
                                                <span
                                                    style={{
                                                        color: isSorted
                                                            ? 'var(--ds-color-foreground-primary)'
                                                            : 'var(--ds-color-foreground-muted)',
                                                        display: 'inline-flex',
                                                    }}
                                                >
                                                    {isSorted &&
                                                    dir === 'desc' ? (
                                                        <IconChevronDown size={12} />
                                                    ) : (
                                                        <IconChevronUp size={12} />
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                        {c.filter && (
                                            <FilterButton
                                                columnId={c.id}
                                                columnHeader={c.header}
                                                filter={c.filter}
                                                value={filters[c.id] ?? ''}
                                                onChange={(v) =>
                                                    onFilterChange(c.id, v)
                                                }
                                            />
                                        )}
                                    </span>
                                </TableHeaderCell>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pageRows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                style={{ padding: 0 }}
                            >
                                {emptyState ?? (
                                    <Empty
                                        title="결과 없음"
                                        description="검색·필터 조건을 변경해보세요."
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ) : (
                        pageRows.map((row, i) => (
                            <TableRow
                                key={rowKey ? rowKey(row, i) : i}
                                onClick={
                                    onRowClick
                                        ? () => onRowClick(row)
                                        : undefined
                                }
                                style={
                                    onRowClick
                                        ? { cursor: 'pointer' }
                                        : undefined
                                }
                            >
                                {columns.map((c) => (
                                    <TableCell
                                        key={c.id}
                                        style={align(c.align)}
                                    >
                                        {c.cell
                                            ? c.cell(row)
                                            : (c.accessor(row) as ReactNode)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {pageCount > 1 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span
                        style={{
                            fontSize: '12px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily:
                                'var(--ds-typography-fontFamily-mono)',
                        }}
                    >
                        {start + 1}-
                        {Math.min(start + pageSize, filtered.length)} /{' '}
                        {filtered.length}
                    </span>
                    <Pagination
                        page={safePage}
                        pageCount={pageCount}
                        onChange={setPage}
                    />
                </div>
            )}
        </div>
    )
}
