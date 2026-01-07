import { Suspense, useState } from 'react';
import GradientSky, { AtmosFog } from './GradientSky';
import { CloudField } from './AtmosCloud';
import CameraRig from './CameraRig';

// Castle components
import FloatingIsland from '../Castle/FloatingIsland';
import Castle from '../Castle/Castle';
import Gate from '../Castle/Gate';
import NameBoard from '../Castle/NameBoard';
import MagicParticles from '../Castle/MagicParticles';
import WizardCat from '../Characters/WizardCat';

import usePortfolioStore from '../../store/usePortfolioStore';

/**
 * Unified Journey Scene
 * Camera flies through clouds toward the castle on floating island
 * Everything in ONE continuous scene
 */
export default function JourneyScene({ onJourneyComplete }) {
    const [journeyEnded, setJourneyEnded] = useState(false);
    const [journeyProgress, setJourneyProgress] = useState(0);
    const toggleResume = usePortfolioStore((state) => state.toggleResume);

    // Only show castle when journey is past 40% to avoid dark silhouette at start
    const showCastle = journeyProgress > 0.4;

    const handleJourneyComplete = () => {
        setJourneyEnded(true);
        if (onJourneyComplete) {
            onJourneyComplete();
        }
    };

    const handleJourneyProgress = (progress) => {
        setJourneyProgress(progress);
    };

    const handleGateOpen = () => {
        setTimeout(() => {
            toggleResume();
        }, 500);
    };

    return (
        <Suspense fallback={null}>
            {/* ===== SKY & ATMOSPHERE ===== */}
            <GradientSky />
            <AtmosFog />

            {/* ===== LIGHTING ===== */}
            {/* Soft ambient */}
            <ambientLight intensity={0.5} color="#b8a0c8" />

            {/* Warm light from horizon */}
            <directionalLight
                position={[10, -5, -50]}
                intensity={0.8}
                color="#ffd4a0"
            />

            {/* Cool rim light */}
            <directionalLight
                position={[-5, 20, 20]}
                intensity={0.4}
                color="#a0c0ff"
            />

            {/* ===== CLOUDS ===== */}
            {/* Clouds spread throughout the journey path */}
            <CloudField count={40} spread={100} depth={250} />

            {/* ===== CASTLE AT END OF JOURNEY ===== */}
            {/* Only render when camera is close enough to avoid black silhouette */}
            {showCastle && (
                <group position={[0, -8, -140]}>
                    {/* Floating Island */}
                    <FloatingIsland position={[0, 0, 0]} scale={1.8} />

                    {/* Castle on the island */}
                    <Castle position={[0, 7, -3]} />

                    {/* Gate in castle archway */}
                    <Gate position={[0, 7, -2.5]} onOpen={handleGateOpen} />

                    {/* Name Board in front */}
                    <NameBoard
                        position={[0, 9, 4]}
                        name="VAIBHAV BAHADUR"
                        subtitle="Software Engineer"
                    />

                    {/* Wizard Cat */}
                    <WizardCat position={[4.5, 7.5, 2]} scale={0.9} />

                    {/* Magic particles around castle */}
                    <MagicParticles
                        count={50}
                        bounds={{ x: 15, y: 12, z: 15 }}
                        position={[0, 10, 0]}
                    />
                </group>
            )}

            {/* ===== CAMERA ===== */}
            {/* Smooth flight through clouds to castle */}
            {!journeyEnded && (
                <CameraRig
                    onJourneyComplete={handleJourneyComplete}
                    onProgress={handleJourneyProgress}
                    journeyDuration={14}
                />
            )}
        </Suspense>
    );
}
