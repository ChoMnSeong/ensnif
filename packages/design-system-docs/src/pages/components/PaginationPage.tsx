import { useState } from 'react'
import { Pagination, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const PaginationPage = () => {
    const [page, setPage] = useState(3)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Pagination"
                description="페이지 네비게이션. page/pageCount, siblings(±N), 자동 ellipsis."
            />

            <ComponentPreview
                title="기본"
                code={`<Pagination page={page} pageCount={20} onChange={setPage} />`}
            >
                <Stack gap={12} align="center">
                    <Pagination
                        page={page}
                        pageCount={20}
                        onChange={setPage}
                    />
                    <span
                        style={{
                            fontSize: '12px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        page = {page}
                    </span>
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="작은 사이즈 (페이지 적음)"
                code={`<Pagination page={2} pageCount={5} onChange={fn} />`}
            >
                <Pagination page={2} pageCount={5} onChange={() => {}} />
            </ComponentPreview>
        </>
    )
}
