/**
 * 🐱 Marmalade Cat - Chubby orange cat mascot with wizard hat
 * Interactive with idle animations
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MarmaladeCat({ position = [-5, -1.5, 3], onClick }) {
    const groupRef = useRef();
    const bodyRef = useRef();
    const headRef = useRef();
    const tailRef = useRef();
    const leftEarRef = useRef();
    const rightEarRef = useRef();
    const leftEyeRef = useRef();
    const rightEyeRef = useRef();

    const [isHovered, setIsHovered] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const lastBlink = useRef(0);
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Breathing animation (body scale pulse)
        if (bodyRef.current) {
            const breathe = 1 + Math.sin(time * 1.5 + phase) * 0.02;
            bodyRef.current.scale.set(breathe, breathe * 0.98, breathe);
        }

        // Head tilt on hover
        if (headRef.current) {
            const targetRotation = isHovered ? 0.15 : 0;
            headRef.current.rotation.z += (targetRotation - headRef.current.rotation.z) * 0.1;
            // Slight idle bob
            headRef.current.position.y = 0.8 + Math.sin(time * 2 + phase) * 0.03;
        }

        // Tail swishing
        if (tailRef.current) {
            tailRef.current.rotation.z = Math.sin(time * 2) * 0.3;
            tailRef.current.rotation.x = Math.sin(time * 1.5) * 0.1;
        }

        // Ear twitches
        if (leftEarRef.current) {
            leftEarRef.current.rotation.z = -0.2 + Math.sin(time * 4 + 1) * 0.05;
        }
        if (rightEarRef.current) {
            rightEarRef.current.rotation.z = 0.2 + Math.sin(time * 4.5) * 0.05;
        }

        // Blinking logic
        if (time - lastBlink.current > 3 + Math.random() * 2) {
            setIsBlinking(true);
            lastBlink.current = time;
            setTimeout(() => setIsBlinking(false), 150);
        }

        // Eye scaling for blink
        const eyeScale = isBlinking ? 0.1 : 1;
        if (leftEyeRef.current) {
            leftEyeRef.current.scale.y += (eyeScale - leftEyeRef.current.scale.y) * 0.3;
        }
        if (rightEyeRef.current) {
            rightEyeRef.current.scale.y += (eyeScale - rightEyeRef.current.scale.y) * 0.3;
        }
    });

    const catOrange = '#f97316';
    const catDarkOrange = '#ea580c';

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={onClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
        >
            {/* Body - chubby sphere */}
            <mesh ref={bodyRef} position={[0, 0, 0]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial color={catOrange} roughness={0.8} />
            </mesh>

            {/* Head group */}
            <group ref={headRef} position={[0, 0.8, 0.4]}>
                {/* Head sphere */}
                <mesh>
                    <sphereGeometry args={[0.55, 16, 16]} />
                    <meshStandardMaterial color={catOrange} roughness={0.8} />
                </mesh>

                {/* Snout */}
                <mesh position={[0, -0.1, 0.45]}>
                    <sphereGeometry args={[0.2, 12, 12]} />
                    <meshStandardMaterial color="#fed7aa" roughness={0.9} />
                </mesh>

                {/* Nose */}
                <mesh position={[0, -0.05, 0.6]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color="#ec4899" roughness={0.5} />
                </mesh>

                {/* Left eye */}
                <group position={[-0.18, 0.1, 0.4]}>
                    <mesh>
                        <sphereGeometry args={[0.12, 12, 12]} />
                        <meshBasicMaterial color="#1f2937" />
                    </mesh>
                    <mesh ref={leftEyeRef} position={[0.02, 0.02, 0.08]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshBasicMaterial color="white" />
                    </mesh>
                </group>

                {/* Right eye */}
                <group position={[0.18, 0.1, 0.4]}>
                    <mesh>
                        <sphereGeometry args={[0.12, 12, 12]} />
                        <meshBasicMaterial color="#1f2937" />
                    </mesh>
                    <mesh ref={rightEyeRef} position={[0.02, 0.02, 0.08]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshBasicMaterial color="white" />
                    </mesh>
                </group>

                {/* Left ear */}
                <mesh ref={leftEarRef} position={[-0.35, 0.4, -0.1]} rotation={[0, 0, -0.2]}>
                    <coneGeometry args={[0.15, 0.3, 4]} />
                    <meshStandardMaterial color={catOrange} roughness={0.8} />
                </mesh>

                {/* Right ear */}
                <mesh ref={rightEarRef} position={[0.35, 0.4, -0.1]} rotation={[0, 0, 0.2]}>
                    <coneGeometry args={[0.15, 0.3, 4]} />
                    <meshStandardMaterial color={catOrange} roughness={0.8} />
                </mesh>

                {/* Wizard Hat */}
                <group position={[0, 0.5, -0.1]} rotation={[0.2, 0, 0.1]}>
                    {/* Hat base/brim */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.4, 0.45, 0.1, 16]} />
                        <meshStandardMaterial color="#1e1b4b" roughness={0.6} />
                    </mesh>
                    {/* Hat cone */}
                    <mesh position={[0, 0.4, 0]}>
                        <coneGeometry args={[0.35, 0.8, 16]} />
                        <meshStandardMaterial color="#1e1b4b" roughness={0.6} />
                    </mesh>
                    {/* Hat band */}
                    <mesh position={[0, 0.12, 0]}>
                        <cylinderGeometry args={[0.36, 0.36, 0.1, 16]} />
                        <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.3} />
                    </mesh>
                    {/* Star decoration */}
                    <mesh position={[0.25, 0.3, 0.2]}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                        <meshBasicMaterial color="#fef08a" />
                    </mesh>
                </group>
            </group>

            {/* Front paws */}
            <mesh position={[-0.35, -0.6, 0.5]}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshStandardMaterial color={catOrange} roughness={0.8} />
            </mesh>
            <mesh position={[0.35, -0.6, 0.5]}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshStandardMaterial color={catOrange} roughness={0.8} />
            </mesh>

            {/* Back paws */}
            <mesh position={[-0.5, -0.65, -0.3]}>
                <sphereGeometry args={[0.25, 12, 12]} />
                <meshStandardMaterial color={catOrange} roughness={0.8} />
            </mesh>
            <mesh position={[0.5, -0.65, -0.3]}>
                <sphereGeometry args={[0.25, 12, 12]} />
                <meshStandardMaterial color={catOrange} roughness={0.8} />
            </mesh>

            {/* Tail */}
            <group ref={tailRef} position={[0, 0, -0.7]}>
                <mesh position={[0, 0.3, -0.3]} rotation={[0.5, 0, 0]}>
                    <capsuleGeometry args={[0.12, 0.8, 8, 8]} />
                    <meshStandardMaterial color={catDarkOrange} roughness={0.8} />
                </mesh>
                {/* Tail tip */}
                <mesh position={[0, 0.7, -0.6]}>
                    <sphereGeometry args={[0.14, 8, 8]} />
                    <meshStandardMaterial color={catDarkOrange} roughness={0.8} />
                </mesh>
            </group>
        </group>
    );
}
