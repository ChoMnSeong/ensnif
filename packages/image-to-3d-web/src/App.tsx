import { useState } from 'react'
import { ModelViewer } from './components/ModelViewer'
import { ControlPanel } from './components/ControlPanel'

export const App = () => {
    const [glbUrl, setGlbUrl] = useState<string | undefined>()

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
                <ModelViewer url={glbUrl} />
            </div>
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                <ControlPanel onLoadGlb={setGlbUrl} />
            </div>
        </div>
    )
}
