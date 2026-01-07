/**
 * 🧙‍♂️ Spell Circle - Animated magical rune circle
 * Creates a glowing spell circle with rotating runes and progress indicator
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Magical rune characters (using unicode symbols for mystical look)
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ'];

function RuneRing({ radius, runeCount = 12, rotationSpeed = 0.3, color = '#ffd700' }) {
    const groupRef = useRef();

    const runePositions = useMemo(() => {
        return Array.from({ length: runeCount }, (_, i) => {
            const angle = (i / runeCount) * Math.PI * 2;
            return {
                position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
                rotation: angle,
                rune: RUNES[i % RUNES.length],
            };
        });
    }, [radius, runeCount]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.z += delta * rotationSpeed;
        }
    });

    return (
        <group ref={groupRef}>
            {runePositions.map((rune, index) => (
                <Text
                    key={index}
                    position={rune.position}
                    rotation={[0, 0, rune.rotation + Math.PI / 2]}
                    fontSize={0.2}
                    color={color}
                    anchorX="center"
                    anchorY="middle"
                >
                    {rune.rune}
                </Text>
            ))}
        </group>
    );
}

function ProgressRing({ radius, progress, color = '#00d4ff', thickness = 0.08 }) {
    const meshRef = useRef();

    // Create arc geometry based on progress
    const geometry = useMemo(() => {
        const startAngle = -Math.PI / 2; // Start from top
        const endAngle = startAngle + (progress / 100) * Math.PI * 2;

        const shape = new THREE.Shape();
        const outerRadius = radius;
        const innerRadius = radius - thickness;

        // Outer arc
        shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
        // Inner arc (reversed)
        shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
        shape.closePath();

        return new THREE.ShapeGeometry(shape, 64);
    }, [radius, progress, thickness]);

    useFrame((state) => {
        if (meshRef.current) {
            // Pulse effect
            const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
            meshRef.current.material.opacity = 0.6 + pulse * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry} rotation={[0, 0, 0]}>
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function EnergyCore({ progress }) {
    const meshRef = useRef();
    const glowRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (meshRef.current) {
            // Pulsing scale based on progress
            const baseScale = 0.3 + (progress / 100) * 0.3;
            const pulse = Math.sin(time * 4) * 0.05;
            meshRef.current.scale.setScalar(baseScale + pulse);
            meshRef.current.rotation.z = time * 0.5;
            meshRef.current.rotation.x = time * 0.3;
        }

        if (glowRef.current) {
            // Outer glow pulse
            const glowScale = 0.5 + (progress / 100) * 0.5;
            const glowPulse = Math.sin(time * 2) * 0.1;
            glowRef.current.scale.setScalar(glowScale + glowPulse);
            glowRef.current.material.opacity = 0.2 + Math.sin(time * 3) * 0.1;
        }
    });

    return (
        <group>
            {/* Inner core */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 2]} />
                <meshStandardMaterial
                    color="#6366f1"
                    emissive="#8b5cf6"
                    emissiveIntensity={1}
                    wireframe
                />
            </mesh>

            {/* Outer glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#a855f7"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}

export default function SpellCircle({ progress = 0, scale = 1 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef} scale={scale}>
            {/* Outer decorative ring */}
            <Ring args={[2.2, 2.25, 64]} rotation={[0, 0, 0]}>
                <meshBasicMaterial color="#4a2c7a" transparent opacity={0.5} side={THREE.DoubleSide} />
            </Ring>

            {/* Outer rune ring - slow rotation */}
            <RuneRing radius={2} runeCount={16} rotationSpeed={0.2} color="#ffd700" />

            {/* Middle ring */}
            <Ring args={[1.5, 1.55, 64]} rotation={[0, 0, 0]}>
                <meshBasicMaterial color="#6366f1" transparent opacity={0.4} side={THREE.DoubleSide} />
            </Ring>

            {/* Inner rune ring - faster, opposite rotation */}
            <RuneRing radius={1.3} runeCount={8} rotationSpeed={-0.4} color="#00d4ff" />

            {/* Progress indicator ring */}
            <ProgressRing radius={1.8} progress={progress} color="#ffd700" thickness={0.06} />

            {/* Inner progress ring */}
            <ProgressRing radius={1.1} progress={progress} color="#00d4ff" thickness={0.04} />

            {/* Energy core in center */}
            <EnergyCore progress={progress} />

            {/* Point light for glow effect */}
            <pointLight
                position={[0, 0, 0.5]}
                intensity={0.5 + (progress / 100) * 1}
                color="#8b5cf6"
                distance={5}
            />
        </group>
    );
}
