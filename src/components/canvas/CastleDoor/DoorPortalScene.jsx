/**
 * 🚪 Door Portal Scene - Test scene for castle door with portal
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { CastleDoorPortal } from '../CastleDoor';

export default function DoorPortalScene() {
    const handleEnterPortal = () => {
        console.log('Entered the portal!');
        // Could transition to another scene here
    };

    return (
        <Canvas
            camera={{ position: [0, 2, 5], fov: 50 }}
            style={{ width: '100%', height: '100vh' }}
        >
            <color attach="background" args={['#0a0a15']} />

            {/* Ambient atmosphere */}
            <fog attach="fog" args={['#0a0a15', 5, 20]} />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 10, 5]} intensity={0.5} />
            <pointLight position={[0, 3, 2]} intensity={0.5} color="#8b5cf6" />

            {/* Sparkles for magical atmosphere */}
            <Sparkles
                count={100}
                size={2}
                position={[0, 2, 0]}
                scale={[6, 4, 6]}
                speed={0.2}
                color="#c084fc"
            />

            <Suspense fallback={null}>
                {/* Castle Door with Portal */}
                <CastleDoorPortal
                    position={[0, 0, 0]}
                    onEnter={handleEnterPortal}
                    colorStart="hotpink"
                    colorEnd="white"
                />

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
                </mesh>

                {/* Simple walls to frame the door */}
                <mesh position={[-2, 1.5, 0]}>
                    <boxGeometry args={[2, 3, 0.3]} />
                    <meshStandardMaterial color="#2d2d44" />
                </mesh>
                <mesh position={[2, 1.5, 0]}>
                    <boxGeometry args={[2, 3, 0.3]} />
                    <meshStandardMaterial color="#2d2d44" />
                </mesh>
            </Suspense>

            <OrbitControls
                enableDamping
                target={[0, 1.5, 0]}
                maxDistance={10}
                minDistance={2}
            />
        </Canvas>
    );
}
