/**
 * 🌌 Holographic Banner - Futuristic 3D hologram projection
 * No debug controls - hardcoded position from user's settings
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Floating holographic text with glow
function HoloText({ children, position, fontSize = 0.3, color = '#ffffff', glowColor, ...props }) {
    const textRef = useRef();
    const glow = glowColor || color;

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (textRef.current) {
            textRef.current.position.z = position[2] + Math.sin(time * 2 + position[0]) * 0.01;
        }
    });

    return (
        <group position={position}>
            <Text
                fontSize={fontSize * 1.02}
                color={glow}
                anchorX="center"
                anchorY="middle"
                position={[0, 0, -0.01]}
                material-transparent
                material-opacity={0.4}
                {...props}
            >
                {children}
            </Text>
            <Text
                ref={textRef}
                fontSize={fontSize}
                color={color}
                anchorX="center"
                anchorY="middle"
                {...props}
            >
                {children}
            </Text>
        </group>
    );
}

// Projection beam
function ProjectionBeam({ start, end }) {
    const beamRef = useRef();

    useFrame((state) => {
        if (beamRef.current) {
            const time = state.clock.elapsedTime;
            beamRef.current.material.opacity = 0.12 + Math.sin(time * 4) * 0.04;
        }
    });

    return (
        <group>
            <mesh ref={beamRef} position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]}>
                <cylinderGeometry args={[0.02, 0.15, 3, 8, 1, true]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={start}>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.9} />
            </mesh>
            <pointLight position={start} intensity={0.8} color="#00ffff" distance={2} />
        </group>
    );
}

export default function ParchmentBanner({
    name = "Vaibhab Tiwari",
    title = "Web Developer & 3D Enthusiast",
    tagline = "Creating futuristic digital experiences",
    onClick
}) {
    const groupRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    // Hardcoded position (from user's manual settings)
    const posX = -12.0;
    const posY = 3.6;
    const posZ = 4.2;
    const rotX = 0;
    const rotY = 0.03;
    const rotZ = 0;
    const bannerScale = 0.9;

    const emitterPos = useMemo(() => [posX + 3, posY - 1, posZ], []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (groupRef.current) {
            groupRef.current.position.y = posY + Math.sin(time * 1.5) * 0.03;
        }
    });

    return (
        <group>
            <ProjectionBeam start={emitterPos} end={[posX, posY, posZ]} />

            <group
                ref={groupRef}
                position={[posX, posY, posZ]}
                rotation={[rotX, rotY, rotZ]}
                scale={bannerScale}
                onClick={onClick}
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
            >
                <RoundedBox args={[5, 4, 0.1]} radius={0.15} smoothness={4} position={[0, 0, -0.05]}>
                    <meshStandardMaterial color="#0a1628" transparent opacity={0.92} roughness={0.3} metalness={0.7} />
                </RoundedBox>

                {/* Borders */}
                <mesh position={[0, 1.95, 0]}><boxGeometry args={[5, 0.08, 0.05]} /><meshBasicMaterial color="#00e5ff" /></mesh>
                <mesh position={[0, -1.95, 0]}><boxGeometry args={[5, 0.08, 0.05]} /><meshBasicMaterial color="#ff6b35" /></mesh>
                <mesh position={[-2.46, 0, 0]}><boxGeometry args={[0.08, 3.98, 0.05]} /><meshBasicMaterial color="#00e5ff" /></mesh>
                <mesh position={[2.46, 0, 0]}><boxGeometry args={[0.08, 3.98, 0.05]} /><meshBasicMaterial color="#ff6b35" /></mesh>

                {/* Corners */}
                {[[-2.35, 1.85], [2.35, 1.85], [-2.35, -1.85], [2.35, -1.85]].map(([x, y], i) => (
                    <mesh key={i} position={[x, y, 0.03]}><octahedronGeometry args={[0.15]} /><meshBasicMaterial color="#ffd700" /></mesh>
                ))}

                {/* Text */}
                <HoloText position={[0, 1.4, 0.1]} fontSize={0.32} color="#ffd700" glowColor="#ff9500">☠️ CAPTAIN ☠️</HoloText>
                <HoloText position={[0, 0.75, 0.1]} fontSize={0.5} color="#ffffff" glowColor="#00e5ff">{name}</HoloText>
                <HoloText position={[0, 0.15, 0.1]} fontSize={0.22} color="#ff6b35" glowColor="#ff9500">{title}</HoloText>
                <HoloText position={[0, -0.25, 0.1]} fontSize={0.16} color="#b0c4de" glowColor="#00e5ff">{tagline}</HoloText>
                <HoloText position={[-2.0, 0.75, 0.08]} fontSize={0.35} color="#ffd700">⚔️</HoloText>
                <HoloText position={[2.0, 0.75, 0.08]} fontSize={0.35} color="#ffd700">⚔️</HoloText>

                {/* Button */}
                <group position={[0, -1.1, 0.05]}>
                    <RoundedBox args={[2.5, 0.6, 0.08]} radius={0.08} smoothness={4}>
                        <meshStandardMaterial color={isHovered ? "#ff6b35" : "#00e5ff"} emissive={isHovered ? "#ff6b35" : "#00e5ff"} emissiveIntensity={isHovered ? 0.5 : 0.3} metalness={0.6} roughness={0.2} />
                    </RoundedBox>
                    <Text position={[0, 0, 0.06]} fontSize={0.24} color="#000000" anchorX="center" anchorY="middle" fontWeight="bold">
                        ⚓ HIRE CAPTAIN ⚓
                    </Text>
                </group>

                <pointLight position={[0, 0, 1]} intensity={0.6} color="#00e5ff" distance={4} />
                <pointLight position={[0, -1.1, 0.5]} intensity={0.3} color="#ff6b35" distance={2} />
            </group>
        </group>
    );
}
