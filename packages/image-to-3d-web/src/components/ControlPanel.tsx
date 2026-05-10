import { useEffect, useState } from 'react'
import {
    Card,
    Button,
    Stack,
    Label,
    Progress,
    Badge,
    Textarea,
    Checkbox,
    Alert,
    Divider,
    ComboBox,
    FileUpload,
} from '@ensnif/design-system'
import { fetchArtifacts, createJob, pollJob, type Artifact, type Job } from '@/api/jobs'

type Props = { onLoadGlb: (url: string) => void }

const fmtSec = (s?: number | null) => {
    if (s == null) return '-'
    if (s < 60) return `${Math.round(s)}s`
    const m = Math.floor(s / 60),
        ss = Math.round(s % 60)
    return `${m}m${ss.toString().padStart(2, '0')}s`
}

const fmtBytes = (n: number) => {
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
    return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export const ControlPanel = ({ onLoadGlb }: Props) => {
    const [artifacts, setArtifacts] = useState<Artifact[]>([])
    const [selected, setSelected] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [prompt, setPrompt] = useState('')
    const [withTexture, setWithTexture] = useState(true)
    const [job, setJob] = useState<Job | null>(null)
    const [busy, setBusy] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    const loadArtifacts = async () => {
        try {
            const items = await fetchArtifacts()
            setArtifacts(items)
            if (items.length && !selected) setSelected(items[0].url)
        } catch (e) {
            setErr(`산출물 로드 실패: ${(e as Error).message}`)
        }
    }
    useEffect(() => {
        loadArtifacts()
    }, [])

    const handleGenerate = async () => {
        setErr(null)
        if (!files.length && !prompt.trim()) {
            setErr('이미지 또는 프롬프트를 입력하세요')
            return
        }
        setBusy(true)
        try {
            const created = await createJob(files, prompt, withTexture)
            setJob(created)
            const done = await pollJob(created.id, (j) => setJob(j))
            if (done.model_url) onLoadGlb(`${done.model_url}?t=${Date.now()}`)
        } catch (e) {
            setErr(`실패: ${(e as Error).message}`)
        } finally {
            setBusy(false)
        }
    }

    const progress = job?.progress
    const pct = progress?.percent ?? 0

    return (
        <Card padded style={{ width: 340 }}>
            <Stack direction="column" gap={12}>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Image → 3D</h2>

                <Stack direction="column" gap={4}>
                    <Label>기존 산출물 비교</Label>
                    <Stack direction="row" gap={6} align="stretch">
                        <ComboBox
                            options={artifacts.map((a) => ({
                                value: a.url,
                                label: a.name,
                                description: fmtBytes(a.size),
                            }))}
                            value={selected}
                            onChange={setSelected}
                            placeholder="산출물 선택"
                            emptyMessage="산출물 없음"
                            width="100%"
                            style={{ flex: 1, minWidth: 0 }}
                        />
                        <Button variant="ghost" onClick={loadArtifacts} title="새로고침">
                            ↻
                        </Button>
                    </Stack>
                    <Button
                        variant="primary"
                        onClick={() => selected && onLoadGlb(`${selected}?t=${Date.now()}`)}
                        disabled={!selected}
                    >
                        선택 GLB 로드
                    </Button>
                </Stack>

                <Divider />

                <Stack direction="column" gap={4}>
                    <Label style={{ color: '#34d399' }}>⭐ 권장: 4뷰 직접 입력</Label>
                    <FileUpload
                        value={files}
                        onChange={setFiles}
                        accept="image/*"
                        multiple
                        placeholder="이미지 파일 선택 (드래그 또는 클릭)"
                        description="front / right / back / left 4면. 파일명 키워드 자동 인식"
                    />
                    {files.length > 0 && (
                        <Badge tone="success">{files.length}개 파일 선택됨</Badge>
                    )}
                </Stack>

                <Divider />

                <Stack direction="column" gap={4}>
                    <Label>실험 — 단일 입력 / 텍스트</Label>
                    <Textarea
                        placeholder="텍스트 모드 프롬프트 (선택)"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Checkbox
                        label="텍스처"
                        checked={withTexture}
                        onChange={(e) =>
                            setWithTexture((e.target as HTMLInputElement).checked)
                        }
                    />
                </Stack>

                <Button variant="primary" onClick={handleGenerate} disabled={busy} loading={busy}>
                    {busy ? '생성 중...' : '생성'}
                </Button>

                {job && (
                    <Stack direction="column" gap={4}>
                        <Label>
                            상태: {job.status}
                            {job.mode ? ` · ${job.mode}` : ''}
                        </Label>
                        {progress && (
                            <>
                                <Progress value={pct} max={100} tone="accent" showLabel />
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 10,
                                        color: '#6b7280',
                                    }}
                                >
                                    <span>
                                        {progress.phase}
                                        {progress.total
                                            ? ` (${progress.current}/${progress.total})`
                                            : ''}
                                    </span>
                                    <span>
                                        elapsed {fmtSec(progress.elapsed_sec)} · ETA{' '}
                                        {fmtSec(progress.eta_sec)}
                                    </span>
                                </div>
                            </>
                        )}
                    </Stack>
                )}

                {err && <Alert tone="danger">{err}</Alert>}
            </Stack>
        </Card>
    )
}
