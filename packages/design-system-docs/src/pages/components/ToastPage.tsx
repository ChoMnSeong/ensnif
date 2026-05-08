import { useState } from 'react'
import {
    Button,
    HStack,
    Stack,
    ToastProvider,
    Toggle,
    useToast,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

type Placement =
    | 'top-right'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center'

const ToastDemo = () => {
    const t = useToast()
    return (
        <Stack gap={10}>
            <HStack gap={6} wrap>
                <Button
                    variant="secondary"
                    onClick={() =>
                        t.info({
                            title: '새 시즌 공개',
                            description:
                                '구독자에게 우선 시청 권한이 부여됩니다.',
                        })
                    }
                >
                    Info
                </Button>
                <Button
                    variant="success"
                    onClick={() =>
                        t.success({
                            title: '저장 완료',
                            description: '프로필 변경 사항이 적용되었습니다.',
                        })
                    }
                >
                    Success
                </Button>
                <Button
                    variant="warning"
                    onClick={() =>
                        t.warning({
                            title: '구독 만료 임박',
                            description: '7일 후 자동 결제가 진행됩니다.',
                        })
                    }
                >
                    Warning
                </Button>
                <Button
                    variant="danger"
                    onClick={() =>
                        t.error({
                            title: '결제 실패',
                            description: '카드 정보를 다시 확인해주세요.',
                            action: {
                                label: '재시도',
                                onClick: () => console.log('retry'),
                            },
                        })
                    }
                >
                    Error
                </Button>
                <Button
                    onClick={() => {
                        t.success({ title: 'Toast 1' })
                        setTimeout(() => t.info({ title: 'Toast 2' }), 200)
                        setTimeout(
                            () => t.warning({ title: 'Toast 3' }),
                            400,
                        )
                        setTimeout(
                            () =>
                                t.error({
                                    title: 'Toast 4',
                                    description:
                                        'hover 하면 펼쳐서 보입니다',
                                }),
                            600,
                        )
                    }}
                >
                    여러 개 한번에
                </Button>
            </HStack>
            <span
                style={{
                    fontSize: '11px',
                    color: 'var(--ds-color-foreground-tertiary)',
                }}
            >
                💡 토스트 더미에 마우스를 올리면 스택이 펼쳐집니다
            </span>
        </Stack>
    )
}

const PLACEMENTS: Placement[] = [
    'top-right',
    'top-center',
    'bottom-right',
    'bottom-center',
]

export const ToastPage = () => {
    const [placement, setPlacement] = useState<Placement>('bottom-right')

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Toast"
                description="ToastProvider + useToast(). 4가지 placement, 최대 4개까지 스택 표시 + hover 펼침."
            />

            <ComponentPreview
                title="Placement"
                code={`<ToastProvider placement="${placement}">...</ToastProvider>`}
            >
                <HStack gap={6} wrap>
                    {PLACEMENTS.map((p) => (
                        <Toggle
                            key={p}
                            pressed={placement === p}
                            onPressedChange={() => setPlacement(p)}
                            size="sm"
                        >
                            {p}
                        </Toggle>
                    ))}
                </HStack>
            </ComponentPreview>

            <ComponentPreview
                title="Demo"
                code={`const t = useToast()
t.success({ title: '저장 완료', description: '...' })
t.error({ title: '결제 실패', action: { label: '재시도', onClick: fn } })`}
            >
                <ToastProvider key={placement} placement={placement}>
                    <ToastDemo />
                </ToastProvider>
            </ComponentPreview>
        </>
    )
}
