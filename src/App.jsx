import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import usePortfolioStore, { SCENES } from './stores/portfolioStore'
import './index.css'

// Scene components
import LoadingScene from './components/scenes/LoadingScene'
import { CloudJourneyScene } from './components/canvas/CloudJourney'

// UI components
import LoadingOverlay from './components/ui/LoadingOverlay'

function App() {
  const { currentScene } = usePortfolioStore()

  return (
    <>
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {/* Scene content based on currentScene */}
            {currentScene === SCENES.LOADING && <LoadingScene />}

            {currentScene === SCENES.CLOUD_JOURNEY && <CloudJourneyScene />}

            {/* Placeholder for Castle Gate scene */}
            {currentScene === SCENES.CASTLE_GATE && (
              <group>
                <color attach="background" args={['#1a0a2e']} />
                <ambientLight intensity={0.5} />
                <mesh>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial color="#ffd700" />
                </mesh>
              </group>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      <LoadingOverlay />
    </>
  )
}

export default App

