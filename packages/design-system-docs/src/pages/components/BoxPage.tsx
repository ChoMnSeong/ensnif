import { Box } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const BoxPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Box"
            description="Surface 토큰을 적용한 단순 div. 'page' | 'panel' | 'card' | 'overlay' | 'inset' | 'none' 중 선택."
        />

        <ComponentPreview
            title="Surface 종류"
            code={`<Box surface="card" padding={20}>card</Box>`}
        >
            {(['panel', 'card', 'overlay', 'inset'] as const).map((s) => (
                <Box
                    key={s}
                    surface={s}
                    padding={18}
                    style={{ minWidth: '140px', textAlign: 'center' }}
                >
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>
                        surface.{s}
                    </div>
                </Box>
            ))}
        </ComponentPreview>

        <ComponentPreview
            title="라운드 / 패딩 오버라이드"
            code={`<Box surface="card" padding="32px" radius="32px">
    내용
</Box>`}
        >
            <Box
                surface="card"
                padding="32px"
                radius="32px"
                style={{ textAlign: 'center' }}
            >
                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                    radius=32px, padding=32px
                </div>
            </Box>
        </ComponentPreview>
    </>
)
