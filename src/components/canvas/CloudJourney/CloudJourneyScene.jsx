/**
 * ☁️ Cloud Journey Scene - FRESH START
 * Simple scene: clouds + castle + camera flight
 */

import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

import usePortfolioStore, { SCENES } from '../../../stores/portfolioStore';

import MysticalSky from './MysticalSky';
import GLBCloudField from './GLBCloudField';
import MagicalParticles from '../../effects/MagicalParticles';

// Import Castle Gate components
import {
    FloatingCandles,
    MarmaladeCat,
    ParchmentBanner,
    GroundMist,
    PotterCastle,
    PotterIsland,
    PotterGate
} from '../CastleGate';

// Simple camera that flies forward and stops
function FlightCamera({ duration = 6, onComplete }) {
    const { camera } = useThree();
    const progress = useRef(0);
    const completed = useRef(false);

    useEffect(() => {
        // Start position
        camera.position.set(0, 5, 0);
        camera.lookAt(0, 5, 50);
    }, [camera]);

    useFrame((state, delta) => {
        if (completed.current) return;

        progress.current += delta / duration;
        const t = Math.min(progress.current, 1);

        // Simple smooth easing
        const eased = t * t * (3 - 2 * t);

        // Fly from z=0 to z=230 (castle is at z=260)
        const z = eased * 230;
        const y = 5 + Math.sin(t * Math.PI) * 2;

        camera.position.set(0, y, z);
        camera.lookAt(0, 4, z + 50);

        if (t >= 1 && !completed.current) {
            completed.current = true;
            // Final position looking at castle (z=260)
            camera.position.set(0, 5, 230);
            camera.lookAt(0, 3, 260);
            if (onComplete) onComplete();
        }
    });

    return null;
}

export default function CloudJourneyScene() {
    const setScene = usePortfolioStore((state) => state.setScene);
    const [journeyComplete, setJourneyComplete] = useState(false);

    // DEBUG: Castle position and rotation
    const castle = useControls('Castle', {
        posX: { value: 0, min: -50, max: 50, step: 1 },
        posY: { value: 1, min: -20, max: 20, step: 1 },
        posZ: { value: 250, min: 200, max: 350, step: 5 },
        rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
        rotY: { value: Math.PI, min: -Math.PI, max: Math.PI, step: 0.1 },
        rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    });

    const handleJourneyComplete = useCallback(() => {
        setJourneyComplete(true);
    }, []);

    const handleEnter = useCallback(() => {
        setScene(SCENES.GREAT_HALL);
    }, [setScene]);

    return (
        <group>
            {/* Sky */}
            <MysticalSky />

            {/* Fog */}
            <fog attach="fog" args={['#1a1a2e', 50, 350]} />

            {/* Clouds */}
            <Suspense fallback={null}>
                <GLBCloudField />
            </Suspense>

            {/* Castle - at the end of the journey */}
            <group
                position={[castle.posX, castle.posY, castle.posZ]}
                rotation={[castle.rotX, castle.rotY, castle.rotZ]}
            >
                <GroundMist />
                <PotterIsland position={[0, -5, 0]} scale={1.5} />
                <PotterCastle position={[0, 2, 0]} />
                <PotterGate position={[0, 2, 3]} onOpen={handleEnter} />
                <FloatingCandles />
                <MarmaladeCat position={[4, 2, 4]} onClick={handleEnter} />
                <ParchmentBanner
                    position={[-4, 3, 4]}
                    name="Vaibhav Sharma"
                    title="Web Developer"
                    onClick={handleEnter}
                />
            </group>

            {/* Camera flight */}
            <FlightCamera duration={6} onComplete={handleJourneyComplete} />

            {/* OrbitControls - only after journey */}
            {journeyComplete && (
                <OrbitControls
                    target={[castle.posX, castle.posY + 3, castle.posZ]}
                    enableDamping
                    dampingFactor={0.05}
                />
            )}

            {/* Lighting */}
            <ambientLight intensity={0.4} color="#c7d2fe" />
            <directionalLight position={[10, 40, 50]} intensity={1.2} color="#e0e7ff" />
            <pointLight position={[0, 10, 280]} intensity={1.5} color="#6366f1" distance={100} />
        </group>
    );
}
