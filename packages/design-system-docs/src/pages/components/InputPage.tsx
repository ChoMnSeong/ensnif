import { useState } from 'react'
import {
    IconSearch,
    Input,
    Label,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const InputPage = () => {
    const [pwd, setPwd] = useState('weakpw')
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="Input"
                description="텍스트 입력. 4가지 variant (outlined / underline / filled / ghost), 3 size, prefix/suffix, invalid 상태, password 보이기/숨기기 토글, 전체 지우기(clearable)."
            />

            <ComponentPreview
                title="Variants"
                description="outlined (기본) / underline / filled / ghost"
                code={`<Input variant="outlined" placeholder="Outlined" />
<Input variant="underline" placeholder="Underline" />
<Input variant="filled" placeholder="Filled" />
<Input variant="ghost" placeholder="Ghost" />`}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        width: '100%',
                        maxWidth: '320px',
                    }}
                >
                    <Input
                        variant="outlined"
                        placeholder="Outlined"
                        fullWidth
                    />
                    <Input
                        variant="underline"
                        placeholder="Underline"
                        fullWidth
                    />
                    <Input variant="filled" placeholder="Filled" fullWidth />
                    <Input variant="ghost" placeholder="Ghost" fullWidth />
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="Search (icon only)"
                description="ghost variant + prefix 아이콘으로 깔끔한 검색바"
                code={`<Input
    variant="ghost"
    prefix={<IconSearch size={14} />}
    placeholder="검색"
/>`}
            >
                <Input
                    variant="ghost"
                    prefix={<IconSearch size={14} />}
                    placeholder="검색"
                />
                <Input
                    variant="filled"
                    prefix={<IconSearch size={14} />}
                    placeholder="장르, 제목..."
                />
                <Input
                    variant="underline"
                    prefix={<IconSearch size={14} />}
                    placeholder="키워드"
                />
            </ComponentPreview>

            <ComponentPreview
                title="Sizes"
                code={`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`}
            >
                <Input size="sm" placeholder="Small" />
                <Input size="md" placeholder="Medium" />
                <Input size="lg" placeholder="Large" />
            </ComponentPreview>

            <ComponentPreview
                title="Prefix / Suffix"
                code={`<Input prefix="@" placeholder="username" />
<Input suffix=".com" placeholder="domain" />
<Input prefix={<IconSearch size={14} />} placeholder="검색" />`}
            >
                <Input prefix="@" placeholder="username" />
                <Input suffix=".com" placeholder="domain" />
                <Input
                    prefix={<IconSearch size={14} />}
                    placeholder="검색"
                />
            </ComponentPreview>

            <ComponentPreview
                title="With label"
                code={`<Label htmlFor="email" required>이메일</Label>
<Input id="email" type="email" placeholder="user@example.com" fullWidth />`}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <Label htmlFor="email" required>
                        이메일
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        fullWidth
                        style={{ minWidth: '280px' }}
                    />
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="Invalid"
                code={`<Input
    type="password"
    invalid={pwd.length < 8}
    value={pwd}
    onChange={(e) => setPwd(e.target.value)}
/>`}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <Label htmlFor="pwd">비밀번호</Label>
                    <Input
                        id="pwd"
                        type="password"
                        invalid={pwd.length < 8}
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        style={{ minWidth: '280px' }}
                    />
                    {pwd.length < 8 && (
                        <span
                            style={{
                                fontSize: '11px',
                                color: 'var(--ds-color-state-danger)',
                            }}
                        >
                            8자 이상 입력해주세요
                        </span>
                    )}
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="Password reveal"
                description="type='password' 이면 보이기/숨기기 토글 버튼이 자동으로 노출된다. revealable={false}로 끌 수 있다."
                code={`<Input type="password" defaultValue="s3cr3t!" />`}
            >
                <Input
                    type="password"
                    defaultValue="s3cr3t!"
                    style={{ minWidth: '280px' }}
                />
            </ComponentPreview>

            <ComponentPreview
                title="Clearable"
                description="clearable 를 켜면 입력값이 있을 때 전체 지우기 버튼이 나타난다."
                code={`<Input
    clearable
    placeholder="검색어 입력"
    prefix={<IconSearch size={14} />}
/>`}
            >
                <Input
                    clearable
                    defaultValue="지울 수 있는 텍스트"
                    prefix={<IconSearch size={14} />}
                    style={{ minWidth: '280px' }}
                />
            </ComponentPreview>
        </>
    )
}
