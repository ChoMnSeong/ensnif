export type JobProgress = {
    phase: string
    current?: number
    total?: number | null
    percent?: number | null
    elapsed_sec?: number
    eta_sec?: number | null
    rate?: number | null
}

export type Job = {
    id: string
    status: 'queued' | 'running' | 'done' | 'failed'
    mode?: string
    error?: string
    model_url?: string
    progress?: JobProgress
}

export type Artifact = { name: string; url: string; size: number }

export const fetchArtifacts = async (): Promise<Artifact[]> => {
    const r = await fetch('/artifacts')
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return (await r.json()).items
}

export const createJob = async (
    images: File[],
    prompt: string,
    withTexture: boolean,
): Promise<Job> => {
    const fd = new FormData()
    images.forEach((f) => fd.append('images', f))
    if (prompt) fd.append('prompt', prompt)
    fd.append('with_texture', withTexture ? 'true' : 'false')
    const r = await fetch('/jobs', { method: 'POST', body: fd })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
}

export const getJob = async (id: string): Promise<Job> => {
    const r = await fetch(`/jobs/${id}`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
}

export const pollJob = async (
    id: string,
    onUpdate: (job: Job) => void,
    intervalMs = 1000,
): Promise<Job> => {
    while (true) {
        const j = await getJob(id)
        onUpdate(j)
        if (j.status === 'done') return j
        if (j.status === 'failed') throw new Error(j.error || 'failed')
        await new Promise((r) => setTimeout(r, intervalMs))
    }
}
