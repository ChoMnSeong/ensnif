import { themedPalette } from '@/libs/style/theme'
import type { IconType } from 'react-icons'
import {
    MdPauseCircle,
    MdStopCircle,
    MdReplay10,
    MdForward10,
    MdSkipNext,
    MdVolumeUp,
    MdVolumeOff,
    MdLock,
    MdChevronLeft,
    MdChevronRight,
    MdFullscreen,
    MdFullscreenExit,
    MdMenu,
    MdClose,
} from 'react-icons/md'

const iconMap = {
    pauseCircle: MdPauseCircle,
    stopCircle: MdStopCircle,
    rewind: MdReplay10,
    skip: MdForward10,
    skipNext: MdSkipNext,
    volumeUp: MdVolumeUp,
    volumeOff: MdVolumeOff,
    lock: MdLock,
    arrowBack: MdChevronLeft,
    chevronLeft: MdChevronLeft,
    chevronRight: MdChevronRight,
    fullscreen: MdFullscreen,
    fullscreenExit: MdFullscreenExit,
    menu: MdMenu,
    close: MdClose,
} as const satisfies Record<string, IconType>

export type IconName = keyof typeof iconMap

interface IconProps {
    name: IconName
    size?: number
    color?: string
    className?: string
    style?: React.CSSProperties
    'aria-label'?: string
    'aria-hidden'?: boolean
}

const Icon: React.FC<IconProps> = ({
    name,
    size = 24,
    color = themedPalette.text1,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
}) => {
    const IconComponent = iconMap[name]
    return (
        <IconComponent
            size={size}
            color={color}
            className={className}
            style={style}
            aria-label={ariaLabel}
            aria-hidden={ariaHidden ?? !ariaLabel}
        />
    )
}

export default Icon
