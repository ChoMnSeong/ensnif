import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
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
import { useAdminAccounts, useCreateAdminAccount, useDeleteAdminAccount } from '@libs/apis/admin'
import type { IAdminAccount } from '@libs/apis/admin/type'

export default function AccountsContainer() {
    const [createOpen, setCreateOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<IAdminAccount | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { data: accounts = [], isLoading } = useAdminAccounts()

    const createMutation = useCreateAdminAccount()
    const deleteMutation = useDeleteAdminAccount()

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        createMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    setCreateOpen(false)
                    setEmail('')
                    setPassword('')
                },
                onError: () => {
                    setError('계정 생성에 실패했습니다.')
                },
            },
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">관리자 계정</h1>
                    <p className="text-muted-foreground">관리자 계정을 추가하거나 삭제합니다.</p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    관리자 추가
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>이메일</TableHead>
                            <TableHead>생성일</TableHead>
                            <TableHead className="text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    불러오는 중...
                                </TableCell>
                            </TableRow>
                        ) : accounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    관리자 계정이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            accounts.map((account) => (
                                <TableRow key={account.adminId}>
                                    <TableCell className="font-medium">{account.email}</TableCell>
                                    <TableCell>
                                        {new Date(account.createdAt).toLocaleDateString('ko-KR')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteTarget(account)}
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

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>관리자 계정 추가</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label>이메일</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>비밀번호</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                                취소
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? '추가 중...' : '추가'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>관리자 삭제</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{deleteTarget?.email}</span> 계정을
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
                                deleteTarget && deleteMutation.mutate(deleteTarget.adminId, {
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
