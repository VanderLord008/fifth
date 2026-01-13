/**
 * ☁️ Cloud Journey Scene - FRESH START
 * Simple scene: clouds + castle + camera flight
 */

import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls, button, folder } from 'leva';

import usePortfolioStore, { SCENES } from '../../../stores/portfolioStore';

import MysticalSky from './MysticalSky';
import GLBCloudField from './GLBCloudField';
import CastleClouds from './CastleClouds';
import JourneyCastle from './JourneyCastle';
import MagicalParticles from '../../effects/MagicalParticles';

// Import Castle Gate components
import {
    FloatingCandles,
    PirateCat,
    ParchmentBanner,
    GroundMist,
    PotterCastle,
    PotterIsland,
    PotterGate,
    MagicalScroll
} from '../CastleGate';

// Camera that flies forward and stops at the castle gate
function FlightCamera({ duration = 6, onComplete, onPositionUpdate }) {
    const { camera } = useThree();
    const progress = useRef(0);
    const completed = useRef(false);
    const [restartTrigger, setRestartTrigger] = useState(0);

    // Leva controls for flight path - more options
    const {
        flightDuration,
        startY, startZ,
        endX, endY, endZ,
        arcHeight,
        lookX, lookY, lookZ
    } = useControls('Flight Camera', {
        flightDuration: { value: 2, min: 1, max: 15, step: 0.5 },
        'Start Position': folder({
            startY: { value: 5, min: 0, max: 20, step: 0.5 },
            startZ: { value: 0, min: -50, max: 50, step: 1 },
        }),
        'End Position': folder({
            endX: { value: 0, min: -20, max: 20, step: 0.5 },
            endY: { value: 4, min: 0, max: 20, step: 0.5 },
            endZ: { value: 237, min: 200, max: 280, step: 1 },
        }),
        arcHeight: { value: 4, min: 0, max: 10, step: 0.5, label: 'Arc Height' },
        'Look At': folder({
            lookX: { value: 0, min: -20, max: 20, step: 0.5 },
            lookY: { value: 4, min: 0, max: 15, step: 0.5 },
            lookZ: { value: 260, min: 230, max: 300, step: 1 },
        }),
        'Restart Flight': button(() => {
            progress.current = 0;
            completed.current = false;
            setRestartTrigger(prev => prev + 1);
        }),
    });

    useEffect(() => {
        // Start position
        camera.position.set(0, startY, startZ);
        camera.lookAt(0, startY, startZ + 50);
    }, [camera, restartTrigger, startY, startZ]);

    useFrame((state, delta) => {
        if (completed.current) return;

        progress.current += delta / flightDuration;
        const t = Math.min(progress.current, 1);

        // Smooth easing (ease-in-out)
        const eased = t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Interpolate position
        const x = endX * eased;
        const z = startZ + (endZ - startZ) * eased;
        const y = startY + (endY - startY) * eased + Math.sin(eased * Math.PI) * arcHeight;

        camera.position.set(x, y, z);

        // Smoothly interpolate look target
        const currentLookX = lookX * eased;
        const currentLookY = startY + (lookY - startY) * eased;
        const currentLookZ = z + 50 * (1 - eased) + lookZ * eased;
        camera.lookAt(currentLookX, currentLookY, Math.min(currentLookZ, lookZ));

        if (t >= 1 && !completed.current) {
            completed.current = true;
            // Set final position exactly to match OrbitControls target
            camera.position.set(endX, endY, endZ);
            camera.lookAt(lookX, lookY, lookZ);
            if (onComplete) onComplete();
        }
    });

    return null;
}



export default function CloudJourneyScene() {
    const setScene = usePortfolioStore((state) => state.setScene);
    const [journeyComplete, setJourneyComplete] = useState(false);
    const [scrollOpen, setScrollOpen] = useState(false);
    const [useCastleClouds, setUseCastleClouds] = useState(true); // Use castle clouds by default

    // Castle position (hardcoded now, no debugger)
    const castlePos = { x: 0, y: 1, z: 250 };
    const castleRot = { x: 0, y: Math.PI, z: 0 };

    const handleJourneyComplete = useCallback(() => {
        setJourneyComplete(true);
    }, []);

    const handleEnter = useCallback(() => {
        setScene(SCENES.GREAT_HALL);
    }, [setScene]);

    // Open scroll when banner button is clicked
    const handleOpenScroll = useCallback(() => {
        setScrollOpen(true);
    }, []);

    // Close scroll
    const handleCloseScroll = useCallback(() => {
        setScrollOpen(false);
    }, []);

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

            {/* Castle - GLB model at the end of the journey */}
            <group
                position={[castlePos.x, castlePos.y, castlePos.z]}
                rotation={[castleRot.x, castleRot.y, castleRot.z]}
            >
                <Suspense fallback={null}>
                    <JourneyCastle position={[0, 0, 0]} scale={1} />
                </Suspense>
                <PirateCat onClick={handleEnter} />
                <ParchmentBanner
                    name="Vaibhab Tiwari"
                    title="Web Developer"
                    onClick={handleOpenScroll}
                />
            </group>

            {/* Magical Resume Scroll - positioned in front of castle */}
            <MagicalScroll isOpen={scrollOpen} onClose={handleCloseScroll} castlePosition={[castlePos.x, castlePos.y, castlePos.z]} />

            {/* Camera flight */}
            <FlightCamera duration={6} onComplete={handleJourneyComplete} />

            {/* OrbitControls - only after journey and when scroll is closed */}
            {journeyComplete && !scrollOpen && (
                <OrbitControls
                    target={[castlePos.x, castlePos.y + 3, castlePos.z]}
                    enableDamping
                    dampingFactor={0.05}
                />
            )}

            {/* Lighting */}
            <ambientLight intensity={0.8} color="#c7d2fe" />
            <directionalLight position={[10, 40, 50]} intensity={2.0} color="#e0e7ff" />
            <pointLight position={[0, 10, 280]} intensity={3.0} color="#818cf8" distance={150} />
        </group>
    );
}
