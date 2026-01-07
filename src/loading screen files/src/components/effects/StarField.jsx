/**
 * 🧙‍♂️ Star Field - Background stars for loading screen
 * Creates a mystical starry background
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField({ count = 500, radius = 50 }) {
    const pointsRef = useRef();

    const { positions, sizes, colors } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        const colorOptions = [
            new THREE.Color('#ffffff'),
            new THREE.Color('#ffeedd'),
            new THREE.Color('#ddeeff'),
            new THREE.Color('#ffd700'),
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Distribute stars in a sphere around the scene
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * (0.5 + Math.random() * 0.5);

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // Random sizes for depth effect
            sizes[i] = Math.random() * 0.5 + 0.1;

            // Random colors
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        return { positions, sizes, colors };
    }, [count, radius]);

    useFrame((state) => {
        if (pointsRef.current) {
            // Very slow rotation for subtle parallax effect
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
            pointsRef.current.rotation.x = state.clock.elapsedTime * 0.005;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
