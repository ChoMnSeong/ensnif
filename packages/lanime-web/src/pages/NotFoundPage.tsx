import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
    const { t } = useTranslation()
    return (
        <div>
            <div>
                <img />
                <div>{t('notFound.goBack')}</div>
            </div>
        </div>
    )
}

export default NotFoundPage
