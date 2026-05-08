import { useState } from 'react'
import { Rating, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const RatingPage = () => {
    const [v, setV] = useState(3)
    const [half, setHalf] = useState(3.5)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Rating"
                description="별점 선택. primary 색 기본. max, size, allowHalf, readOnly, allowClear 옵션."
            />

            <ComponentPreview
                title="기본 (정수)"
                code={`<Rating value={v} onChange={setV} />`}
            >
                <Stack gap={6}>
                    <Rating value={v} onChange={setV} />
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        {v} / 5
                    </span>
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="0.5 단위 (allowHalf)"
                code={`<Rating value={half} onChange={setHalf} allowHalf />`}
            >
                <Stack gap={6}>
                    <Rating
                        value={half}
                        onChange={setHalf}
                        allowHalf
                        size="lg"
                    />
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        {half.toFixed(1)} / 5 — 별 좌측 클릭 = 0.5, 우측 = 1.0
                    </span>
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="Sizes"
                code={`<Rating defaultValue={4} size="sm" />
<Rating defaultValue={4} size="md" />
<Rating defaultValue={4} size="lg" />`}
            >
                <Stack gap={8}>
                    <Rating defaultValue={4} size="sm" />
                    <Rating defaultValue={4} size="md" />
                    <Rating defaultValue={4} size="lg" />
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="ReadOnly + 0.5"
                code={`<Rating value={4.5} readOnly allowHalf size="lg" />`}
            >
                <Rating value={4.5} readOnly allowHalf size="lg" />
            </ComponentPreview>
        </>
    )
}
