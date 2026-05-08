import { useState } from 'react'
import { Label, OTPInput, Stack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const OTPInputPage = () => {
    const [code, setCode] = useState('')
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="OTPInput"
                description="N자리 인증번호 입력. 자동 포커스 이동, 붙여넣기 지원, 백스페이스 이전 칸 이동."
            />

            <ComponentPreview
                title="6자리"
                code={`<OTPInput length={6} value={code} onChange={setCode} />`}
            >
                <Stack gap={6}>
                    <Label>인증번호</Label>
                    <OTPInput
                        length={6}
                        value={code}
                        onChange={setCode}
                        autoFocus
                    />
                    <span
                        style={{
                            fontSize: '11px',
                            color: 'var(--ds-color-foreground-tertiary)',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}
                    >
                        {code || '(미입력)'}
                    </span>
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="4자리 영숫자"
                code={`<OTPInput length={4} type="alphanumeric" />`}
            >
                <OTPInput length={4} type="alphanumeric" />
            </ComponentPreview>
        </>
    )
}
