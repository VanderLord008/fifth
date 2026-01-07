import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MagicParticles - Floating golden sparkles for ambient magical atmosphere
 */
export default function MagicParticles({
    count = 50,
    bounds = { x: 15, y: 10, z: 15 },
    position = [0, 5, 0]
}) {
    const particlesRef = useRef();

    // Generate particle positions and properties
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * bounds.x,
                    Math.random() * bounds.y,
                    (Math.random() - 0.5) * bounds.z
                ),
                speed: 0.2 + Math.random() * 0.3,
                offset: Math.random() * Math.PI * 2,
                scale: 0.02 + Math.random() * 0.03
            });
        }
        return temp;
    }, [count, bounds.x, bounds.y, bounds.z]);

    // Animate particles
    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.children.forEach((particle, i) => {
                const p = particles[i];
                const time = state.clock.elapsedTime;

                // Gentle floating motion
                particle.position.y = p.position.y + Math.sin(time * p.speed + p.offset) * 0.5;
                particle.position.x = p.position.x + Math.sin(time * p.speed * 0.5 + p.offset) * 0.3;
                particle.position.z = p.position.z + Math.cos(time * p.speed * 0.5 + p.offset) * 0.3;

                // Twinkle effect
                const twinkle = Math.sin(time * 3 + p.offset) * 0.5 + 0.5;
                particle.material.opacity = 0.3 + twinkle * 0.7;
                particle.scale.setScalar(p.scale * (0.8 + twinkle * 0.4));
            });
        }
    });

    return (
        <group ref={particlesRef} position={position}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.position}>
                    <sphereGeometry args={[1, 6, 6]} />
                    <meshBasicMaterial
                        color="#ffd700"
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

/**
 * DustParticles - Subtle dust motes for atmosphere
 */
export function DustParticles({ count = 80, bounds = 20, position = [0, 5, 0] }) {
    const particlesRef = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * bounds,
                    Math.random() * bounds * 0.5,
                    (Math.random() - 0.5) * bounds
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    -0.005 - Math.random() * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                scale: 0.01 + Math.random() * 0.02
            });
        }
        return temp;
    }, [count, bounds]);

    useFrame(() => {
        if (particlesRef.current) {
            particlesRef.current.children.forEach((particle, i) => {
                const p = particles[i];

                // Move particles
                particle.position.x += p.velocity.x;
                particle.position.y += p.velocity.y;
                particle.position.z += p.velocity.z;

                // Reset when below bounds
                if (particle.position.y < -2) {
                    particle.position.y = bounds * 0.5;
                    particle.position.x = (Math.random() - 0.5) * bounds;
                    particle.position.z = (Math.random() - 0.5) * bounds;
                }
            });
        }
    });

    return (
        <group ref={particlesRef} position={position}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.position} scale={p.scale}>
                    <sphereGeometry args={[1, 4, 4]} />
                    <meshBasicMaterial
                        color="#aa9988"
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            ))}
        </group>
    );
}
