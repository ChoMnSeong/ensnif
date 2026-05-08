import { Alert } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const AlertPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Alert"
            description="상태 메시지 박스. tone(info/success/warning/danger), title + description, 닫기 버튼 옵션."
        />

        <ComponentPreview
            title="Tones"
            code={`<Alert tone="info" title="알림">메시지 내용</Alert>`}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '100%',
                    maxWidth: '480px',
                }}
            >
                <Alert tone="info" title="새 시즌이 공개되었습니다">
                    구독자에게 우선 시청 권한이 부여됩니다.
                </Alert>
                <Alert tone="success" title="저장되었습니다">
                    프로필 변경 사항이 적용되었습니다.
                </Alert>
                <Alert tone="warning" title="구독이 곧 만료됩니다">
                    7일 후 자동 결제가 진행됩니다.
                </Alert>
                <Alert tone="danger" title="결제에 실패했습니다">
                    카드 정보를 다시 확인해주세요.
                </Alert>
            </div>
        </ComponentPreview>

        <ComponentPreview
            title="Closable"
            code={`<Alert tone="info" title="제목" onClose={() => {}}>
    내용
</Alert>`}
        >
            <Alert
                tone="info"
                title="새 업데이트"
                onClose={() => alert('닫혔습니다')}
                style={{ width: '100%', maxWidth: '480px' }}
            >
                v0.2.0이 배포되었습니다. 변경사항을 확인하세요.
            </Alert>
        </ComponentPreview>
    </>
)
