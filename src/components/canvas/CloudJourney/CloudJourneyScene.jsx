/**
 * ☁️ Cloud Journey Scene - Main orchestrator for the cloud flight experience
 * Combines gradient sky, volumetric clouds, and camera animation
 */

import { useRef, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { Fog } from '@react-three/drei';

import usePortfolioStore, { SCENES } from '../../../stores/portfolioStore';

import GradientSky from './GradientSky';
import VolumetricClouds from './VolumetricClouds';
import CameraPath from './CameraPath';
import MagicalParticles from '../../effects/MagicalParticles';

export default function CloudJourneyScene() {
    const { scene } = useThree();
    const setScene = usePortfolioStore((state) => state.setScene);
    const [journeyComplete, setJourneyComplete] = useState(false);

    // Handle journey completion
    const handleJourneyComplete = useCallback(() => {
        setJourneyComplete(true);

        // Transition to castle gate scene
        setTimeout(() => {
            setScene(SCENES.CASTLE_GATE);
        }, 500);
    }, [setScene]);

    return (
        <group>
            {/* Gradient Sky Background */}
            <GradientSky
                topColor="#0f0a1e"      // Deep night purple
                middleColor="#ff7043"   // Warm sunset orange
                bottomColor="#1a0f2e"   // Dark purple
                exponent={0.5}
            />

            {/* Fog for depth and atmosphere */}
            <fog attach="fog" args={['#2d1b4e', 20, 150]} />

            {/* Volumetric Cloud System */}
            <VolumetricClouds />

            {/* Camera Flight Animation */}
            <CameraPath
                duration={10}
                startDelay={0.5}
                onJourneyComplete={handleJourneyComplete}
            />

            {/* Magical sparkle particles */}
            <MagicalParticles
                count={100}
                radius={50}
                color="#ffd700"
                size={0.08}
                speed={0.3}
                opacity={0.7}
            />

            {/* Blue accent particles */}
            <MagicalParticles
                count={60}
                radius={40}
                color="#00d4ff"
                size={0.06}
                speed={0.2}
                opacity={0.5}
            />

            {/* Ambient lighting */}
            <ambientLight intensity={0.4} color="#ffeedd" />

            {/* Sun/horizon glow light */}
            <directionalLight
                position={[0, 0, -100]}
                intensity={1}
                color="#ff8c42"
            />

            {/* Cool sky light from above */}
            <directionalLight
                position={[0, 50, 0]}
                intensity={0.3}
                color="#6366f1"
            />
        </group>
    );
}
