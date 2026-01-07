import { Suspense, useState } from 'react';
import FloatingIsland from './FloatingIsland';
import Castle from './Castle';
import Gate from './Gate';
import NameBoard from './NameBoard';
import MagicParticles from './MagicParticles';
import WizardCat from '../Characters/WizardCat';
import usePortfolioStore from '../../store/usePortfolioStore';

/**
 * CastleScene - Orchestrates the castle entrance scene
 * Composes island, castle, gate, name board, cat, and particles
 */
export default function CastleScene() {
    const toggleResume = usePortfolioStore((state) => state.toggleResume);
    const [gateOpened, setGateOpened] = useState(false);

    const handleGateOpen = () => {
        setGateOpened(true);
        // Delay modal slightly for dramatic effect
        setTimeout(() => {
            toggleResume();
        }, 500);
    };

    return (
        <Suspense fallback={null}>
            <group>
                {/* Floating Island Base */}
                <FloatingIsland position={[0, -5, 0]} scale={1.5} />

                {/* Castle Structure (on top of island) */}
                <Castle position={[0, 2, -3]} />

                {/* Animated Gate (in castle archway) */}
                <Gate position={[0, 2, -2.5]} onOpen={handleGateOpen} />

                {/* Name Board (in front of gate) */}
                <NameBoard
                    position={[0, 4, 3]}
                    name="VAIBHAV BAHADUR"
                    subtitle="Software Engineer"
                />

                {/* Wizard Cat (beside the entrance) */}
                <WizardCat position={[3.5, 2.5, 1]} scale={0.8} />

                {/* Ambient Magic Particles */}
                <MagicParticles
                    count={40}
                    bounds={{ x: 12, y: 8, z: 12 }}
                    position={[0, 5, 0]}
                />

                {/* Scene Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={0.8}
                    color="#ffeedd"
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-far={50}
                    shadow-camera-left={-15}
                    shadow-camera-right={15}
                    shadow-camera-top={15}
                    shadow-camera-bottom={-15}
                />
                <pointLight position={[0, 8, 5]} intensity={0.5} color="#a29bfe" />

                {/* Fog for depth */}
                <fog attach="fog" args={['#1a1a2e', 15, 60]} />
            </group>
        </Suspense>
    );
}
