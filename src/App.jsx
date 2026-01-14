import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import usePortfolioStore, { SCENES } from './stores/portfolioStore'
import './index.css'

// Scene components
import LoadingScene from './components/scenes/LoadingScene'
import { CloudJourneyScene } from './components/canvas/CloudJourney'

// Castle preview - for testing the three castle options
import CastlePreviewScene from './components/canvas/CastlePreviewScene'

// Castle Hall with portals
import { CastleHallScene } from './components/canvas/CastleHall'

// Door Portal scene
import { DoorPortalScene } from './components/canvas/CastleDoor'

// UI components
import LoadingOverlay from './components/ui/LoadingOverlay'

function App() {
  const { currentScene, setScene } = usePortfolioStore()

  // Quick toggle keys
  const handleKeyDown = (e) => {
    if (e.key === 'p' || e.key === 'P') {
      setScene(currentScene === SCENES.CASTLE_PREVIEW ? SCENES.CLOUD_JOURNEY : SCENES.CASTLE_PREVIEW)
    }
    if (e.key === 'h' || e.key === 'H') {
      setScene(currentScene === SCENES.CASTLE_HALL ? SCENES.CLOUD_JOURNEY : SCENES.CASTLE_HALL)
    }
    if (e.key === 'd' || e.key === 'D') {
      setScene(currentScene === SCENES.DOOR_PORTAL ? SCENES.CLOUD_JOURNEY : SCENES.DOOR_PORTAL)
    }
  }

  // Scenes that use their own Canvas
  const separateCanvasScenes = [SCENES.CASTLE_PREVIEW, SCENES.CASTLE_HALL, SCENES.DOOR_PORTAL];
  const usesSeparateCanvas = separateCanvasScenes.includes(currentScene);

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: 'none', width: '100%', height: '100vh' }}>
      {/* Castle Preview Mode - separate canvas */}
      {currentScene === SCENES.CASTLE_PREVIEW && <CastlePreviewScene />}

      {/* Castle Hall with Portals - separate canvas */}
      {currentScene === SCENES.CASTLE_HALL && <CastleHallScene />}

      {/* Door Portal Scene - separate canvas */}
      {currentScene === SCENES.DOOR_PORTAL && <DoorPortalScene />}

      {/* Regular scenes */}
      {!usesSeparateCanvas && (
        <div className="canvas-container">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              {/* Scene content based on currentScene */}
              {currentScene === SCENES.LOADING && <LoadingScene />}

              {/* Cloud Journey now includes Castle Gate */}
              {(currentScene === SCENES.CLOUD_JOURNEY || currentScene === SCENES.CASTLE_GATE) && <CloudJourneyScene />}
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* UI Overlays */}
      <LoadingOverlay />

      {/* Preview mode hint */}
      <div style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: 4,
        fontSize: 12,
        zIndex: 1000,
      }}>
        <strong>P</strong> Castle Preview | <strong>H</strong> Portal Hall | <strong>D</strong> Door Portal
      </div>
    </div>
  )
}

export default App
