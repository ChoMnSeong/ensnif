import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Upload, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    getEpisodes,
    createEpisode,
    updateEpisode,
    deleteEpisode,
    uploadEpisodeVideo,
    getEncodingStatus,
    type IAdminEpisode,
    type IEpisodeCreateRequest,
} from '@/libs/apis/admin'

const defaultForm: IEpisodeCreateRequest = {
    episodeNumber: 1,
    title: '',
    thumbnailUrl: '',
    description: '',
    duration: 0,
}

function EncodingStatus({ episodeId }: { episodeId: string }) {
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['admin', 'encoding', episodeId],
        queryFn: () => getEncodingStatus(episodeId),
        refetchInterval: (query) => {
            const status = query.state.data?.status
            return status === 'ENCODING' || status === 'PENDING' ? 3000 : false
        },
        retry: false,
    })

    if (!data) return <Badge variant="secondary">미업로드</Badge>

    switch (data.status) {
        case 'PENDING':
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>
        case 'ENCODING':
            return (
                <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none">
                        인코딩중 {data.progress !== null ? `${data.progress}%` : ''}
                    </Badge>
                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                </div>
            )
        case 'COMPLETED':
            return <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">완료</Badge>
        case 'FAILED':
            return (
                <div className="flex items-center gap-1">
                    <Badge variant="destructive">실패</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            )
        default:
            return <Badge variant="secondary">알 수 없음</Badge>
    }
}

export default function EpisodesPage() {
    const { animationId } = useParams<{ animationId: string }>()
    const qc = useQueryClient()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<IAdminEpisode | null>(null)
    const [uploadTarget, setUploadTarget] = useState<IAdminEpisode | null>(null)
    const [editing, setEditing] = useState<IAdminEpisode | null>(null)
    const [form, setForm] = useState<IEpisodeCreateRequest>(defaultForm)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const queryKey = ['admin', 'episodes', animationId]

    const { data: episodes = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => getEpisodes(animationId!),
        enabled: !!animationId,
    })

    const createMutation = useMutation({
        mutationFn: (data: IEpisodeCreateRequest) => createEpisode(animationId!, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey })
            setDialogOpen(false)
            setForm(defaultForm)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IEpisodeCreateRequest> }) =>
            updateEpisode(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey })
            setDialogOpen(false)
            setEditing(null)
            setForm(defaultForm)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteEpisode,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey })
            setDeleteTarget(null)
        },
    })

    const handleUpload = async (episodeId: string, file: File) => {
        setUploading(true)
        setUploadProgress(0)
        try {
            // New API: Upload starts encoding automatically
            await uploadEpisodeVideo(episodeId, file, (pct) => setUploadProgress(pct))
            
            qc.invalidateQueries({ queryKey: ['admin', 'encoding', episodeId] })
            qc.invalidateQueries({ queryKey })
        } catch (error) {
            console.error('Upload failed:', error)
            alert('업로드에 실패했습니다. (MP4 형식을 확인해주세요)')
        } finally {
            setUploading(false)
            setUploadTarget(null)
        }
    }

    const openCreate = () => {
        setEditing(null)
        setForm({ ...defaultForm, episodeNumber: episodes.length + 1 })
        setDialogOpen(true)
    }

    const openEdit = (ep: IAdminEpisode) => {
        setEditing(ep)
        setForm({
            episodeNumber: ep.episodeNumber,
            title: ep.title,
            thumbnailUrl: ep.thumbnailUrl,
            description: ep.description,
            duration: ep.duration,
        })
        setDialogOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editing) {
            updateMutation.mutate({ id: editing.episodeId, data: form })
        } else {
            createMutation.mutate(form)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && uploadTarget) {
            handleUpload(uploadTarget.episodeId, file)
        }
        e.target.value = ''
    }

    const isSaving = createMutation.isPending || updateMutation.isPending

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/animations">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">에피소드 관리</h1>
                    <p className="text-muted-foreground">에피소드를 추가하고 영상을 업로드합니다.</p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    에피소드 추가
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">화수</TableHead>
                            <TableHead>제목</TableHead>
                            <TableHead>재생시간</TableHead>
                            <TableHead>영상 상태</TableHead>
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
                        ) : episodes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    에피소드가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            episodes.map((ep) => (
                                <TableRow key={ep.episodeId}>
                                    <TableCell className="font-medium">{ep.episodeNumber}화</TableCell>
                                    <TableCell>{ep.title}</TableCell>
                                    <TableCell>
                                        {ep.duration
                                            ? `${Math.floor(ep.duration / 60)}분 ${ep.duration % 60}초`
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <EncodingStatus episodeId={ep.episodeId} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setUploadTarget(ep)
                                                    fileInputRef.current?.click()
                                                }}
                                                disabled={uploading}
                                            >
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(ep)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteTarget(ep)}
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

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Upload progress dialog */}
            <Dialog open={uploading} onOpenChange={() => {}}>
                <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>영상 업로드 중</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            {uploadProgress === 100 ? '서버 처리 중...' : `${uploadProgress}%`}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editing ? '에피소드 수정' : '에피소드 추가'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label>화수</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={form.episodeNumber}
                                    onChange={(e) =>
                                        setForm({ ...form, episodeNumber: Number(e.target.value) })
                                    }
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>재생시간 (초)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.duration}
                                    onChange={(e) =>
                                        setForm({ ...form, duration: Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>제목</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="에피소드 제목"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>썸네일 URL</Label>
                            <Input
                                value={form.thumbnailUrl}
                                onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>설명</Label>
                            <Input
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="에피소드 설명"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? '저장 중...' : '저장'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>에피소드 삭제</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{deleteTarget?.title}</span>을(를) 삭제합니다.
                        영상도 함께 삭제됩니다.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            취소
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.episodeId)}
                        >
                            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
