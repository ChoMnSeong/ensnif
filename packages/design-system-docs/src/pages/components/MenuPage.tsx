import {
    Button,
    HStack,
    IconArrowDown,
    IconClose,
    IconMoreVertical,
    Menu,
    MenuItem,
    MenuLabel,
    MenuSeparator,
} from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const MenuPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Menu / DropdownMenu"
            description="trigger 클릭으로 펼침. MenuItem / MenuSeparator / MenuLabel 컴포지션."
        />

        <ComponentPreview
            title="기본"
            code={`<Menu trigger={<Button>옵션</Button>}>
    <MenuItem>편집</MenuItem>
    <MenuItem>복제</MenuItem>
    <MenuSeparator />
    <MenuItem danger>삭제</MenuItem>
</Menu>`}
        >
            <HStack gap={8}>
                <Menu
                    trigger={
                        <Button
                            variant="secondary"
                            iconRight={<IconArrowDown size={14} />}
                        >
                            옵션
                        </Button>
                    }
                >
                    <MenuLabel>관리</MenuLabel>
                    <MenuItem>편집</MenuItem>
                    <MenuItem shortcut="⌘D">복제</MenuItem>
                    <MenuItem>공유</MenuItem>
                    <MenuSeparator />
                    <MenuItem danger icon={<IconClose size={14} />}>
                        삭제
                    </MenuItem>
                </Menu>

                <Menu
                    trigger={
                        <Button
                            variant="ghost"
                            aria-label="More"
                            style={{ width: 36, padding: 0 }}
                        >
                            <IconMoreVertical size={16} />
                        </Button>
                    }
                    align="end"
                >
                    <MenuItem>북마크</MenuItem>
                    <MenuItem>다운로드</MenuItem>
                    <MenuItem>신고</MenuItem>
                </Menu>
            </HStack>
        </ComponentPreview>
    </>
)
