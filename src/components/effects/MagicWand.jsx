/**
 * 🧙‍♂️ Magic Wand - Animated wand with glowing tip
 * Creates a floating wand that casts the spell circle
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WandTip({ intensity = 1 }) {
    const tipRef = useRef();
    const glowRef = useRef();
    const particlesRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (tipRef.current) {
            // Glow pulse
            tipRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.3;
        }

        if (glowRef.current) {
            // Outer glow scale pulse
            const scale = 1 + Math.sin(time * 3) * 0.2;
            glowRef.current.scale.setScalar(scale);
            glowRef.current.material.opacity = 0.3 + Math.sin(time * 4) * 0.1;
        }

        // Animate particles around wand tip
        if (particlesRef.current) {
            particlesRef.current.rotation.y = time * 2;
            particlesRef.current.rotation.z = time * 1.5;
        }
    });

    return (
        <group position={[0, 1.1, 0]}>
            {/* Glowing tip core */}
            <mesh ref={tipRef}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffa500"
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Outer glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial
                    color="#ffd700"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Orbiting particles */}
            <group ref={particlesRef}>
                {[...Array(6)].map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2;
                    const radius = 0.12;
                    return (
                        <mesh
                            key={i}
                            position={[
                                Math.cos(angle) * radius,
                                Math.sin(angle * 2) * 0.05,
                                Math.sin(angle) * radius,
                            ]}
                        >
                            <sphereGeometry args={[0.015, 8, 8]} />
                            <meshBasicMaterial color="#ffd700" />
                        </mesh>
                    );
                })}
            </group>

            {/* Point light from tip */}
            <pointLight
                intensity={intensity * 0.5}
                color="#ffd700"
                distance={2}
                decay={2}
            />
        </group>
    );
}

export default function MagicWand({ position = [-2, 0.5, 1] }) {
    const groupRef = useRef();
    const wandRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (groupRef.current) {
            // Gentle floating motion
            groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
            groupRef.current.position.x = position[0] + Math.cos(time * 0.5) * 0.05;
        }

        if (wandRef.current) {
            // Subtle rotation as if being held
            wandRef.current.rotation.z = Math.sin(time * 0.6) * 0.1 + 0.3;
            wandRef.current.rotation.x = Math.cos(time * 0.4) * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <group ref={wandRef} rotation={[0, 0, 0.3]}>
                {/* Wand handle */}
                <mesh position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.04, 0.05, 0.4, 16]} />
                    <meshStandardMaterial
                        color="#4a3728"
                        roughness={0.8}
                        metalness={0.1}
                    />
                </mesh>

                {/* Decorative ring on handle */}
                <mesh position={[0, -0.1, 0]}>
                    <torusGeometry args={[0.045, 0.01, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        roughness={0.3}
                        metalness={0.8}
                    />
                </mesh>

                {/* Wand shaft */}
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.025, 0.04, 1, 16]} />
                    <meshStandardMaterial
                        color="#5c4033"
                        roughness={0.6}
                        metalness={0.1}
                    />
                </mesh>

                {/* Wand tip section */}
                <mesh position={[0, 0.95, 0]}>
                    <cylinderGeometry args={[0.015, 0.025, 0.2, 16]} />
                    <meshStandardMaterial
                        color="#3d2817"
                        roughness={0.5}
                        metalness={0.2}
                    />
                </mesh>

                {/* Glowing tip */}
                <WandTip intensity={1} />
            </group>
        </group>
    );
}
