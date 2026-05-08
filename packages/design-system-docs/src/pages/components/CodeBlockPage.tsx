import { CodeBlock } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const sample = `import { Button, useToast } from '@ensnif/design-system'

function App() {
    const t = useToast()
    return (
        <Button onClick={() => t.success({ title: '저장됨' })}>
            저장
        </Button>
    )
}`

export const CodeBlockPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="CodeBlock"
            description="코드 표시. 파일명/언어 라벨, 복사 버튼, 줄 번호 옵션."
        />

        <ComponentPreview
            title="기본"
            code={sample}
        >
            <CodeBlock
                code={sample}
                language="tsx"
                fileName="App.tsx"
                style={{ width: '100%' }}
            />
        </ComponentPreview>

        <ComponentPreview
            title="줄 번호"
            code={`<CodeBlock code={sample} language="tsx" showLineNumbers />`}
        >
            <CodeBlock
                code={sample}
                language="tsx"
                showLineNumbers
                style={{ width: '100%' }}
            />
        </ComponentPreview>

        <ComponentPreview
            title="명령어 한 줄"
            code={`<CodeBlock
    code="pnpm add @ensnif/design-system"
    language="bash"
/>`}
        >
            <CodeBlock
                code="pnpm add @ensnif/design-system"
                language="bash"
                style={{ width: '100%' }}
            />
        </ComponentPreview>
    </>
)
