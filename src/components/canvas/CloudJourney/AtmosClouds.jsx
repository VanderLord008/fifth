/**
 * ☁️ Atmos-Style Clouds - Smooth blue-lavender volumetric clouds
 * Based on the reference image with soft gradients and smooth shapes
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';


// Custom cloud material with gradient coloring
function AtmosCloud({
    position = [0, 0, 0],
    scale = 1,
    baseColor = '#7c9cf5',  // Blue-lavender base
    topColor = '#9b87f5',   // Lighter lavender top
    opacity = 0.95
}) {
    const groupRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    // Generate smooth overlapping spheres for fluffy look
    const spheres = useMemo(() => {
        const data = [];
        // Central large sphere
        data.push({ pos: [0, 0, 0], size: 1.8 * scale, op: opacity });

        // Top bumps
        data.push({ pos: [0, 0.8 * scale, 0], size: 1.2 * scale, op: opacity * 0.95 });
        data.push({ pos: [-0.6 * scale, 0.5 * scale, 0.2 * scale], size: 1.0 * scale, op: opacity * 0.9 });
        data.push({ pos: [0.7 * scale, 0.6 * scale, -0.1 * scale], size: 1.1 * scale, op: opacity * 0.92 });

        // Side bulges
        data.push({ pos: [-1.2 * scale, -0.1 * scale, 0], size: 1.3 * scale, op: opacity * 0.88 });
        data.push({ pos: [1.3 * scale, 0, 0.1 * scale], size: 1.2 * scale, op: opacity * 0.9 });
        data.push({ pos: [0.5 * scale, -0.3 * scale, 0.8 * scale], size: 0.9 * scale, op: opacity * 0.85 });
        data.push({ pos: [-0.4 * scale, -0.2 * scale, -0.7 * scale], size: 1.0 * scale, op: opacity * 0.87 });

        // Bottom rounded shapes
        data.push({ pos: [-0.8 * scale, -0.6 * scale, 0.3 * scale], size: 1.1 * scale, op: opacity * 0.85 });
        data.push({ pos: [0.3 * scale, -0.7 * scale, 0], size: 1.0 * scale, op: opacity * 0.82 });
        data.push({ pos: [1.0 * scale, -0.5 * scale, -0.3 * scale], size: 0.9 * scale, op: opacity * 0.8 });

        return data;
    }, [scale, opacity]);

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            // Very gentle floating
            groupRef.current.position.y = position[1] + Math.sin(time * 0.2 + phase) * 0.3;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {spheres.map((sphere, i) => (
                <mesh key={i} position={sphere.pos}>
                    <sphereGeometry args={[sphere.size, 32, 32]} />
                    <meshStandardMaterial
                        color={i < 4 ? topColor : baseColor}
                        transparent
                        opacity={sphere.op}
                        roughness={1}
                        metalness={0}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function AtmosClouds() {
    const groupRef = useRef();

    // Generate cloud field
    const clouds = useMemo(() => {
        const data = [];

        // Near clouds - more saturated blue-lavender
        for (let i = 0; i < 8; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 60,
                    -3 + Math.random() * 8,
                    -10 + Math.random() * 80
                ],
                scale: 1.5 + Math.random() * 1.5,
                baseColor: '#7c9cf5',
                topColor: '#a78bfa',
                opacity: 0.92,
                id: `near-${i}`
            });
        }

        // Mid clouds - softer lavender
        for (let i = 0; i < 12; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 100,
                    -5 + Math.random() * 12,
                    40 + Math.random() * 100
                ],
                scale: 2 + Math.random() * 2,
                baseColor: '#8b9df7',
                topColor: '#b197fc',
                opacity: 0.85,
                id: `mid-${i}`
            });
        }

        // Far clouds - paler, more purple
        for (let i = 0; i < 10; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 140,
                    2 + Math.random() * 15,
                    120 + Math.random() * 80
                ],
                scale: 2.5 + Math.random() * 2.5,
                baseColor: '#a5b4fc',
                topColor: '#c4b5fd',
                opacity: 0.7,
                id: `far-${i}`
            });
        }

        // Background atmosphere clouds - very soft
        for (let i = 0; i < 6; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 180,
                    8 + Math.random() * 12,
                    180 + Math.random() * 50
                ],
                scale: 4 + Math.random() * 3,
                baseColor: '#c7d2fe',
                topColor: '#ddd6fe',
                opacity: 0.5,
                id: `bg-${i}`
            });
        }

        return data;
    }, []);

    // Continuous drift for parallax effect
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.position.z += delta * 8;
            if (groupRef.current.position.z > 60) {
                groupRef.current.position.z = -30;
            }
        }
    });

    return (
        <group ref={groupRef}>
            {clouds.map((cloud) => (
                <AtmosCloud
                    key={cloud.id}
                    position={cloud.position}
                    scale={cloud.scale}
                    baseColor={cloud.baseColor}
                    topColor={cloud.topColor}
                    opacity={cloud.opacity}
                />
            ))}
        </group>
    );
}
