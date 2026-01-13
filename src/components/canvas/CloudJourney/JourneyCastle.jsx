/**
 * 🏰 GLB Castle for Journey Scene - Uses the provided Castle.glb model
 * Positioned at the end of the cloud journey
 */

import { useRef, Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useControls, folder } from 'leva';

// Model path with base URL for GitHub Pages
const CASTLE_MODEL_PATH = `${import.meta.env.BASE_URL}models/Castle.glb`;

export default function JourneyCastle({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
    const groupRef = useRef();
    const { scene } = useGLTF(CASTLE_MODEL_PATH);

    // Leva controls for fine-tuning
    const { offsetX, offsetY, offsetZ, rotY, castleScale } = useControls('Journey Castle', {
        position: folder({
            offsetX: { value: -2.5, min: -20, max: 20, step: 0.5 },
            offsetY: { value: 15.5, min: -20, max: 30, step: 0.5 },
            offsetZ: { value: -3.5, min: -20, max: 20, step: 0.5 },
        }),
        rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        castleScale: { value: 1.8, min: 0.1, max: 5, step: 0.1 },
    });

    // Clone scene to avoid mutation issues
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Gentle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            groupRef.current.position.y = position[1] + offsetY + Math.sin(time * 0.3) * 0.2;
        }
    });

    return (
        <group
            ref={groupRef}
            position={[position[0] + offsetX, position[1] + offsetY, position[2] + offsetZ]}
            rotation={[rotation[0], rotation[1] + rotY, rotation[2]]}
            scale={scale * castleScale}
        >
            <primitive object={clonedScene} />
        </group>
    );
}

useGLTF.preload(CASTLE_MODEL_PATH);
