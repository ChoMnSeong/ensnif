import { Input, Label } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const LabelPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Label"
            description="폼 입력 위에 표시하는 라벨. required 옵션으로 별표 표시."
        />

        <ComponentPreview
            title="기본"
            code={`<Label htmlFor="email">이메일</Label>
<Input id="email" />`}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                }}
            >
                <Label htmlFor="email">이메일</Label>
                <Input id="email" placeholder="user@example.com" />
            </div>
        </ComponentPreview>

        <ComponentPreview
            title="Required"
            code={`<Label htmlFor="pwd" required>비밀번호</Label>
<Input id="pwd" type="password" />`}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                }}
            >
                <Label htmlFor="pwd" required>
                    비밀번호
                </Label>
                <Input id="pwd" type="password" />
            </div>
        </ComponentPreview>
    </>
)
