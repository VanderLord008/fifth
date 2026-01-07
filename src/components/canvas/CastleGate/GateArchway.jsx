/**
 * 🚪 Gate Archway - Stone entrance with magical runes
 * The main entrance to the magical realm
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Glowing rune component
function Rune({ position, rotation = [0, 0, 0], symbol = '✦', size = 0.3 }) {
    const meshRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;
            // Pulsing glow
            meshRef.current.material.opacity = 0.6 + Math.sin(time * 2 + phase) * 0.3;
        }
    });

    return (
        <Text
            ref={meshRef}
            position={position}
            rotation={rotation}
            fontSize={size}
            color="#a78bfa"
            anchorX="center"
            anchorY="middle"
            material-transparent
            material-opacity={0.8}
        >
            {symbol}
        </Text>
    );
}

// Portal energy effect inside the gate
function PortalEnergy() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;
            meshRef.current.rotation.z = time * 0.3;
            meshRef.current.material.opacity = 0.3 + Math.sin(time * 1.5) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 3.5, 0.1]}>
            <circleGeometry args={[2.8, 32]} />
            <meshBasicMaterial
                color="#6366f1"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export default function GateArchway({ onClick }) {
    const groupRef = useRef();

    // Rune symbols for magical effect
    const runeSymbols = ['✦', '◇', '☆', '◈', '✧', '⬡'];

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Left pillar */}
            <mesh position={[-4, 3.5, 0]}>
                <boxGeometry args={[1.5, 7, 1.5]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Right pillar */}
            <mesh position={[4, 3.5, 0]}>
                <boxGeometry args={[1.5, 7, 1.5]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Left pillar cap */}
            <mesh position={[-4, 7.3, 0]}>
                <boxGeometry args={[1.8, 0.6, 1.8]} />
                <meshStandardMaterial color="#374151" roughness={0.8} />
            </mesh>

            {/* Right pillar cap */}
            <mesh position={[4, 7.3, 0]}>
                <boxGeometry args={[1.8, 0.6, 1.8]} />
                <meshStandardMaterial color="#374151" roughness={0.8} />
            </mesh>

            {/* Arch top */}
            <mesh position={[0, 7, 0]}>
                <boxGeometry args={[9.5, 1.2, 1.5]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Arch curved section (simplified with boxes) */}
            <mesh position={[-3, 6.3, 0]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[1, 1.2, 1.4]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>
            <mesh position={[3, 6.3, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[1, 1.2, 1.4]} />
                <meshStandardMaterial color="#4a5568" roughness={0.9} />
            </mesh>

            {/* Portal opening background */}
            <mesh position={[0, 3.5, -0.2]} onClick={onClick}>
                <planeGeometry args={[6.5, 6.5]} />
                <meshBasicMaterial color="#0a0a1a" />
            </mesh>

            {/* Portal energy effect */}
            <PortalEnergy />

            {/* Glowing runes on left pillar */}
            {runeSymbols.slice(0, 3).map((symbol, i) => (
                <Rune
                    key={`left-${i}`}
                    position={[-3.2, 2 + i * 2, 0.8]}
                    symbol={symbol}
                    size={0.4}
                />
            ))}

            {/* Glowing runes on right pillar */}
            {runeSymbols.slice(3, 6).map((symbol, i) => (
                <Rune
                    key={`right-${i}`}
                    position={[3.2, 2 + i * 2, 0.8]}
                    symbol={symbol}
                    size={0.4}
                />
            ))}

            {/* Central rune above gate */}
            <Rune position={[0, 7.8, 0.8]} symbol="⬢" size={0.8} />

            {/* Point lights for rune glow */}
            <pointLight position={[-3.2, 4, 1]} color="#a78bfa" intensity={0.5} distance={4} />
            <pointLight position={[3.2, 4, 1]} color="#a78bfa" intensity={0.5} distance={4} />

            {/* Portal inner glow */}
            <pointLight position={[0, 3.5, 0.5]} color="#6366f1" intensity={1} distance={8} />
        </group>
    );
}
