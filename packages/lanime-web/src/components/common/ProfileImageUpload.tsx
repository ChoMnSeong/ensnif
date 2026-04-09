import React, { useRef } from 'react'
import styled from '@emotion/styled'
import { toast } from 'sonner'
import { themedPalette } from '@libs/style/theme'
import { useImageMutation } from '@libs/apis/images'
import { useTranslation } from 'react-i18next'

interface ProfileImageUploadProps {
    avatarUrl: string
    onChange: (url: string) => void
    size?: number
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    avatarUrl,
    onChange,
    size = 100,
}) => {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutate: uploadImage, isPending: isUploading } = useImageMutation()

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        uploadImage(file, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    onChange(res.data)
                    toast.success(t('image.uploadSuccess'))
                }
            },
            onError: () => {
                toast.error(t('image.uploadFailed'))
            },
        })
    }

    return (
        <>
            <ImageWrapper size={size} onClick={handleClick}>
                <img
                    src={avatarUrl}
                    alt="profile"
                    style={{ opacity: isUploading ? 0.5 : 1 }}
                />
                <EditOverlay>
                    {isUploading ? t('image.uploading') : t('common.edit')}
                </EditOverlay>
            </ImageWrapper>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
        </>
    )
}

export default ProfileImageUpload

const ImageWrapper = styled.div<{ size: number }>`
    position: relative;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid ${themedPalette.border2};
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const EditOverlay = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: ${themedPalette.white};
    text-align: center;
    padding: 5px 0;
    font-size: 0.75rem;
`
