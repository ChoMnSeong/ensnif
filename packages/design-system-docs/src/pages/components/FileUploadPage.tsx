import { useState } from 'react'
import { FileUpload } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const FileUploadPage = () => {
    const [files, setFiles] = useState<File[]>([])
    return (
        <>
            <PageHeader
                eyebrow="Component"
                title="FileUpload"
                description="드래그&드롭 + 클릭 선택. accept, multiple, maxSize 옵션."
            />

            <ComponentPreview
                title="다중 파일"
                code={`<FileUpload value={files} onChange={setFiles} multiple />`}
            >
                <div style={{ width: '100%', maxWidth: '460px' }}>
                    <FileUpload
                        value={files}
                        onChange={setFiles}
                        multiple
                        description="이미지 또는 PDF, 최대 5MB"
                    />
                </div>
            </ComponentPreview>

            <ComponentPreview
                title="이미지 단일"
                code={`<FileUpload
    accept="image/*"
    placeholder="프로필 사진 업로드"
    description="JPG, PNG, WebP"
/>`}
            >
                <div style={{ width: '100%', maxWidth: '460px' }}>
                    <FileUpload
                        accept="image/*"
                        placeholder="프로필 사진 업로드"
                        description="JPG, PNG, WebP"
                    />
                </div>
            </ComponentPreview>
        </>
    )
}
