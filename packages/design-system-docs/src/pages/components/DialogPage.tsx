import { useState } from 'react'
import { Button, Dialog, DialogActions, Input, Label } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const DialogPage = () => {
    const [basicOpen, setBasicOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [formOpen, setFormOpen] = useState(false)

    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Dialog"
                description="Portal 기반 모달. ESC, 배경 클릭으로 닫힘. title / description / footer 슬롯."
            />

            <ComponentPreview
                title="기본"
                code={`<Dialog open={open} onClose={() => setOpen(false)} title="제목">
    내용
</Dialog>`}
            >
                <Button onClick={() => setBasicOpen(true)}>Open dialog</Button>
                <Dialog
                    open={basicOpen}
                    onClose={() => setBasicOpen(false)}
                    title="공지사항"
                    description="구독자 전용 콘텐츠가 추가되었습니다."
                >
                    이번 주 새로 공개된 에피소드를 확인하세요. 구독자에게 우선
                    시청 권한이 주어집니다.
                </Dialog>
            </ComponentPreview>

            <ComponentPreview
                title="확인 / 취소"
                code={`<Dialog
    open={open}
    onClose={() => setOpen(false)}
    title="정말 삭제하시겠습니까?"
    description="이 작업은 되돌릴 수 없습니다."
    footer={
        <DialogActions>
            <Button variant="ghost" onClick={() => setOpen(false)}>취소</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>삭제</Button>
        </DialogActions>
    }
/>`}
            >
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                    계정 삭제
                </Button>
                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title="정말 삭제하시겠습니까?"
                    description="이 작업은 되돌릴 수 없습니다."
                    footer={
                        <DialogActions>
                            <Button
                                variant="ghost"
                                onClick={() => setConfirmOpen(false)}
                            >
                                취소
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => setConfirmOpen(false)}
                            >
                                삭제
                            </Button>
                        </DialogActions>
                    }
                />
            </ComponentPreview>

            <ComponentPreview
                title="폼 다이얼로그"
                code={`<Dialog
    open={open}
    onClose={() => setOpen(false)}
    title="새 컬렉션"
    description="컬렉션 이름과 설명을 입력하세요."
    size="md"
    footer={
        <DialogActions>
            <Button variant="ghost" onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={() => setOpen(false)}>생성</Button>
        </DialogActions>
    }
>
    <Label required>이름</Label>
    <Input fullWidth placeholder="My favorites" />
</Dialog>`}
            >
                <Button onClick={() => setFormOpen(true)}>새 항목 추가</Button>
                <Dialog
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    title="새 컬렉션"
                    description="컬렉션 이름과 설명을 입력하세요."
                    size="md"
                    footer={
                        <DialogActions>
                            <Button
                                variant="ghost"
                                onClick={() => setFormOpen(false)}
                            >
                                취소
                            </Button>
                            <Button onClick={() => setFormOpen(false)}>
                                생성
                            </Button>
                        </DialogActions>
                    }
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                            }}
                        >
                            <Label required>이름</Label>
                            <Input fullWidth placeholder="My favorites" />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                            }}
                        >
                            <Label>설명</Label>
                            <Input fullWidth placeholder="짧은 설명" />
                        </div>
                    </div>
                </Dialog>
            </ComponentPreview>
        </>
    )
}
