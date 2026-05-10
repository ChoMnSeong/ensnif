import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

type Props = { url?: string }

export const ModelViewer = ({ url }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneRef = useRef<{
        scene: THREE.Scene
        camera: THREE.PerspectiveCamera
        renderer: THREE.WebGLRenderer
        controls: OrbitControls
        current: THREE.Object3D | null
    } | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0b0d10)

        const pmrem = new THREE.PMREMGenerator(renderer)
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

        const camera = new THREE.PerspectiveCamera(
            45,
            canvas.clientWidth / canvas.clientHeight,
            0.05,
            100,
        )
        camera.position.set(2.2, 1.6, 3.0)

        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.target.set(0, 0.6, 0)

        scene.add(new THREE.AmbientLight(0xffffff, 0.4))
        const key = new THREE.DirectionalLight(0xffffff, 1.4)
        key.position.set(3, 5, 2)
        scene.add(key)
        const rim = new THREE.DirectionalLight(0x88aaff, 0.5)
        rim.position.set(-3, 2, -2)
        scene.add(rim)

        const grid = new THREE.GridHelper(8, 16, 0x444444, 0x222222)
        grid.position.y = -0.001
        scene.add(grid)

        sceneRef.current = { scene, camera, renderer, controls, current: null }

        const onResize = () => {
            const w = canvas.clientWidth
            const h = canvas.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h, false)
        }
        const ro = new ResizeObserver(onResize)
        ro.observe(canvas)

        let raf = 0
        const loop = () => {
            controls.update()
            renderer.render(scene, camera)
            raf = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            renderer.dispose()
            pmrem.dispose()
            sceneRef.current = null
        }
    }, [])

    useEffect(() => {
        const ref = sceneRef.current
        if (!ref || !url) return
        const loader = new GLTFLoader()
        loader.load(
            url,
            (gltf) => {
                if (ref.current) {
                    ref.scene.remove(ref.current)
                    ref.current.traverse((o) => {
                        if ((o as THREE.Mesh).material) {
                            const m = (o as THREE.Mesh).material as THREE.Material
                            m.dispose?.()
                        }
                    })
                }
                ref.current = gltf.scene
                ref.current.traverse((o) => {
                    const mesh = o as THREE.Mesh
                    if (!mesh.isMesh) return
                    const m = mesh.material as THREE.MeshStandardMaterial
                    if (!m.metalnessMap && !m.roughnessMap) {
                        m.metalness = 0.0
                        m.roughness = 0.9
                    }
                    m.side = THREE.DoubleSide
                    if (m.map) m.map.colorSpace = THREE.SRGBColorSpace
                    if (m.emissiveMap) m.emissiveMap.colorSpace = THREE.SRGBColorSpace
                    m.needsUpdate = true
                })
                const box = new THREE.Box3().setFromObject(ref.current)
                const size = box.getSize(new THREE.Vector3()).length()
                const center = box.getCenter(new THREE.Vector3())
                ref.current.position.sub(center)
                if (size > 0) ref.current.scale.setScalar(1.6 / size)
                ref.controls.target.set(0, 0, 0)
                ref.controls.update()
                ref.scene.add(ref.current)
            },
            undefined,
            (e) => console.error('GLB load failed', e),
        )
    }, [url])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}
