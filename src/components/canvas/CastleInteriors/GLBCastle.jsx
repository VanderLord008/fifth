/**
 * 🏰 GLB Castle - Uses the provided Castle.glb model
 * A pre-made castle model from the models folder
 * With debug logging to identify mesh names
 */

import { useRef, Suspense, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useControls, folder } from 'leva';

// Model path with base URL for GitHub Pages
const CASTLE_MODEL_PATH = `${import.meta.env.BASE_URL}models/Castle.glb`;

function CastleModel({ position, rotation, scale }) {
    const groupRef = useRef();
    const { scene } = useGLTF(CASTLE_MODEL_PATH);

    // Debug: Log all mesh names on load
    useEffect(() => {
        console.log('=== Castle.glb Model Structure ===');
        console.log('Looking for clouds and other meshes...\n');

        scene.traverse((child) => {
            if (child.isMesh) {
                console.log(`📦 MESH: "${child.name}"`);
            } else if (child.name) {
                console.log(`📁 GROUP: "${child.name}"`);
            }
        });

        console.log('\n=== End of Castle.glb ===\n');
    }, [scene]);

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            <primitive object={scene.clone()} />
        </group>
    );
}

export default function GLBCastle({ onProjectSelect }) {
    // Leva controls for positioning
    const { posX, posY, posZ, rotX, rotY, rotZ, castleScale } = useControls('GLB Castle', {
        position: folder({
            posX: { value: 0, min: -50, max: 50, step: 0.5 },
            posY: { value: 0, min: -20, max: 20, step: 0.5 },
            posZ: { value: 0, min: -50, max: 50, step: 0.5 },
        }),
        rotation: folder({
            rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        }),
        castleScale: { value: 1, min: 0.1, max: 10, step: 0.1 },
    });

    return (
        <group>
            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#1a3a1a" roughness={0.9} />
            </mesh>

            {/* Castle model */}
            <Suspense fallback={null}>
                <CastleModel
                    position={[posX, posY, posZ]}
                    rotation={[rotX, rotY, rotZ]}
                    scale={castleScale}
                />
            </Suspense>

            {/* Lighting */}
            <ambientLight intensity={0.5} color="#ffffff" />
            <directionalLight position={[20, 30, 10]} intensity={1.5} color="#ffeedd" castShadow />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="#88aaff" distance={50} />

            {/* Sky color */}
            <mesh position={[0, 50, 0]}>
                <sphereGeometry args={[100, 32, 32]} />
                <meshBasicMaterial color="#1a1a2e" side={2} />
            </mesh>
        </group>
    );
}

// Preload the model
useGLTF.preload(CASTLE_MODEL_PATH);
