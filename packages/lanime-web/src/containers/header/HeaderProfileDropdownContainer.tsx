import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores'
import ProfileSwitchDropdown from '../../components/header/ProfileSwitchDropdown'

interface HeaderProfileDropdownContainerProps {
    anchorEl: HTMLElement | null
    onClose: () => void
    onMouseEnter: () => void
}

const HeaderProfileDropdownContainer: React.FC<
    HeaderProfileDropdownContainerProps
> = ({ anchorEl, onClose, onMouseEnter }) => {
    const navigate = useNavigate()
    const profile = useSelector((state: RootState) => state.userProfile)

    const handleNavigateToProfile = () => {
        onClose()
        navigate('/profile')
    }

    return (
        <ProfileSwitchDropdown
            nickname={profile.nickname}
            avatarUrl={profile.avatarUrl}
            anchorEl={anchorEl}
            onNavigateToProfile={handleNavigateToProfile}
            onMouseEnter={onMouseEnter}
        />
    )
}

export default HeaderProfileDropdownContainer
