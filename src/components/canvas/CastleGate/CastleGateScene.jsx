/**
 * 🏰 Castle Gate Scene - Main orchestrator for the arrival scene
 * Combines all components into the magical entrance experience
 */

import { useCallback, Suspense } from 'react';
import { useThree } from '@react-three/fiber';

import usePortfolioStore, { SCENES } from '../../../stores/portfolioStore';

// Scene components
import FloatingCastle from './FloatingCastle';
import GateArchway from './GateArchway';
import FloatingCandles from './FloatingCandles';
import PirateCat from './PirateCat';
import ParchmentBanner from './ParchmentBanner';
import GroundMist from './GroundMist';

// Reuse the night sky from CloudJourney
import MysticalSky from '../CloudJourney/MysticalSky';

// Effects
import MagicalParticles from '../../effects/MagicalParticles';

export default function CastleGateScene() {
    const setScene = usePortfolioStore((state) => state.setScene);
    const { camera } = useThree();

    // Initial camera setup
    camera.position.set(0, 2, 15);
    camera.lookAt(0, 2, 0);

    // Handle entering the portal
    const handleEnter = useCallback(() => {
        // Transition to Great Hall
        setScene(SCENES.GREAT_HALL);
    }, [setScene]);

    return (
        <group>
            {/* Night sky background */}
            <Suspense fallback={null}>
                <MysticalSky />
            </Suspense>

            {/* Atmospheric fog */}
            <fog attach="fog" args={['#1a1a2e', 20, 80]} />

            {/* Ground mist effect */}
            <GroundMist />

            {/* Floating castle in the background */}
            <FloatingCastle />

            {/* Gate archway - main entrance */}
            <GateArchway onClick={handleEnter} />

            {/* Floating candles */}
            <FloatingCandles />

            {/* Pirate cat mascot */}
            <PirateCat
                position={[-4, -1.5, 4]}
                scale={2}
                onClick={handleEnter}
            />

            {/* Parchment banner with info - position controlled by Leva debug panel */}
            <ParchmentBanner
                name="Vaibhab Tiwari"
                title="Web Developer & 3D Enthusiast"
                tagline="Creating magical digital experiences"
                onClick={handleEnter}
            />

            {/* Magical particles */}
            <MagicalParticles
                count={100}
                radius={30}
                color="#a78bfa"
                size={0.08}
                speed={0.3}
                opacity={0.7}
            />
            <MagicalParticles
                count={60}
                radius={25}
                color="#fbbf24"
                size={0.06}
                speed={0.25}
                opacity={0.6}
            />

            {/* Lighting Setup */}

            {/* Ambient - moonlit blue */}
            <ambientLight intensity={0.3} color="#c7d2fe" />

            {/* Main moonlight from above */}
            <directionalLight
                position={[10, 30, -20]}
                intensity={0.8}
                color="#e0e7ff"
                castShadow
            />

            {/* Warm accent light from candles area */}
            <pointLight
                position={[0, 6, 0]}
                intensity={1.5}
                color="#fbbf24"
                distance={20}
            />

            {/* Purple magical glow from gate */}
            <pointLight
                position={[0, 3, 1]}
                intensity={1.2}
                color="#8b5cf6"
                distance={15}
            />

            {/* Rim light behind castle */}
            <pointLight
                position={[0, 15, 40]}
                intensity={2}
                color="#6366f1"
                distance={60}
            />

            {/* Ground plane for reference */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#1e1b4b"
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </group>
    );
}
