import { Breadcrumb } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const BreadcrumbPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Breadcrumb"
            description="계층 위치 표시. 마지막 항목은 자동으로 active 처리."
        />

        <ComponentPreview
            title="기본"
            code={`<Breadcrumb items={[
    { label: '홈', href: '/' },
    { label: '라이브러리', href: '/library' },
    { label: '원피스' },
]} />`}
        >
            <Breadcrumb
                items={[
                    { label: '홈', href: '/' },
                    { label: '라이브러리', href: '/library' },
                    { label: '액션', href: '/library/action' },
                    { label: '원피스' },
                ]}
            />
        </ComponentPreview>

        <ComponentPreview
            title="With onClick"
            code={`<Breadcrumb items={[
    { label: '홈', onClick: () => {} },
    { label: '설정', onClick: () => {} },
    { label: '계정' },
]} />`}
        >
            <Breadcrumb
                items={[
                    { label: '홈', onClick: () => alert('home') },
                    { label: '설정', onClick: () => alert('settings') },
                    { label: '계정' },
                ]}
            />
        </ComponentPreview>
    </>
)
