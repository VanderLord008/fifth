import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import SceneManager from './components/scenes/SceneManager';
import LoadingOverlay from './components/ui/LoadingOverlay';
import './styles/globals.css';

/**
 * Root App Component
 * Harry Potter Themed 3D Portfolio
 *
 * Flow: Loading → Journey (clouds)
 */
function App() {
    return (
        <div className="app-container">
            {/* Main 3D Experience */}
            <Canvas
                camera={{
                    position: [0, 5, 80],
                    fov: 60,
                    near: 0.1,
                    far: 500
                }}
                style={{ background: '#1a1a2e' }}
                gl={{
                    antialias: true,
                    alpha: false,
                    failIfMajorPerformanceCaveat: false,
                }}
                shadows
            >
                <Suspense fallback={null}>
                    <SceneManager />
                </Suspense>
            </Canvas>

            {/* Loading Overlay - HTML overlay on top of Canvas */}
            <LoadingOverlay />
        </div>
    );
}

export default App;
