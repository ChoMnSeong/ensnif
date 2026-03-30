import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import ProfileSwitchDropdown from '@components/header/ProfileSwitchDropdown'
import customCookie from '@libs/customCookie'
import { setUserProfile } from '@stores/auth/reducer'
import { useSelector } from 'react-redux'
import { RootState } from '@stores/index'

interface HeaderProfileDropdownContainerProps {
    anchorEl: HTMLElement | null
    onClose: () => void
    onMouseEnter: () => void
}

const HeaderProfileDropdownContainer: React.FC<
    HeaderProfileDropdownContainerProps
> = ({ anchorEl, onClose, onMouseEnter }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const profile = useSelector((state: RootState) => state.userProfile)

    const handleLogout = () => {
        customCookie.remove.accessToken()
        customCookie.remove.refreshToken()
        customCookie.remove.profileToken()
        dispatch(
            setUserProfile({
                nickname: null,
                avatarUrl: null,
                profileId: null,
            }),
        )
        onClose()
        navigate('/auth/mail')
    }

    return (
        <ProfileSwitchDropdown
            nickname={profile.nickname}
            avatarUrl={profile.avatarUrl}
            anchorEl={anchorEl}
            onLogout={handleLogout}
            onMouseEnter={onMouseEnter}
        />
    )
}

export default HeaderProfileDropdownContainer
