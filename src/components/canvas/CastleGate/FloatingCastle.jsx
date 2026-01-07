/**
 * 🏰 Floating Castle - Gothic castle floating in the sky
 * Procedural geometry with towers and turrets
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Tower component
function Tower({ position, height = 8, radius = 1.5, roofHeight = 3 }) {
    return (
        <group position={position}>
            {/* Tower body */}
            <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[radius, radius * 1.1, height, 12]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} metalness={0.1} />
            </mesh>

            {/* Tower rim */}
            <mesh position={[0, height + 0.2, 0]}>
                <cylinderGeometry args={[radius * 1.15, radius * 1.15, 0.4, 12]} />
                <meshStandardMaterial color="#374151" roughness={0.8} />
            </mesh>

            {/* Battlements */}
            {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius * 1.1,
                            height + 0.6,
                            Math.sin(angle) * radius * 1.1
                        ]}
                    >
                        <boxGeometry args={[0.4, 0.6, 0.3]} />
                        <meshStandardMaterial color="#374151" roughness={0.8} />
                    </mesh>
                );
            })}

            {/* Conical roof */}
            <mesh position={[0, height + roofHeight / 2 + 0.5, 0]}>
                <coneGeometry args={[radius * 1.3, roofHeight, 12]} />
                <meshStandardMaterial color="#1e3a5f" roughness={0.7} metalness={0.2} />
            </mesh>

            {/* Roof spire */}
            <mesh position={[0, height + roofHeight + 1.5, 0]}>
                <coneGeometry args={[0.1, 1, 6]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Window lights */}
            {[...Array(3)].map((_, i) => (
                <mesh
                    key={`window-${i}`}
                    position={[radius + 0.01, height * 0.3 + i * 2, 0]}
                >
                    <planeGeometry args={[0.5, 0.8]} />
                    <meshBasicMaterial color="#fef08a" transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    );
}

// Main castle body
function CastleBody() {
    return (
        <group>
            {/* Main keep */}
            <mesh position={[0, 4, 5]}>
                <boxGeometry args={[12, 8, 10]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Keep battlements */}
            {[...Array(6)].map((_, i) => (
                <mesh key={i} position={[-5.5 + i * 2.2, 8.5, 5]}>
                    <boxGeometry args={[1, 1, 10.5]} />
                    <meshStandardMaterial color="#374151" roughness={0.8} />
                </mesh>
            ))}

            {/* Front wall sections */}
            <mesh position={[-8, 2.5, -2]}>
                <boxGeometry args={[4, 5, 6]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>
            <mesh position={[8, 2.5, -2]}>
                <boxGeometry args={[4, 5, 6]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Floating platform base */}
            <mesh position={[0, -2, 2]}>
                <cylinderGeometry args={[15, 12, 4, 16]} />
                <meshStandardMaterial color="#374151" roughness={0.95} />
            </mesh>

            {/* Rocky underside */}
            <mesh position={[0, -5, 2]}>
                <dodecahedronGeometry args={[8, 0]} />
                <meshStandardMaterial color="#1f2937" roughness={1} />
            </mesh>
        </group>
    );
}

export default function FloatingCastle() {
    const groupRef = useRef();

    // Gentle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            groupRef.current.position.y = Math.sin(time * 0.2) * 0.5;
            groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.02;
        }
    });

    return (
        <group ref={groupRef} position={[0, 5, 25]} scale={0.8}>
            {/* Main castle body */}
            <CastleBody />

            {/* Corner towers */}
            <Tower position={[-10, 0, -5]} height={10} radius={2} roofHeight={4} />
            <Tower position={[10, 0, -5]} height={10} radius={2} roofHeight={4} />
            <Tower position={[-8, 0, 10]} height={12} radius={2.2} roofHeight={5} />
            <Tower position={[8, 0, 10]} height={12} radius={2.2} roofHeight={5} />

            {/* Central grand tower */}
            <Tower position={[0, 6, 8]} height={14} radius={2.5} roofHeight={6} />

            {/* Smaller accent towers */}
            <Tower position={[-5, 4, 2]} height={6} radius={1} roofHeight={2.5} />
            <Tower position={[5, 4, 2]} height={6} radius={1} roofHeight={2.5} />
        </group>
    );
}
