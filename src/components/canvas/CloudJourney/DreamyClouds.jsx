/**
 * ☁️ Dreamy Clouds - Soft, whimsical cloud system
 * Uses @react-three/drei Cloud component for beautiful volumetric clouds
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import * as THREE from 'three';

// Simple soft cloud puff using spheres
function SoftCloud({ position, scale = 1, color = '#ffffff', opacity = 0.8 }) {
    const groupRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    // Create multiple overlapping spheres for soft cloud effect
    const spheres = useMemo(() => {
        const data = [];
        const count = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 4 * scale,
                    (Math.random() - 0.5) * 2 * scale,
                    (Math.random() - 0.5) * 3 * scale
                ],
                scale: (0.8 + Math.random() * 1.2) * scale,
                opacity: opacity * (0.6 + Math.random() * 0.4)
            });
        }
        return data;
    }, [scale, opacity]);

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            // Gentle floating animation
            groupRef.current.position.y = position[1] + Math.sin(time * 0.3 + phase) * 0.5;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {spheres.map((sphere, i) => (
                <mesh key={i} position={sphere.position}>
                    <sphereGeometry args={[sphere.scale, 16, 16]} />
                    <meshStandardMaterial
                        color={color}
                        transparent
                        opacity={sphere.opacity}
                        roughness={1}
                        metalness={0}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function DreamyClouds() {
    const groupRef = useRef();

    // Generate cloud positions
    const clouds = useMemo(() => {
        const data = [];

        // Warm white foreground clouds
        for (let i = 0; i < 12; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 80,
                    -8 + Math.random() * 12,
                    -20 + Math.random() * 120
                ],
                scale: 1 + Math.random() * 1.5,
                color: '#fff8f0',
                opacity: 0.85,
                id: `warm-${i}`
            });
        }

        // Pink-tinted mid clouds
        for (let i = 0; i < 15; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 120,
                    -5 + Math.random() * 18,
                    20 + Math.random() * 140
                ],
                scale: 1.5 + Math.random() * 2,
                color: '#ffe8ec',
                opacity: 0.7,
                id: `pink-${i}`
            });
        }

        // Lavender background clouds
        for (let i = 0; i < 10; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 150,
                    5 + Math.random() * 15,
                    100 + Math.random() * 100
                ],
                scale: 2 + Math.random() * 2.5,
                color: '#f0e6ff',
                opacity: 0.5,
                id: `lavender-${i}`
            });
        }

        return data;
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Drift clouds slowly
            groupRef.current.position.z += delta * 3;
            if (groupRef.current.position.z > 80) {
                groupRef.current.position.z = -40;
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* Drei Cloud components for extra fluffiness */}
            <Cloud
                position={[-15, 8, 40]}
                opacity={0.6}
                speed={0.2}
                width={20}
                depth={5}
                segments={30}
                color="#fff5f8"
            />
            <Cloud
                position={[20, 3, 70]}
                opacity={0.5}
                speed={0.15}
                width={25}
                depth={6}
                segments={35}
                color="#ffe8f0"
            />
            <Cloud
                position={[0, 12, 110]}
                opacity={0.4}
                speed={0.1}
                width={35}
                depth={8}
                segments={40}
                color="#f5e6ff"
            />
            <Cloud
                position={[-30, 5, 150]}
                opacity={0.35}
                speed={0.08}
                width={40}
                depth={10}
                segments={45}
                color="#ffe0e8"
            />

            {/* Custom soft sphere clouds */}
            {clouds.map((cloud) => (
                <SoftCloud
                    key={cloud.id}
                    position={cloud.position}
                    scale={cloud.scale}
                    color={cloud.color}
                    opacity={cloud.opacity}
                />
            ))}
        </group>
    );
}
