import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Video, ChevronRight, Settings2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import {
    getAnimations,
    getAnimationDetail,
    createAnimation,
    updateAnimation,
    deleteAnimation,
    getAnimationTypes,
    getAnimationGenres,
    createAnimationType,
    createAnimationGenre,
    type IAdminAnimation,
    type IAnimationCreateRequest,
} from '@/libs/apis/admin'

const STATUS_MAP: Record<string, string> = {
    airing: '방영중',
    finished: '완결',
    upcoming: '방영예정',
}

const RATING_MAP: Record<string, string> = {
    ALL: '전체',
    '12': '12세',
    '15': '15세',
    '19': '19세',
}

const AIR_DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]
const AIR_DAY_LABELS: Record<string, string> = {
    Monday: '월',
    Tuesday: '화',
    Wednesday: '수',
    Thursday: '목',
    Friday: '금',
    Saturday: '토',
    Sunday: '일',
}

const defaultForm: IAnimationCreateRequest = {
    typeId: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    rating: 'ALL',
    status: 'airing',
    airDay: '',
    releasedAt: '',
    genreIds: [],
}

export default function AnimationsPage() {
    const qc = useQueryClient()
    const [search, setSearch] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [metaDialogOpen, setMetaDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<IAdminAnimation | null>(null)
    const [editing, setEditing] = useState<IAdminAnimation | null>(null)
    const [form, setForm] = useState<IAnimationCreateRequest>(defaultForm)
    const [isFetchingDetail, setIsFetchingDetail] = useState(false)
    
    const [newTypeName, setNewTypeName] = useState('')
    const [newGenreName, setNewGenreName] = useState('')

    const { data: animations = [], isLoading } = useQuery({
        queryKey: ['admin', 'animations'],
        queryFn: getAnimations,
    })

    const { data: types = [] } = useQuery({
        queryKey: ['admin', 'types'],
        queryFn: getAnimationTypes,
    })

    const { data: genres = [] } = useQuery({
        queryKey: ['admin', 'genres'],
        queryFn: getAnimationGenres,
    })

    // types가 로드되었을 때 typeId가 비어있다면 첫 번째 값으로 설정
    useEffect(() => {
        if (!editing && !form.typeId && types.length > 0) {
            setForm(prev => ({ ...prev, typeId: types[0].typeId }))
        }
    }, [types, editing, form.typeId])

    const createMutation = useMutation({
        mutationFn: createAnimation,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'animations'] })
            setDialogOpen(false)
            setForm(defaultForm)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IAnimationCreateRequest> }) =>
            updateAnimation(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'animations'] })
            setDialogOpen(false)
            setEditing(null)
            setForm(defaultForm)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteAnimation,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'animations'] })
            setDeleteTarget(null)
        },
    })

    const createTypeMutation = useMutation({
        mutationFn: createAnimationType,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'types'] })
            setNewTypeName('')
        }
    })

    const createGenreMutation = useMutation({
        mutationFn: createAnimationGenre,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'genres'] })
            setNewGenreName('')
        }
    })

    const filtered = animations.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))

    const openCreate = () => {
        setEditing(null)
        setForm({ ...defaultForm, typeId: types[0]?.typeId ?? '' })
        setDialogOpen(true)
    }

    const openEdit = async (anim: IAdminAnimation) => {
        setEditing(anim)
        setIsFetchingDetail(true)
        setDialogOpen(true)
        try {
            const detail = await getAnimationDetail(anim.id)
            
            // 장르 이름(string[])을 장르 ID(UUID) 배열로 변환
            const mappedGenreIds = detail.genres?.map(genreName => 
                genres.find(g => g.name === genreName)?.genreId
            ).filter(Boolean) as string[] || []

            setForm({
                typeId: types.find(t => t.name === (detail.type || anim.type))?.typeId ?? '',
                title: detail.title || anim.title,
                description: detail.description || '',
                thumbnailUrl: detail.thumbnailUrl || anim.thumbnailUrl,
                rating: detail.rating || detail.ageRating || anim.ageRating || 'ALL',
                status: detail.status || anim.status,
                airDay: detail.airDay || anim.airDay || '',
                releasedAt: (detail.releasedAt || anim.releasedAt || '').split('T')[0],
                genreIds: mappedGenreIds,
            })
        } catch (error) {
            console.error('Failed to fetch animation detail:', error)
            alert('상세 정보를 불러오는데 실패했습니다.')
        } finally {
            setIsFetchingDetail(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!form.typeId) {
            alert('애니메이션 타입을 선택해주세요.')
            return
        }

        if (form.genreIds.length === 0) {
            alert('장르를 하나 이상 선택해주세요.')
            return
        }

        if (editing) {
            updateMutation.mutate({ id: editing.id, data: form })
        } else {
            createMutation.mutate(form)
        }
    }

    const isSaving = createMutation.isPending || updateMutation.isPending

    const toggleGenre = (genreId: string) => {
        setForm(prev => ({
            ...prev,
            genreIds: prev.genreIds.includes(genreId)
                ? prev.genreIds.filter(id => id !== genreId)
                : [...prev.genreIds, genreId]
        }))
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">애니메이션</h1>
                    <p className="text-muted-foreground">애니메이션을 등록하고 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setMetaDialogOpen(true)}>
                        <Settings2 className="mr-2 h-4 w-4" />
                        메타데이터 관리
                    </Button>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        애니메이션 추가
                    </Button>
                </div>
            </div>

            <Input
                placeholder="제목으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">썸네일</TableHead>
                            <TableHead>제목</TableHead>
                            <TableHead>타입</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>방영요일</TableHead>
                            <TableHead>등급</TableHead>
                            <TableHead className="text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    불러오는 중...
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    애니메이션이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((anim) => (
                                <TableRow key={anim.id}>
                                    <TableCell>
                                        <img
                                            src={anim.thumbnailUrl}
                                            alt={anim.title}
                                            className="h-12 w-10 rounded object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{anim.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{anim.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={anim.status === 'airing' ? 'default' : 'secondary'}>
                                            {STATUS_MAP[anim.status] ?? anim.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {anim.airDay ? AIR_DAY_LABELS[anim.airDay] ?? anim.airDay : '-'}
                                    </TableCell>
                                    <TableCell>{RATING_MAP[anim.ageRating] ?? anim.ageRating}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link to={`/animations/${anim.id}/episodes`}>
                                                    <Video className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(anim)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteTarget(anim)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link to={`/animations/${anim.id}/episodes`}>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? '애니메이션 수정' : '애니메이션 추가'}</DialogTitle>
                    </DialogHeader>
                    {isFetchingDetail ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">정보를 불러오는 중...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>제목</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="애니메이션 제목"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>타입</Label>
                                <Select
                                    value={form.typeId}
                                    onValueChange={(v) => setForm({ ...form, typeId: v })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="타입 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((t) => (
                                            <SelectItem key={t.typeId} value={t.typeId}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="줄거리"
                                    className="resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <Label>상태</Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(v) => setForm({ ...form, status: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="airing">방영중</SelectItem>
                                            <SelectItem value="finished">완결</SelectItem>
                                            <SelectItem value="upcoming">방영예정</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label>등급</Label>
                                    <Select
                                        value={form.rating}
                                        onValueChange={(v) => setForm({ ...form, rating: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">전체</SelectItem>
                                            <SelectItem value="12">12세</SelectItem>
                                            <SelectItem value="15">15세</SelectItem>
                                            <SelectItem value="19">19세</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <Label>방영요일</Label>
                                    <Select
                                        value={form.airDay ?? ''}
                                        onValueChange={(v) => setForm({ ...form, airDay: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="없음" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AIR_DAYS.map((d) => (
                                                <SelectItem key={d} value={d}>
                                                    {AIR_DAY_LABELS[d]}요일
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label>방영일</Label>
                                    <Input
                                        type="date"
                                        value={form.releasedAt}
                                        onChange={(e) => setForm({ ...form, releasedAt: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>장르</Label>
                                <div className="flex flex-wrap gap-2">
                                    {genres.map(g => (
                                        <Badge
                                            key={g.genreId}
                                            variant={form.genreIds.includes(g.genreId) ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => toggleGenre(g.genreId)}
                                        >
                                            {g.name}
                                        </Badge>
                                    ))}
                                </div>
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
                    )}
                </DialogContent>
            </Dialog>

            {/* Metadata Management Dialog */}
            <Dialog open={metaDialogOpen} onOpenChange={setMetaDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>메타데이터 관리</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Label>애니메이션 타입 추가</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    placeholder="예: TVA, MOVIE"
                                />
                                <Button
                                    onClick={() => createTypeMutation.mutate(newTypeName)}
                                    disabled={!newTypeName || createTypeMutation.isPending}
                                >
                                    추가
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {types.map(t => <Badge key={t.typeId} variant="secondary">{t.name}</Badge>)}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>장르 추가</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newGenreName}
                                    onChange={(e) => setNewGenreName(e.target.value)}
                                    placeholder="예: 액션, 판타지"
                                />
                                <Button
                                    onClick={() => createGenreMutation.mutate(newGenreName)}
                                    disabled={!newGenreName || createGenreMutation.isPending}
                                >
                                    추가
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {genres.map(g => <Badge key={g.genreId} variant="secondary">{g.name}</Badge>)}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>애니메이션 삭제</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{deleteTarget?.title}</span>을(를) 삭제합니다.
                        이 작업은 되돌릴 수 없습니다.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            취소
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                        >
                            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
