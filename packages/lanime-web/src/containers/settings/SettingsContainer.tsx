import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { themedPalette } from '@libs/style/theme'
import { RootState } from '@stores/index'
import { setUserProfile } from '@stores/auth/reducer'
import {
    useUpdateProfileMutation,
    useDeleteProfileMutation,
    useMyProfileQuery,
    useProfilesQuery,
    useDeleteAccountMutation,
    useSendEmailVerificationMutation,
    useChangeEmailMutation,
    useChangePasswordMutation,
} from '@libs/apis/auth'
import useTheme from '@libs/hooks/useTheme'
import customCookie from '@libs/customCookie'
import { useTranslation } from 'react-i18next'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import ProfileImageUpload from '@components/common/ProfileImageUpload'
import SettingsPinSection from '@components/settings/SettingsPinSection'
import SettingsThemeSection from '@components/settings/SettingsThemeSection'
import SettingsDangerSection from '@components/settings/SettingsDangerSection'
import SettingsAccountSection from '@components/settings/SettingsAccountSection'
import SettingsPasswordSection from '@components/settings/SettingsPasswordSection'
import SettingsEmailSection from '@components/settings/SettingsEmailSection'
import Flex from '@components/common/Flex'

const SettingsContainer: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const profile = useSelector((state: RootState) => state.userProfile)
    const { themePreference, setThemePreference } = useTheme()
    const { t } = useTranslation()

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['myProfile'] })
        queryClient.invalidateQueries({ queryKey: ['profiles'] })
    }, [queryClient])

    const { data: myProfile } = useMyProfileQuery()
    const isOwner = myProfile?.isOwner ?? false

    const { data: profiles = [] } = useProfilesQuery()

    const [nickname, setNickname] = useState(profile.nickname ?? '')
    const [age, setAge] = useState(profile.age?.toString() ?? '')
    const [pin, setPin] = useState(['', '', '', ''])
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '')

    const { mutate: updateProfile, isPending: isUpdating } =
        useUpdateProfileMutation()
    const { mutate: deleteProfile, isPending: isDeleting } =
        useDeleteProfileMutation()
    const { mutate: deleteAccount, isPending: isDeletingAccount } =
        useDeleteAccountMutation()
    const { mutate: sendEmailVerification, isPending: isSendingEmail } =
        useSendEmailVerificationMutation()
    const { mutate: changeEmail, isPending: isChangingEmail } =
        useChangeEmailMutation()
    const { mutate: changePassword, isPending: isChangingPassword } =
        useChangePasswordMutation()

    useEffect(() => {
        if (!myProfile) return
        setNickname(myProfile.name)
        setAvatarUrl(myProfile.avatarUrl)
        setAge(myProfile.age?.toString() ?? '')
    }, [myProfile])

    const handleSave = () => {
        const fullPin = pin.join('')
        if (fullPin.length > 0 && fullPin.length < 4) {
            toast.error(t('auth.pinRequired'))
            return
        }
        if (!nickname.trim()) {
            toast.error(t('settings.nicknamePlaceholder'))
            return
        }

        const parsedAge = age ? parseInt(age, 10) : undefined
        if (age && (isNaN(parsedAge!) || parsedAge! < 1 || parsedAge! > 150)) {
            toast.error(t('auth.profileAgePlaceholder'))
            return
        }

        updateProfile(
            {
                name: nickname,
                avatarUrl,
                ...(parsedAge !== undefined ? { age: parsedAge } : {}),
                ...(fullPin.length === 4 ? { pin: fullPin } : {}),
            },
            {
                onSuccess: () => {
                    dispatch(
                        setUserProfile({
                            nickname,
                            avatarUrl,
                            profileId: profile.profileId,
                            age: parsedAge ?? null,
                        }),
                    )
                    queryClient.invalidateQueries({ queryKey: ['myProfile'] })
                    queryClient.invalidateQueries({ queryKey: ['profiles'] })
                    // age 변경 시 애니메이션 쿼리 무효화
                    queryClient.invalidateQueries({
                        queryKey: ['weeklyAnimationList'],
                    })
                    queryClient.invalidateQueries({
                        queryKey: ['searchAnimations'],
                    })
                    queryClient.invalidateQueries({
                        queryKey: ['animationRankings'],
                    })
                    queryClient.invalidateQueries({
                        queryKey: ['similarAnimations'],
                    })
                    toast.success(t('settings.saveSuccess'))
                },
                onError: () => toast.error(t('settings.saveFailed')),
            },
        )
    }

    const handleDeletePin = () => {
        updateProfile(
            { pin: '' },
            {
                onSuccess: () => {
                    setPin(['', '', '', ''])
                    toast.success(t('settings.pinDeleteSuccess'))
                },
                onError: () => toast.error(t('settings.pinDeleteFailed')),
            },
        )
    }

    const handleDeleteProfile = (profileId: string) => {
        deleteProfile(profileId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['profiles'] })
                toast.success(t('settings.profileDeleteSuccess'))
            },
            onError: () => toast.error(t('settings.profileDeleteFailed')),
        })
    }

    const handleDeleteAccount = () => {
        deleteAccount(undefined, {
            onSuccess: () => {
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
                toast.success(t('settings.accountDeleteSuccess'))
                navigate('/auth/mail')
            },
            onError: (err) => {
                const message = axios.isAxiosError(err)
                    ? err.response?.data?.message
                    : undefined
                toast.error(message || t('settings.accountDeleteFailed'))
            },
        })
    }

    const handleSendEmailCode = (email: string) => {
        sendEmailVerification(
            { email },
            {
                onSuccess: () => toast.success(t('settings.emailCodeSent')),
                onError: (err) => {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : undefined
                    toast.error(message || t('settings.emailCodeFailed'))
                },
            },
        )
    }

    const handleChangeEmail = (newEmail: string, verificationCode: string) => {
        changeEmail(
            { newEmail, verificationCode },
            {
                onSuccess: () => toast.success(t('settings.emailChanged')),
                onError: (err) => {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : undefined
                    toast.error(message || t('settings.emailChangeFailed'))
                },
            },
        )
    }

    const handleChangePassword = (
        currentPassword: string,
        newPassword: string,
    ) => {
        changePassword(
            { currentPassword, newPassword },
            {
                onSuccess: () => toast.success(t('settings.passwordChanged')),
                onError: (err) => {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : undefined
                    toast.error(message || t('settings.passwordChangeFailed'))
                },
            },
        )
    }

    return (
        <Flex
            width="100%"
            padding="3rem 1.5rem 4rem"
            style={{ minHeight: 'calc(100vh - 4rem)' }}
        >
            <Flex
                direction="column"
                gap="0"
                width="100%"
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <PageTitle>{t('settings.title')}</PageTitle>

                <Flex gap="2.5rem" align="stretch">
                    <CategoryLabel>{t('settings.profileSettings')}</CategoryLabel>
                    <Flex flex={1} direction="column" style={{ minWidth: 0 }}>
                        <Flex direction="column" gap="1rem">
                            <SectionTitle>{t('settings.profileImage')}</SectionTitle>
                            <ProfileImageUpload
                                avatarUrl={avatarUrl}
                                onChange={setAvatarUrl}
                                size={100}
                            />
                        </Flex>
                        <Divider />
                        <Flex direction="column" gap="1rem">
                            <SectionTitle>{t('settings.nickname')}</SectionTitle>
                            <Input
                                placeholder={t('settings.nicknamePlaceholder')}
                                value={nickname}
                                count={nickname.length}
                                maxCount={15}
                                onChange={(e) =>
                                    setNickname(e.target.value.slice(0, 15))
                                }
                            />
                        </Flex>
                        <Divider />
                        <Flex direction="column" gap="1rem">
                            <SectionTitle>{t('auth.profileAgePlaceholder')}</SectionTitle>
                            <Input
                                placeholder={t('auth.profileAgePlaceholder')}
                                type="number"
                                min="1"
                                max="150"
                                value={age}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setAge(value)
                                    }
                                }}
                            />
                        </Flex>
                        <Divider />
                        <SettingsPinSection
                            pin={pin}
                            onChange={setPin}
                            onDelete={handleDeletePin}
                            isDeleting={isUpdating}
                        />
                        <Divider />
                        <SettingsThemeSection
                            themePreference={themePreference}
                            onSelect={setThemePreference}
                        />
                        <Divider />
                        <Flex justify="flex-end">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSave}
                                disabled={isUpdating}
                            >
                                {t('common.save')}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>

                {isOwner && (
                    <>
                        <GroupDivider />

                        <Flex gap="2.5rem" align="stretch">
                            <CategoryLabel>{t('settings.accountSecurity')}</CategoryLabel>
                            <Flex flex={1} direction="column" style={{ minWidth: 0 }}>
                                <SettingsEmailSection
                                    onSendCode={handleSendEmailCode}
                                    onVerify={handleChangeEmail}
                                    isSending={isSendingEmail}
                                    isVerifying={isChangingEmail}
                                />
                                <Divider />
                                <SettingsPasswordSection
                                    onSubmit={handleChangePassword}
                                    isLoading={isChangingPassword}
                                />
                            </Flex>
                        </Flex>

                        <GroupDivider />

                        <Flex gap="2.5rem" align="stretch">
                            <CategoryLabel danger>{t('settings.dangerZone')}</CategoryLabel>
                            <Flex flex={1} direction="column" style={{ minWidth: 0 }}>
                                <SettingsAccountSection
                                    onDelete={handleDeleteAccount}
                                    isDeleting={isDeletingAccount}
                                />
                                <Divider />
                                <SettingsDangerSection
                                    profiles={profiles}
                                    onDelete={handleDeleteProfile}
                                    isDeleting={isDeleting}
                                />
                            </Flex>
                        </Flex>
                    </>
                )}
            </Flex>
        </Flex>
    )
}

export default SettingsContainer

const PageTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${themedPalette.text1};
    margin: 0 0 2.5rem;
`

const CategoryLabel = styled.div<{ danger?: boolean }>`
    width: 100px;
    flex-shrink: 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: ${({ danger }) =>
        danger ? themedPalette.destructive1 : themedPalette.text3};
    padding-top: 0.2rem;
    letter-spacing: 0.03em;
`

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${themedPalette.text1};
    margin: 0;
`

const Divider = styled.div`
    height: 1px;
    background-color: ${themedPalette.border2};
    opacity: 0.5;
    margin: 1.75rem 0;
`

const GroupDivider = styled.div`
    height: 1px;
    background-color: ${themedPalette.border2};
    margin: 3rem 0;
`
