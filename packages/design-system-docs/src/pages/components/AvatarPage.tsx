import { Avatar, AvatarGroup } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const AvatarPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Avatar"
            description="이미지 + 이니셜 폴백. xs/sm/md/lg/xl 5 size, circle/rounded shape, AvatarGroup 지원."
        />

        <ComponentPreview
            title="Sizes"
            code={`<Avatar name="Lanime User" size="md" />`}
        >
            <Avatar size="xs" name="Lanime User" />
            <Avatar size="sm" name="Lanime User" />
            <Avatar size="md" name="Lanime User" />
            <Avatar size="lg" name="Lanime User" />
            <Avatar size="xl" name="Lanime User" />
        </ComponentPreview>

        <ComponentPreview
            title="With image"
            code={`<Avatar size="md" name="Hime" src="https://i.pravatar.cc/100?img=1" />`}
        >
            <Avatar
                size="md"
                name="Hime"
                src="https://i.pravatar.cc/100?img=1"
            />
            <Avatar
                size="md"
                name="Sora"
                src="https://i.pravatar.cc/100?img=2"
            />
            <Avatar
                size="md"
                name="Yuki"
                src="https://i.pravatar.cc/100?img=3"
            />
            <Avatar
                size="md"
                name="Broken"
                src="https://broken-url-test"
            />
        </ComponentPreview>

        <ComponentPreview
            title="Group"
            code={`<AvatarGroup max={4}>
    <Avatar name="A" src="..." />
    <Avatar name="B" src="..." />
    <Avatar name="C" src="..." />
    <Avatar name="D" src="..." />
    <Avatar name="E" src="..." />
</AvatarGroup>`}
        >
            <AvatarGroup max={4}>
                <Avatar name="A" src="https://i.pravatar.cc/100?img=1" />
                <Avatar name="B" src="https://i.pravatar.cc/100?img=2" />
                <Avatar name="C" src="https://i.pravatar.cc/100?img=3" />
                <Avatar name="D" src="https://i.pravatar.cc/100?img=4" />
                <Avatar name="E" src="https://i.pravatar.cc/100?img=5" />
                <Avatar name="F" src="https://i.pravatar.cc/100?img=6" />
                <Avatar name="G" src="https://i.pravatar.cc/100?img=7" />
            </AvatarGroup>
        </ComponentPreview>

        <ComponentPreview
            title="Rounded"
            code={`<Avatar shape="rounded" name="Lanime" />
<Avatar shape="rounded" size="lg" src="..." />`}
        >
            <Avatar shape="rounded" name="Lanime" />
            <Avatar
                shape="rounded"
                name="LU"
                size="lg"
                src="https://i.pravatar.cc/100?img=10"
            />
        </ComponentPreview>
    </>
)
