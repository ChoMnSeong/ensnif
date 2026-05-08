import { useState } from 'react'
import { Button, HStack, Stack, Stepper } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const steps = [
    { label: '계정 생성', description: '이메일·비밀번호' },
    { label: '프로필', description: '이름·관심사' },
    { label: '결제 수단', description: '카드 등록' },
    { label: '완료' },
]

export const StepperPage = () => {
    const [step, setStep] = useState(1)
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Stepper"
                description="다단계 진행 표시. horizontal/vertical."
            />

            <ComponentPreview
                title="Horizontal"
                code={`<Stepper steps={steps} current={step} />`}
            >
                <Stack gap={20} style={{ width: '100%', maxWidth: '600px' }}>
                    <Stepper steps={steps} current={step} />
                    <HStack gap={8} justify="center">
                        <Button
                            variant="secondary"
                            disabled={step <= 0}
                            onClick={() => setStep((s) => s - 1)}
                        >
                            이전
                        </Button>
                        <Button
                            disabled={step >= steps.length - 1}
                            onClick={() => setStep((s) => s + 1)}
                        >
                            다음
                        </Button>
                    </HStack>
                </Stack>
            </ComponentPreview>

            <ComponentPreview
                title="Vertical"
                code={`<Stepper steps={steps} current={2} direction="vertical" />`}
            >
                <div style={{ width: '100%', maxWidth: '320px' }}>
                    <Stepper steps={steps} current={2} direction="vertical" />
                </div>
            </ComponentPreview>
        </>
    )
}
