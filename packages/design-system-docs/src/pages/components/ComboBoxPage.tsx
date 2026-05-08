import { useState } from 'react'
import { ComboBox, Label } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const genres = [
    { value: 'action', label: '액션', description: '빠른 전개의 전투 중심' },
    { value: 'romance', label: '로맨스', description: '관계와 감정 중심' },
    { value: 'fantasy', label: '판타지', description: '이세계, 마법 등' },
    { value: 'sf', label: 'SF', description: '미래·우주·기술' },
    { value: 'slice', label: '일상', description: '잔잔한 일상' },
    { value: 'sports', label: '스포츠' },
    { value: 'mystery', label: '미스터리' },
    { value: 'horror', label: '호러', disabled: true },
]

export const ComboBoxPage = () => {
    const [value, setValue] = useState<string | undefined>(undefined)

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="ComboBox"
                description="검색 가능한 드롭다운 셀렉트. 키보드 네비게이션 (↑↓ Enter Esc) 지원."
            />

            <ComponentPreview
                title="기본"
                code={`<ComboBox options={options} value={value} onChange={setValue} placeholder="장르 선택" />`}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <Label>관심 장르</Label>
                    <ComboBox
                        options={genres}
                        value={value}
                        onChange={setValue}
                        placeholder="장르 선택..."
                        width={260}
                    />
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        선택된 값: {value ?? '(없음)'}
                    </span>
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="기본값"
                code={`<ComboBox options={genres} defaultValue="fantasy" width={260} />`}
            >
                <ComboBox
                    options={genres}
                    defaultValue="fantasy"
                    width={260}
                />
            </ComponentPreview>

            <ComponentPreview
                title="Disabled"
                code={`<ComboBox options={genres} defaultValue="action" disabled width={260} />`}
            >
                <ComboBox
                    options={genres}
                    defaultValue="action"
                    disabled
                    width={260}
                />
            </ComponentPreview>
        </>
    )
}
