/**
 * 🏰 Castle Hall Scene - Portal gallery
 * Simplified scene with OrbitControls
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PortalGallery from '../Portals/PortalGallery';

export default function CastleHallScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{ width: '100%', height: '100vh' }}
        >
            <color attach="background" args={['#1a1a2e']} />

            <Suspense fallback={null}>
                <PortalGallery />
            </Suspense>

            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                maxDistance={15}
                minDistance={3}
            />
        </Canvas>
    );
}
