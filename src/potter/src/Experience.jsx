import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useCallback, useState } from 'react';
import { JourneyScene } from './components/Journey';
import usePortfolioStore from './store/usePortfolioStore';

/**
 * Main 3D Experience Component
 * ONE continuous scene - clouds to castle
 */
const Experience = () => {
    const currentPhase = usePortfolioStore((state) => state.currentPhase);
    const setPhase = usePortfolioStore((state) => state.setPhase);
    const [journeyComplete, setJourneyComplete] = useState(false);

    // Handle journey completion - enable orbit controls
    const handleJourneyComplete = useCallback(() => {
        setJourneyComplete(true);
        setPhase('castle');
    }, [setPhase]);

    return (
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
                {/* Single unified scene - clouds + castle */}
                {(currentPhase === 'journey' || currentPhase === 'castle') && (
                    <>
                        <JourneyScene onJourneyComplete={handleJourneyComplete} />

                        {/* Stars visible in sky */}
                        <Stars
                            radius={400}
                            depth={150}
                            count={2500}
                            factor={4}
                            saturation={0}
                            fade
                            speed={0.3}
                        />
                    </>
                )}

                {/* Default lighting for loading phase */}
                {currentPhase === 'loading' && (
                    <>
                        <ambientLight intensity={0.3} />
                        <directionalLight
                            position={[50, 50, 25]}
                            intensity={0.8}
                            color="#ffeaa7"
                        />
                    </>
                )}

                {/* Orbit controls after journey ends */}
                {journeyComplete && (
                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        minDistance={8}
                        maxDistance={50}
                        maxPolarAngle={Math.PI * 0.85}
                        target={[0, 0, -140]}
                    />
                )}
            </Suspense>
        </Canvas>
    );
};

export default Experience;
