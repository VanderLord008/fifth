/**
 * 🧙‍♂️ Magical Particles - Floating sparkle effects
 * Creates dreamy, magical particles floating in the scene
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MagicalParticles({
    count = 100,
    radius = 5,
    color = '#ffd700',
    size = 0.03,
    speed = 0.2,
    opacity = 0.8
}) {
    const particlesRef = useRef();

    // Generate random particle positions and properties
    const { positions, velocities, phases } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const phases = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Random spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * Math.cbrt(Math.random()); // Cube root for uniform distribution

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // Random velocities for floating effect
            velocities[i3] = (Math.random() - 0.5) * speed;
            velocities[i3 + 1] = (Math.random() - 0.5) * speed;
            velocities[i3 + 2] = (Math.random() - 0.5) * speed;

            // Random phase for twinkling
            phases[i] = Math.random() * Math.PI * 2;
        }

        return { positions, velocities, phases };
    }, [count, radius, speed]);

    // Animate particles
    useFrame((state, delta) => {
        if (!particlesRef.current) return;

        const positionAttribute = particlesRef.current.geometry.attributes.position;
        const positions = positionAttribute.array;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Floating motion
            positions[i3] += velocities[i3] * delta;
            positions[i3 + 1] += velocities[i3 + 1] * delta + Math.sin(time + phases[i]) * 0.002;
            positions[i3 + 2] += velocities[i3 + 2] * delta;

            // Keep particles within bounds
            const dist = Math.sqrt(
                positions[i3] ** 2 +
                positions[i3 + 1] ** 2 +
                positions[i3 + 2] ** 2
            );

            if (dist > radius * 1.5) {
                // Reset particle to center area
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 0.5;

                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);
            }
        }

        positionAttribute.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={size}
                color={color}
                transparent
                opacity={opacity}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
