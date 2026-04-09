import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Video, ChevronRight, Settings2, Loader2, Download, Languages } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
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
import {
    useAdminAnimations,
    useAnimationTypes,
    useAnimationGenres,
    useCreateAnimation,
    useUpdateAnimation,
    useDeleteAnimation,
    useCreateAnimationType,
    useCreateAnimationGenre,
    useImportAnimation,
    useImportSeason,
    useBulkResetImport,
    useUpsertAnimationTranslation,
    fetchAnimationDetail,
} from '@libs/apis/admin'
import type { IAdminAnimation, IAnimationCreateRequest } from '@libs/apis/admin/type'

const SEASON_KEYS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'] as const
const LOCALE_KEYS = ['ko', 'en', 'ja'] as const

const STATUS_KEYS = ['ONGOING', 'FINISHED', 'UPCOMING'] as const
const AIR_DAY_KEYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const
const RATING_KEYS = ['ALL', '12', '15', '19'] as const

const defaultForm: IAnimationCreateRequest = {
    typeId: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    rating: 'ALL',
    status: 'ONGOING',
    airDay: '',
    releasedAt: '',
    genreIds: [],
}

export default function AnimationsContainer() {
    const { t } = useTranslation()
    const [search, setSearch] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [metaDialogOpen, setMetaDialogOpen] = useState(false)
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<IAdminAnimation | null>(null)
    const [editing, setEditing] = useState<IAdminAnimation | null>(null)
    const [form, setForm] = useState<IAnimationCreateRequest>(defaultForm)
    const [isFetchingDetail, setIsFetchingDetail] = useState(false)
    const [newTypeName, setNewTypeName] = useState('')
    const [newGenreName, setNewGenreName] = useState('')

    // MAL import
    const [malId, setMalId] = useState('')
    const [seasonImportSeason, setSeasonImportSeason] = useState<typeof SEASON_KEYS[number]>('SPRING')
    const [seasonImportYear, setSeasonImportYear] = useState(new Date().getFullYear())

    // Translation
    const [translationTarget, setTranslationTarget] = useState<IAdminAnimation | null>(null)
    const [translationLocale, setTranslationLocale] = useState<typeof LOCALE_KEYS[number]>('ko')
    const [translationTitle, setTranslationTitle] = useState('')
    const [translationDesc, setTranslationDesc] = useState('')

    const { data: animations = [], isLoading } = useAdminAnimations()
    const { data: types = [] } = useAnimationTypes()
    const { data: genres = [] } = useAnimationGenres()

    const createMutation = useCreateAnimation()
    const updateMutation = useUpdateAnimation()
    const deleteMutation = useDeleteAnimation()
    const createTypeMutation = useCreateAnimationType()
    const createGenreMutation = useCreateAnimationGenre()
    const [bulkResetConfirm, setBulkResetConfirm] = useState(false)

    const importMutation = useImportAnimation()
    const importSeasonMutation = useImportSeason()
    const bulkResetMutation = useBulkResetImport()
    const translationMutation = useUpsertAnimationTranslation()

    const [bulkResetStartYear, setBulkResetStartYear] = useState(new Date().getFullYear())
    const [bulkResetEndYear, setBulkResetEndYear] = useState(2000)

    useEffect(() => {
        if (!editing && !form.typeId && types.length > 0) {
            setForm((prev) => ({ ...prev, typeId: types[0].typeId }))
        }
    }, [types, editing, form.typeId])

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
            const detail = await fetchAnimationDetail(anim.id)
            const mappedGenreIds = (detail.genres ?? [])
                .map((genreName) => genres.find((g) => g.name === genreName)?.genreId)
                .filter(Boolean) as string[]

            setForm({
                typeId: types.find((t) => t.name === (detail.type || anim.type))?.typeId ?? '',
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
            updateMutation.mutate(
                { id: editing.id, data: form },
                {
                    onSuccess: () => {
                        setDialogOpen(false)
                        setEditing(null)
                        setForm(defaultForm)
                    },
                },
            )
        } else {
            createMutation.mutate(form, {
                onSuccess: () => {
                    setDialogOpen(false)
                    setForm(defaultForm)
                },
            })
        }
    }

    const toggleGenre = (genreId: string) => {
        setForm((prev) => ({
            ...prev,
            genreIds: prev.genreIds.includes(genreId)
                ? prev.genreIds.filter((id) => id !== genreId)
                : [...prev.genreIds, genreId],
        }))
    }

    const openTranslation = (anim: IAdminAnimation) => {
        setTranslationTarget(anim)
        setTranslationLocale('ko')
        setTranslationTitle('')
        setTranslationDesc('')
    }

    const handleTranslationSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!translationTarget) return
        translationMutation.mutate(
            {
                animationId: translationTarget.id,
                locale: translationLocale,
                data: { title: translationTitle, description: translationDesc || undefined },
            },
            {
                onSuccess: () => {
                    setTranslationTarget(null)
                },
            },
        )
    }

    const handleMalImport = (e: React.FormEvent) => {
        e.preventDefault()
        const id = Number(malId)
        if (!id) return
        importMutation.mutate(
            { malId: id },
            {
                onSuccess: () => {
                    setMalId('')
                    setImportDialogOpen(false)
                },
            },
        )
    }

    const handleSeasonImport = () => {
        importSeasonMutation.mutate(
            { season: seasonImportSeason, year: seasonImportYear },
            {
                onSuccess: () => setImportDialogOpen(false),
            },
        )
    }

    const isSaving = createMutation.isPending || updateMutation.isPending

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
                    <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                        <Download className="mr-2 h-4 w-4" />
                        MAL 임포트
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
                                        <Badge
                                            variant={anim.status === 'ONGOING' ? 'default' : 'secondary'}
                                        >
                                            {t(`animationStatus.${anim.status}`, { defaultValue: anim.status })}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {anim.airDay
                                            ? t(`airDay.${anim.airDay}`, { defaultValue: anim.airDay })
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {t(`ageRating.${anim.ageRating}`, { defaultValue: anim.ageRating })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link to={`/animations/${anim.id}/episodes`}>
                                                    <Video className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="번역 관리"
                                                onClick={() => openTranslation(anim)}
                                            >
                                                <Languages className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(anim)}
                                            >
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
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="타입 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((t) => (
                                            <SelectItem key={t.typeId} value={t.typeId}>
                                                {t.name}
                                            </SelectItem>
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
                                            {STATUS_KEYS.map((key) => (
                                                <SelectItem key={key} value={key}>
                                                    {t(`animationStatus.${key}`)}
                                                </SelectItem>
                                            ))}
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
                                            {RATING_KEYS.map((key) => (
                                                <SelectItem key={key} value={key}>
                                                    {t(`ageRating.${key}`)}
                                                </SelectItem>
                                            ))}
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
                                            {AIR_DAY_KEYS.map((key) => (
                                                <SelectItem key={key} value={key}>
                                                    {t(`airDay.${key}`)}
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
                                    {genres.map((g) => (
                                        <Badge
                                            key={g.genreId}
                                            variant={
                                                form.genreIds.includes(g.genreId) ? 'default' : 'outline'
                                            }
                                            className="cursor-pointer"
                                            onClick={() => toggleGenre(g.genreId)}
                                        >
                                            {t(`genre.${g.name}`, { defaultValue: g.name })}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
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
                                    onClick={() =>
                                        createTypeMutation.mutate(newTypeName, {
                                            onSuccess: () => setNewTypeName(''),
                                        })
                                    }
                                    disabled={!newTypeName || createTypeMutation.isPending}
                                >
                                    추가
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {types.map((type) => (
                                    <Badge key={type.typeId} variant="secondary">
                                        {t(`animationType.${type.name}`, { defaultValue: type.name })}
                                    </Badge>
                                ))}
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
                                    onClick={() =>
                                        createGenreMutation.mutate(newGenreName, {
                                            onSuccess: () => setNewGenreName(''),
                                        })
                                    }
                                    disabled={!newGenreName || createGenreMutation.isPending}
                                >
                                    추가
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((g) => (
                                    <Badge key={g.genreId} variant="secondary">
                                        {t(`genre.${g.name}`, { defaultValue: g.name })}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* MAL Import Dialog */}
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>MAL 임포트</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-6">
                        {/* 단건 임포트 */}
                        <form onSubmit={handleMalImport} className="flex flex-col gap-3">
                            <Label>MAL ID로 단건 임포트</Label>
                            <p className="text-xs text-muted-foreground">
                                MyAnimeList ID를 입력하면 제목, 설명, 장르, 에피소드가 자동으로 저장됩니다.
                            </p>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="예: 21"
                                    value={malId}
                                    onChange={(e) => setMalId(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    disabled={!malId || importMutation.isPending}
                                >
                                    {importMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : '임포트'}
                                </Button>
                            </div>
                            {importMutation.isError && (
                                <p className="text-xs text-destructive">
                                    임포트 실패. 이미 등록된 MAL ID이거나 존재하지 않는 ID입니다.
                                </p>
                            )}
                        </form>

                        <div className="border-t pt-4 flex flex-col gap-3">
                            <Label>시즌 일괄 임포트</Label>
                            <p className="text-xs text-muted-foreground">
                                특정 시즌의 애니메이션을 일괄 임포트합니다. 이미 등록된 항목은 자동으로 건너뜁니다.
                            </p>
                            <div className="flex gap-2">
                                <Select
                                    value={seasonImportSeason}
                                    onValueChange={(v) => setSeasonImportSeason(v as typeof SEASON_KEYS[number])}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEASON_KEYS.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    min={2000}
                                    max={2099}
                                    value={seasonImportYear}
                                    onChange={(e) => setSeasonImportYear(Number(e.target.value))}
                                    className="w-24"
                                />
                                <Button
                                    onClick={handleSeasonImport}
                                    disabled={importSeasonMutation.isPending}
                                >
                                    {importSeasonMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : '임포트'}
                                </Button>
                            </div>
                            {importSeasonMutation.isError && (
                                <p className="text-xs text-destructive">시즌 임포트에 실패했습니다.</p>
                            )}
                        </div>

                        <div className="border-t pt-4 flex flex-col gap-3">
                            <Label className="text-destructive">전체 초기화 후 재임포트</Label>
                            <p className="text-xs text-muted-foreground">
                                기존 데이터를 <span className="font-semibold text-destructive">전체 삭제</span> 후
                                지정 연도 범위 내의 애니메이션을 임포트합니다.
                                백그라운드에서 실행되며 진행 상황은 서버 로그에서 확인할 수 있습니다.
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                    <Label className="shrink-0 text-sm">시작 연도</Label>
                                    <Input
                                        type="number"
                                        min={1990}
                                        max={2099}
                                        value={bulkResetStartYear}
                                        onChange={(e) => {
                                            setBulkResetStartYear(Number(e.target.value))
                                            setBulkResetConfirm(false)
                                        }}
                                        className="w-24"
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Label className="shrink-0 text-sm">종료 연도</Label>
                                    <Input
                                        type="number"
                                        min={1990}
                                        max={2099}
                                        value={bulkResetEndYear}
                                        onChange={(e) => {
                                            setBulkResetEndYear(Number(e.target.value))
                                            setBulkResetConfirm(false)
                                        }}
                                        className="w-24"
                                    />
                                </div>
                            </div>
                            {!bulkResetConfirm ? (
                                <Button
                                    variant="destructive"
                                    onClick={() => setBulkResetConfirm(true)}
                                >
                                    전체 초기화 후 재임포트
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-destructive">
                                        정말 실행하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setBulkResetConfirm(false)}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            disabled={bulkResetMutation.isPending}
                                            onClick={() =>
                                                bulkResetMutation.mutate(
                                                    { startYear: bulkResetStartYear, endYear: bulkResetEndYear },
                                                    {
                                                        onSuccess: () => {
                                                            setBulkResetConfirm(false)
                                                            setImportDialogOpen(false)
                                                        },
                                                    },
                                                )
                                            }
                                        >
                                            {bulkResetMutation.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : '확인, 실행'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {bulkResetMutation.isError && (
                                <p className="text-xs text-destructive">실행에 실패했습니다.</p>
                            )}
                            {bulkResetMutation.isSuccess && (
                                <p className="text-xs text-green-600">백그라운드에서 임포트가 시작되었습니다. 서버 로그를 확인하세요.</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Translation Dialog */}
            <Dialog open={!!translationTarget} onOpenChange={() => setTranslationTarget(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>번역 관리 — {translationTarget?.title}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTranslationSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label>언어</Label>
                            <Select
                                value={translationLocale}
                                onValueChange={(v) => setTranslationLocale(v as typeof LOCALE_KEYS[number])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOCALE_KEYS.map((l) => (
                                        <SelectItem key={l} value={l}>
                                            {l === 'ko' ? '한국어' : l === 'en' ? 'English' : '日本語'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>제목</Label>
                            <Input
                                value={translationTitle}
                                onChange={(e) => setTranslationTitle(e.target.value)}
                                placeholder="번역된 제목"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>설명 (선택)</Label>
                            <Textarea
                                value={translationDesc}
                                onChange={(e) => setTranslationDesc(e.target.value)}
                                placeholder="번역된 설명"
                                className="resize-none"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setTranslationTarget(null)}>
                                취소
                            </Button>
                            <Button type="submit" disabled={translationMutation.isPending}>
                                {translationMutation.isPending ? '저장 중...' : '저장'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>애니메이션 삭제</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{deleteTarget?.title}</span>
                        을(를) 삭제합니다. 이 작업은 되돌릴 수 없습니다.
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
                                deleteMutation.mutate(deleteTarget.id, {
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
