import { useState } from 'react'
import { Button, Drawer, HStack } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

type Side = 'right' | 'left' | 'top' | 'bottom'

export const DrawerPage = () => {
    const [side, setSide] = useState<Side | null>(null)

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Drawer"
                description="화면 가장자리에서 슬라이드되는 패널. side(right/left/top/bottom), title/description/footer."
            />

            <ComponentPreview
                title="네 방향"
                code={`<Drawer open={open} onClose={...} side="right" title="..." />`}
            >
                <HStack gap={8} wrap>
                    <Button onClick={() => setSide('right')}>Right</Button>
                    <Button
                        variant="secondary"
                        onClick={() => setSide('left')}
                    >
                        Left
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setSide('top')}
                    >
                        Top
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setSide('bottom')}
                    >
                        Bottom
                    </Button>
                </HStack>
            </ComponentPreview>

            <Drawer
                open={side !== null}
                onClose={() => setSide(null)}
                side={side ?? 'right'}
                title="Drawer 예시"
                description={`현재 side: ${side ?? 'right'}`}
                footer={
                    <Button onClick={() => setSide(null)}>닫기</Button>
                }
            >
                <p
                    style={{
                        fontSize: '13px',
                        color: 'var(--ds-color-foreground-secondary)',
                        lineHeight: 1.6,
                    }}
                >
                    Drawer는 Dialog와 비슷하지만 화면 가장자리에 고정됩니다.
                    설정, 필터, 상세 정보 표시에 적합합니다.
                </p>
            </Drawer>
        </>
    )
}
