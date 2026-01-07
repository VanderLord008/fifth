/**
 * 🌫️ Ground Mist - Atmospheric fog effect at ground level
 * Creates mysterious depth for the castle gate scene
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Mist layer component
function MistLayer({ y = 0, opacity = 0.3, speed = 0.1, scale = 1 }) {
    const meshRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;
            // Gentle undulating motion
            meshRef.current.position.y = y + Math.sin(time * speed + phase) * 0.3;
            meshRef.current.material.opacity = opacity * (0.7 + 0.3 * Math.sin(time * 0.2 + phase));
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
            <planeGeometry args={[80 * scale, 80 * scale]} />
            <meshStandardMaterial
                color="#a5b4fc"
                transparent
                opacity={opacity}
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </mesh>
    );
}

export default function GroundMist() {
    return (
        <group>
            {/* Multiple mist layers for depth */}
            <MistLayer y={-8} opacity={0.25} speed={0.08} scale={1.5} />
            <MistLayer y={-6} opacity={0.2} speed={0.1} scale={1.2} />
            <MistLayer y={-4} opacity={0.15} speed={0.12} scale={1} />
            <MistLayer y={-2} opacity={0.1} speed={0.15} scale={0.8} />
        </group>
    );
}
