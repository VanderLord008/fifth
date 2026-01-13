/**
 * 🏴‍☠️ Pirate Cat - Red-haired pirate cat on a chair GLB model
 * With Leva debug controls for position, rotation, and scale
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useControls, folder } from 'leva';

// Model path with base URL for GitHub Pages
const MODEL_PATH = `${import.meta.env.BASE_URL}models/a_red-haired_pirate_cat_on_a_chair.glb`;

export default function PirateCat({ onClick }) {
    const groupRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    // Leva debug controls
    const { posX, posY, posZ, rotX, rotY, rotZ, catScale } = useControls('Pirate Cat', {
        position: folder({
            posX: { value: -3.9, min: -20, max: 20, step: 0.1 },
            posY: { value: -1.5, min: -10, max: 10, step: 0.1 },
            posZ: { value: -0.5, min: -20, max: 20, step: 0.1 },
        }),
        rotation: folder({
            rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotY: { value: -1.0, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        }),
        catScale: { value: 0.7, min: 0.1, max: 5, step: 0.1 },
    });

    // Load the GLB model
    const { scene } = useGLTF(MODEL_PATH);

    // Gentle idle animation
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            groupRef.current.position.y = posY + Math.sin(time * 0.8) * 0.05;
            const targetRotation = isHovered ? rotY + 0.1 : rotY;
            groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group
            ref={groupRef}
            position={[posX, posY, posZ]}
            rotation={[rotX, rotY, rotZ]}
            scale={catScale}
            onClick={onClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
        >
            <primitive object={scene.clone()} />
            <pointLight position={[0, 2, 1]} intensity={0.5} color="#fbbf24" distance={5} />
        </group>
    );
}

useGLTF.preload(MODEL_PATH);
