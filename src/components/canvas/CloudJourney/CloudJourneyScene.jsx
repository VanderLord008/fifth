/**
 * ☁️ Cloud Journey Scene - FRESH START
 * Simple scene: clouds + castle + camera flight
 */

import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import usePortfolioStore, { SCENES } from '../../../stores/portfolioStore';

import MysticalSky from './MysticalSky';
import GLBCloudField from './GLBCloudField';
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

        // Fly from z=0 to z=230 (castle is at z=250)
        const z = eased * 230;
        const y = 5 + Math.sin(eased * Math.PI) * 2;

        camera.position.set(0, y, z);

        // Interpolate look-ahead distance from 50 to 20 (so at end we look at z=250)
        const lookAhead = 50 - 30 * eased;
        camera.lookAt(0, 4, z + lookAhead);

        if (t >= 1 && !completed.current) {
            completed.current = true;
            if (onComplete) onComplete();
        }
    });

    return null;
}


export default function CloudJourneyScene() {
    const setScene = usePortfolioStore((state) => state.setScene);
    const [journeyComplete, setJourneyComplete] = useState(false);
    const [scrollOpen, setScrollOpen] = useState(false);

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

            {/* Castle - at the end of the journey */}
            <group
                position={[castlePos.x, castlePos.y, castlePos.z]}
                rotation={[castleRot.x, castleRot.y, castleRot.z]}
            >
                <PotterIsland position={[0, -5, 0]} scale={1.5} />
                <PotterCastle position={[0, 2, 0]} />
                <PotterGate position={[0, 2, 3]} onOpen={handleEnter} />
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
