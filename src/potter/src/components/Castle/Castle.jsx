import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Castle - A magical gatehouse structure with towers and archway
 * The entrance to the portfolio experience
 */
export default function Castle({ position = [0, 0, 0], onGateClick }) {
    const windowLightRef = useRef();

    // Animate window lights flickering
    useFrame((state) => {
        if (windowLightRef.current) {
            windowLightRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        }
    });

    return (
        <group position={position}>
            {/* Left Tower */}
            <Tower position={[-4, 0, 0]} />

            {/* Right Tower */}
            <Tower position={[4, 0, 0]} />

            {/* Connecting Wall - Left Side */}
            <mesh position={[-2.5, 3, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 6, 1.5]} />
                <meshStandardMaterial color="#5a5a6a" roughness={0.85} />
            </mesh>

            {/* Connecting Wall - Right Side */}
            <mesh position={[2.5, 3, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 6, 1.5]} />
                <meshStandardMaterial color="#5a5a6a" roughness={0.85} />
            </mesh>

            {/* Archway Top */}
            <mesh position={[0, 5.5, 0]} castShadow>
                <boxGeometry args={[3, 1.5, 1.5]} />
                <meshStandardMaterial color="#4a4a5a" roughness={0.85} />
            </mesh>

            {/* Arch Curve (half torus for rounded top) */}
            <mesh position={[0, 4.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.4, 0.3, 8, 12, Math.PI]} />
                <meshStandardMaterial color="#4a4a5a" roughness={0.9} />
            </mesh>

            {/* Crenellations on wall */}
            {[-3.5, -1.5, 1.5, 3.5].map((x, i) => (
                <mesh key={i} position={[x, 6.5, 0]} castShadow>
                    <boxGeometry args={[0.6, 0.8, 1.6]} />
                    <meshStandardMaterial color="#5a5a6a" roughness={0.9} />
                </mesh>
            ))}

            {/* Banner above gate */}
            <mesh position={[0, 6.8, 0.5]} castShadow>
                <boxGeometry args={[2.5, 1.2, 0.1]} />
                <meshStandardMaterial color="#8b0000" roughness={0.6} />
            </mesh>

            {/* Banner emblem (simple circle) */}
            <mesh position={[0, 6.8, 0.6]}>
                <circleGeometry args={[0.4, 16]} />
                <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Warm light from archway */}
            <pointLight
                ref={windowLightRef}
                position={[0, 3, 1]}
                color="#ffaa55"
                intensity={0.8}
                distance={8}
            />

            {/* Ivy accents on walls */}
            <IvyCluster position={[-3.5, 4, 0.8]} />
            <IvyCluster position={[3.2, 2.5, 0.8]} />
        </group>
    );
}

/**
 * Tower - Cylindrical tower with pointed roof
 */
function Tower({ position }) {
    return (
        <group position={position}>
            {/* Tower body */}
            <mesh position={[0, 4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.5, 1.6, 8, 8]} />
                <meshStandardMaterial color="#5a5a6a" roughness={0.85} />
            </mesh>

            {/* Tower base (wider) */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.7, 1.8, 1, 8]} />
                <meshStandardMaterial color="#4a4a5a" roughness={0.9} />
            </mesh>

            {/* Pointed roof */}
            <mesh position={[0, 9, 0]} castShadow>
                <coneGeometry args={[1.8, 2.5, 8]} />
                <meshStandardMaterial color="#2a2a3a" roughness={0.7} />
            </mesh>

            {/* Roof tip ornament */}
            <mesh position={[0, 10.5, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Tower windows */}
            {[3, 5, 7].map((y, i) => (
                <group key={i}>
                    <mesh position={[0, y, 1.55]}>
                        <boxGeometry args={[0.4, 0.7, 0.15]} />
                        <meshBasicMaterial color="#ffcc66" />
                    </mesh>
                    {/* Window frame */}
                    <mesh position={[0, y, 1.5]}>
                        <boxGeometry args={[0.5, 0.8, 0.1]} />
                        <meshStandardMaterial color="#3a3a4a" roughness={0.8} />
                    </mesh>
                </group>
            ))}

            {/* Crenellations */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                    <mesh
                        key={i}
                        position={[Math.cos(angle) * 1.5, 8.3, Math.sin(angle) * 1.5]}
                        castShadow
                    >
                        <boxGeometry args={[0.4, 0.6, 0.4]} />
                        <meshStandardMaterial color="#5a5a6a" roughness={0.9} />
                    </mesh>
                );
            })}
        </group>
    );
}

/**
 * IvyCluster - Decorative ivy/moss on walls
 */
function IvyCluster({ position }) {
    return (
        <group position={position}>
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh
                    key={i}
                    position={[
                        (Math.random() - 0.5) * 0.8,
                        -i * 0.3,
                        0
                    ]}
                    scale={0.15 + Math.random() * 0.1}
                >
                    <sphereGeometry args={[1, 6, 6]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? "#2a4a2a" : "#3a5a3a"}
                        roughness={0.9}
                    />
                </mesh>
            ))}
        </group>
    );
}
