import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';

/**
 * NameBoard - Stone sign with 3D extruded name text
 * Features: Rough stone slab, 3D text, magical shimmer, torch lights
 */
export default function NameBoard({
    position = [0, 0, 0],
    name = "VAIBHAV BAHADUR",
    subtitle = "Software Engineer"
}) {
    const shimmerRef = useRef();
    const torchLeftRef = useRef();
    const torchRightRef = useRef();

    // Animate shimmer and torch flicker
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Shimmer effect
        if (shimmerRef.current) {
            shimmerRef.current.material.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
        }

        // Torch flicker
        if (torchLeftRef.current) {
            torchLeftRef.current.intensity = 1.2 + Math.sin(time * 10) * 0.3 + Math.random() * 0.1;
        }
        if (torchRightRef.current) {
            torchRightRef.current.intensity = 1.2 + Math.sin(time * 10 + 1) * 0.3 + Math.random() * 0.1;
        }
    });

    return (
        <group position={position}>
            {/* Stone slab base */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[5, 2, 0.4]} />
                <meshStandardMaterial
                    color="#6a6a7a"
                    roughness={0.95}
                    metalness={0.05}
                />
            </mesh>

            {/* Rough stone edges */}
            {[
                { pos: [-2.4, 0, 0.15], rot: [0, 0, 0.1] },
                { pos: [2.4, 0, 0.15], rot: [0, 0, -0.1] },
                { pos: [0, 0.9, 0.15], rot: [0, 0, 0] },
                { pos: [0, -0.9, 0.15], rot: [0, 0, 0] },
            ].map((edge, i) => (
                <mesh key={i} position={edge.pos} rotation={edge.rot}>
                    <boxGeometry args={[i < 2 ? 0.3 : 4.8, i < 2 ? 1.8 : 0.3, 0.3]} />
                    <meshStandardMaterial color="#5a5a6a" roughness={0.98} />
                </mesh>
            ))}

            {/* Main name text - using fallback box since Text3D needs font */}
            <group position={[0, 0.2, 0.25]}>
                {/* Name background glow */}
                <mesh ref={shimmerRef} position={[0, 0, -0.05]}>
                    <boxGeometry args={[4, 0.6, 0.1]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        emissive="#ffd700"
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Simple text representation using boxes (fallback) */}
                <mesh position={[0, 0, 0.05]}>
                    <boxGeometry args={[3.8, 0.4, 0.08]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        metalness={0.7}
                        roughness={0.3}
                    />
                </mesh>
            </group>

            {/* Subtitle area */}
            <mesh position={[0, -0.4, 0.25]}>
                <boxGeometry args={[2.8, 0.25, 0.05]} />
                <meshStandardMaterial
                    color="#c0c0c0"
                    metalness={0.5}
                    roughness={0.4}
                />
            </mesh>

            {/* Left torch bracket */}
            <group position={[-2.8, 0, 0.3]}>
                <mesh>
                    <boxGeometry args={[0.15, 0.6, 0.15]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
                </mesh>
                {/* Torch */}
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.08, 0.1, 0.3, 6]} />
                    <meshStandardMaterial color="#4a3520" roughness={0.9} />
                </mesh>
                {/* Flame */}
                <mesh position={[0, 0.65, 0]}>
                    <coneGeometry args={[0.08, 0.2, 6]} />
                    <meshBasicMaterial color="#ff6600" />
                </mesh>
                <pointLight
                    ref={torchLeftRef}
                    position={[0, 0.7, 0]}
                    color="#ff8833"
                    intensity={1.2}
                    distance={4}
                />
            </group>

            {/* Right torch bracket */}
            <group position={[2.8, 0, 0.3]}>
                <mesh>
                    <boxGeometry args={[0.15, 0.6, 0.15]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
                </mesh>
                {/* Torch */}
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.08, 0.1, 0.3, 6]} />
                    <meshStandardMaterial color="#4a3520" roughness={0.9} />
                </mesh>
                {/* Flame */}
                <mesh position={[0, 0.65, 0]}>
                    <coneGeometry args={[0.08, 0.2, 6]} />
                    <meshBasicMaterial color="#ff6600" />
                </mesh>
                <pointLight
                    ref={torchRightRef}
                    position={[0, 0.7, 0]}
                    color="#ff8833"
                    intensity={1.2}
                    distance={4}
                />
            </group>

            {/* Decorative corner ornaments */}
            {[
                [-2.3, 0.8],
                [2.3, 0.8],
                [-2.3, -0.8],
                [2.3, -0.8],
            ].map((pos, i) => (
                <mesh key={i} position={[pos[0], pos[1], 0.22]}>
                    <octahedronGeometry args={[0.12, 0]} />
                    <meshStandardMaterial color="#8b7355" metalness={0.6} roughness={0.4} />
                </mesh>
            ))}
        </group>
    );
}
