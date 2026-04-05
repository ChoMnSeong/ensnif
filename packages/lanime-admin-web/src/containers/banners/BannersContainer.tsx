import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Badge } from '@components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@components/ui/table'
import { useAdBanners, useCreateAdBanner, useUpdateAdBanner, useDeleteAdBanner } from '@libs/apis/admin'
import type { IAdBanner, IBannerCreateRequest } from '@libs/apis/admin/type'

const EMPTY_FORM: IBannerCreateRequest = {
    title: '',
    imageUrl: '',
    logoImageUrl: '',
    startAt: '',
    endAt: '',
    isActive: true,
}

function toDatetimeLocal(iso: string | null | undefined): string {
    if (!iso) return ''
    return iso.slice(0, 16)
}

function toISOString(datetimeLocal: string): string | undefined {
    if (!datetimeLocal) return undefined
    return new Date(datetimeLocal).toISOString().slice(0, 19)
}

export default function BannersContainer() {
    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<IAdBanner | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<IAdBanner | null>(null)
    const [form, setForm] = useState<IBannerCreateRequest>(EMPTY_FORM)
    const [error, setError] = useState('')

    const { data: banners = [], isLoading } = useAdBanners()
    const createMutation = useCreateAdBanner()
    const updateMutation = useUpdateAdBanner()
    const deleteMutation = useDeleteAdBanner()

    const openCreate = () => {
        setForm(EMPTY_FORM)
        setError('')
        setCreateOpen(true)
    }

    const openEdit = (banner: IAdBanner) => {
        setForm({
            title: banner.title,
            imageUrl: banner.imageUrl,
            logoImageUrl: banner.logoImageUrl ?? '',
            startAt: toDatetimeLocal(banner.startAt),
            endAt: toDatetimeLocal(banner.endAt),
            isActive: banner.isActive,
        })
        setError('')
        setEditTarget(banner)
    }

    const handleField = (key: keyof IBannerCreateRequest, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const buildPayload = () => ({
        title: form.title,
        imageUrl: form.imageUrl,
        logoImageUrl: form.logoImageUrl || undefined,
        startAt: toISOString(form.startAt as string),
        endAt: toISOString(form.endAt as string),
        isActive: form.isActive,
    })

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        createMutation.mutate(buildPayload(), {
            onSuccess: () => {
                setCreateOpen(false)
            },
            onError: () => {
                setError('배너 생성에 실패했습니다.')
            },
        })
    }

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editTarget) return
        setError('')
        updateMutation.mutate(
            { id: editTarget.adBannerId, data: buildPayload() },
            {
                onSuccess: () => {
                    setEditTarget(null)
                },
                onError: () => {
                    setError('배너 수정에 실패했습니다.')
                },
            },
        )
    }

    const formatDate = (iso: string | null) => {
        if (!iso) return '-'
        return new Date(iso).toLocaleDateString('ko-KR')
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">광고 배너</h1>
                    <p className="text-muted-foreground">광고 배너를 추가, 수정, 삭제합니다.</p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    배너 추가
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>제목</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>시작일</TableHead>
                            <TableHead>종료일</TableHead>
                            <TableHead className="text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    불러오는 중...
                                </TableCell>
                            </TableRow>
                        ) : banners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    등록된 배너가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            banners.map((banner) => (
                                <TableRow key={banner.adBannerId}>
                                    <TableCell className="font-medium">{banner.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                                            {banner.isActive ? '활성' : '비활성'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(banner.startAt)}</TableCell>
                                    <TableCell>{formatDate(banner.endAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(banner)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteTarget(banner)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create / Edit Dialog */}
            {[
                { open: createOpen, onOpenChange: setCreateOpen, title: '배너 추가', onSubmit: handleCreate, isPending: createMutation.isPending, submitLabel: '추가' },
                { open: !!editTarget, onOpenChange: (v: boolean) => { if (!v) setEditTarget(null) }, title: '배너 수정', onSubmit: handleEdit, isPending: updateMutation.isPending, submitLabel: '저장' },
            ].map(({ open, onOpenChange, title, onSubmit, isPending, submitLabel }) => (
                <Dialog key={title} open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={onSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>제목 *</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => handleField('title', e.target.value)}
                                    placeholder="배너 제목"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>이미지 URL *</Label>
                                <Input
                                    value={form.imageUrl}
                                    onChange={(e) => handleField('imageUrl', e.target.value)}
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>로고 이미지 URL</Label>
                                <Input
                                    value={form.logoImageUrl as string}
                                    onChange={(e) => handleField('logoImageUrl', e.target.value)}
                                    placeholder="https://... (선택)"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <Label>시작일시</Label>
                                    <Input
                                        type="datetime-local"
                                        value={form.startAt as string}
                                        onChange={(e) => handleField('startAt', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label>종료일시</Label>
                                    <Input
                                        type="datetime-local"
                                        value={form.endAt as string}
                                        onChange={(e) => handleField('endAt', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id={`isActive-${title}`}
                                    type="checkbox"
                                    checked={form.isActive as boolean}
                                    onChange={(e) => handleField('isActive', e.target.checked)}
                                    className="h-4 w-4 rounded border"
                                />
                                <Label htmlFor={`isActive-${title}`}>활성화</Label>
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    취소
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? '처리 중...' : submitLabel}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            ))}

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>배너 삭제</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{deleteTarget?.title}</span> 배너를
                        삭제합니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            취소
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() =>
                                deleteTarget &&
                                deleteMutation.mutate(deleteTarget.adBannerId, {
                                    onSuccess: () => setDeleteTarget(null),
                                })
                            }
                        >
                            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
