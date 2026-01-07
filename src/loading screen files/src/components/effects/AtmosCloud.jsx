import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Atmos-style cloud - clumped spheres with soft shading
 * Creates that clay/blobby look from the Atmos website
 */
export default function AtmosCloud({
    position = [0, 0, 0],
    scale = 1,
    color = '#ffffff',
    opacity = 0.9,
    segments = 5,
    speed = 0.1
}) {
    const groupRef = useRef();

    // Generate random sphere positions for the blob cloud
    const spheres = useMemo(() => {
        const sphereData = [];
        const baseCount = segments;

        // Main body spheres
        for (let i = 0; i < baseCount; i++) {
            sphereData.push({
                position: [
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 0.8,
                    (Math.random() - 0.5) * 1.5
                ],
                scale: 0.5 + Math.random() * 0.8,
                speed: 0.5 + Math.random() * 0.5
            });
        }

        // Add some smaller spheres for detail
        for (let i = 0; i < baseCount * 2; i++) {
            sphereData.push({
                position: [
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 1,
                    (Math.random() - 0.5) * 2
                ],
                scale: 0.2 + Math.random() * 0.4,
                speed: 0.3 + Math.random() * 0.7
            });
        }

        return sphereData;
    }, [segments]);

    // Gentle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime * speed;
            groupRef.current.position.y = position[1] + Math.sin(t) * 0.3;
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {spheres.map((sphere, i) => (
                <mesh key={i} position={sphere.position} scale={sphere.scale}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial
                        color={color}
                        transparent
                        opacity={opacity}
                        roughness={1}
                        metalness={0}
                        envMapIntensity={0.2}
                    />
                </mesh>
            ))}
        </group>
    );
}

/**
 * Cloud field - generates multiple Atmos-style clouds
 */
export function CloudField({ count = 20, spread = 100, depth = 200 }) {
    const clouds = useMemo(() => {
        const cloudData = [];

        for (let i = 0; i < count; i++) {
            // Distribute clouds in a cone shape ahead of camera path
            const progress = i / count;
            const z = -progress * depth;

            // Wider spread as we go further
            const spreadFactor = 1 + progress * 2;

            cloudData.push({
                position: [
                    (Math.random() - 0.5) * spread * spreadFactor,
                    (Math.random() - 0.5) * spread * 0.5,
                    z + (Math.random() - 0.5) * 20
                ],
                scale: 1 + Math.random() * 3,
                segments: 3 + Math.floor(Math.random() * 5),
                speed: 0.05 + Math.random() * 0.1,
                // Tint clouds with sky color
                color: Math.random() > 0.5 ? '#e8d5f5' : '#f5e6d3'
            });
        }

        return cloudData;
    }, [count, spread, depth]);

    return (
        <group>
            {clouds.map((cloud, i) => (
                <AtmosCloud
                    key={i}
                    position={cloud.position}
                    scale={cloud.scale}
                    segments={cloud.segments}
                    speed={cloud.speed}
                    color={cloud.color}
                    opacity={0.85}
                />
            ))}
        </group>
    );
}
