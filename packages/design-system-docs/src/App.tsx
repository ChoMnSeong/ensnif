import { DesignSystemProvider } from '@ensnif/design-system'
import { Layout } from './layout/Layout'
import { useRouter } from './router/useRouter'
import { routeMap } from './router/routes'

export const App = () => {
    const { route, setRoute } = useRouter()
    const meta = routeMap[route]
    const Page = meta.page

    return (
        <DesignSystemProvider
            palette="lavender"
            variant="minimal"
            mode="light"
            applyTo="root"
        >
            <Layout route={route} onNavigate={setRoute}>
                <Page />
            </Layout>
        </DesignSystemProvider>
    )
}
