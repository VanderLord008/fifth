/**
 * 🕯️ Floating Candles - Magical floating candles with warm glow
 * Inspired by Harry Potter's Great Hall
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Single floating candle
function Candle({ position, size = 1 }) {
    const groupRef = useRef();
    const flameRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);
    const bobSpeed = useMemo(() => 0.3 + Math.random() * 0.2, []);
    const bobAmount = useMemo(() => 0.2 + Math.random() * 0.15, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (groupRef.current) {
            // Gentle bobbing motion
            groupRef.current.position.y = position[1] + Math.sin(time * bobSpeed + phase) * bobAmount;
            // Slight rotation
            groupRef.current.rotation.z = Math.sin(time * 0.5 + phase) * 0.05;
        }

        if (flameRef.current) {
            // Flickering flame scale
            const flicker = 0.8 + Math.sin(time * 8 + phase) * 0.2 + Math.sin(time * 12) * 0.1;
            flameRef.current.scale.y = flicker;
            flameRef.current.scale.x = 0.9 + Math.sin(time * 6 + phase) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Candle body - cream colored wax */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.08 * size, 0.1 * size, 0.6 * size, 8]} />
                <meshStandardMaterial color="#fef3c7" roughness={0.8} />
            </mesh>

            {/* Wick */}
            <mesh position={[0, 0.32 * size, 0]}>
                <cylinderGeometry args={[0.01 * size, 0.01 * size, 0.04 * size, 4]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>

            {/* Flame - inner bright */}
            <mesh ref={flameRef} position={[0, 0.4 * size, 0]}>
                <sphereGeometry args={[0.06 * size, 8, 8]} />
                <meshBasicMaterial color="#fef08a" transparent opacity={0.9} />
            </mesh>

            {/* Flame - outer glow */}
            <mesh position={[0, 0.42 * size, 0]}>
                <sphereGeometry args={[0.1 * size, 8, 8]} />
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} />
            </mesh>

            {/* Point light for warm glow */}
            <pointLight
                position={[0, 0.4 * size, 0]}
                color="#fbbf24"
                intensity={0.8}
                distance={8}
                decay={2}
            />
        </group>
    );
}

export default function FloatingCandles() {
    // Generate candle positions in a semi-circle around the gate
    const candles = useMemo(() => {
        const data = [];

        // Arc of candles around the entrance
        for (let i = 0; i < 8; i++) {
            const angle = (i / 7) * Math.PI - Math.PI / 2;
            const radius = 12 + Math.random() * 4;
            data.push({
                position: [
                    Math.cos(angle) * radius,
                    4 + Math.random() * 6,
                    Math.sin(angle) * radius - 5
                ],
                size: 0.8 + Math.random() * 0.4,
                id: `arc-${i}`
            });
        }

        // Scattered candles higher up
        for (let i = 0; i < 6; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 20,
                    8 + Math.random() * 5,
                    (Math.random() - 0.5) * 15
                ],
                size: 0.6 + Math.random() * 0.3,
                id: `high-${i}`
            });
        }

        // Candles near the gate
        for (let i = 0; i < 4; i++) {
            const side = i % 2 === 0 ? -1 : 1;
            data.push({
                position: [
                    side * (3 + Math.random() * 2),
                    2 + Math.random() * 3,
                    -2 + Math.random() * 2
                ],
                size: 1 + Math.random() * 0.3,
                id: `gate-${i}`
            });
        }

        return data;
    }, []);

    return (
        <group>
            {candles.map((candle) => (
                <Candle
                    key={candle.id}
                    position={candle.position}
                    size={candle.size}
                />
            ))}
        </group>
    );
}
