/**
 * 🏰 Castle Preview Scene - Test all castle options
 * Use Leva to switch between HogwartsGreatHall, GringottsVault, DiagonAlley, and GLBCastle
 */

import { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { useControls } from 'leva';

import { HogwartsGreatHall, GringottsVault, DiagonAlley, GLBCastle } from './CastleInteriors';

// Castle type options
const CASTLE_OPTIONS = {
    GLB_CASTLE: 'GLB Castle Model',
    HOGWARTS: 'Hogwarts Great Hall',
    GRINGOTTS: 'Gringotts Vault',
    DIAGON: 'Diagon Alley',
};

function CastleScene() {
    const [selectedProject, setSelectedProject] = useState(null);

    // Leva controls to switch between castle types
    const { castleType, showStats, cameraHeight, cameraDistance } = useControls('Castle Preview', {
        castleType: {
            value: CASTLE_OPTIONS.GLB_CASTLE,
            options: Object.values(CASTLE_OPTIONS),
        },
        showStats: false,
        cameraHeight: { value: 5, min: 0, max: 20, step: 1 },
        cameraDistance: { value: 25, min: 5, max: 100, step: 1 },
    });

    const handleProjectSelect = useCallback((project) => {
        setSelectedProject(project);
        console.log('Selected project:', project);
    }, []);

    // Render the selected castle
    const renderCastle = () => {
        switch (castleType) {
            case CASTLE_OPTIONS.GLB_CASTLE:
                return <GLBCastle onProjectSelect={handleProjectSelect} />;
            case CASTLE_OPTIONS.HOGWARTS:
                return <HogwartsGreatHall onProjectSelect={handleProjectSelect} />;
            case CASTLE_OPTIONS.GRINGOTTS:
                return <GringottsVault onProjectSelect={handleProjectSelect} />;
            case CASTLE_OPTIONS.DIAGON:
                return <DiagonAlley onProjectSelect={handleProjectSelect} />;
            default:
                return <GLBCastle onProjectSelect={handleProjectSelect} />;
        }
    };

    return (
        <>
            {showStats && <Stats />}

            {/* Camera controls */}
            <OrbitControls
                target={[0, cameraHeight, 0]}
                maxPolarAngle={Math.PI * 0.85}
                minDistance={5}
                maxDistance={100}
            />

            {/* Selected castle */}
            <Suspense fallback={null}>
                {renderCastle()}
            </Suspense>

            {/* Project selection display */}
            {selectedProject && (
                <group position={[0, 15, 0]}>
                    {/* This would be a modal/popup in the actual app */}
                </group>
            )}
        </>
    );
}

export default function CastlePreviewScene() {
    return (
        <Canvas
            camera={{ position: [0, 10, 50], fov: 60 }}
            style={{ width: '100%', height: '100vh' }}
        >
            <CastleScene />
        </Canvas>
    );
}
