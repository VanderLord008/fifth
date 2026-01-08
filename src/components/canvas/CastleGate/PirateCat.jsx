/**
 * 🏴‍☠️ Pirate Cat - Red-haired pirate cat on a chair GLB model
 * No debug controls - hardcoded position from user's settings
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// Model path with base URL for GitHub Pages
const MODEL_PATH = `${import.meta.env.BASE_URL}models/a_red-haired_pirate_cat_on_a_chair.glb`;

export default function PirateCat({ onClick }) {
    const groupRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    // Hardcoded position (from user's manual settings)
    const posX = -7.7;
    const posY = 0.4;
    const posZ = 4.0;
    const rotX = 0;
    const rotY = -1.0;
    const rotZ = 0;
    const catScale = 1.5;

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

