/**
 * 🏦 Gringotts Vault Corridor - Underground bank vault style
 * Features: Minecart track, vault doors as project portals, crystals/torches
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Glowing crystal
function Crystal({ position, color = "#00ffff", scale = 1 }) {
    const crystalRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (crystalRef.current) {
            crystalRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.3;
        }
    });

    return (
        <group position={position} scale={scale}>
            <mesh ref={crystalRef} rotation={[0, 0, Math.random() * 0.5]}>
                <octahedronGeometry args={[0.3]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={0.3} color={color} distance={3} />
        </group>
    );
}

// Wall torch
function WallTorch({ position, rotation = [0, 0, 0] }) {
    const flameRef = useRef();

    useFrame((state) => {
        if (flameRef.current) {
            flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.15;
            flameRef.current.position.x = Math.sin(state.clock.elapsedTime * 5) * 0.02;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Bracket */}
            <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Torch holder */}
            <mesh>
                <cylinderGeometry args={[0.08, 0.1, 0.3, 8]} />
                <meshStandardMaterial color="#5c3317" roughness={0.8} />
            </mesh>
            {/* Flame */}
            <mesh ref={flameRef} position={[0, 0.25, 0]}>
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
            </mesh>
            <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#ff6600" distance={8} />
        </group>
    );
}

// Vault door portal
function VaultDoor({ position, rotation = [0, 0, 0], project, vaultNumber, onClick }) {
    const [hovered, setHovered] = useState(false);
    const doorRef = useRef();
    const gearRefs = useRef([]);

    useFrame((state) => {
        // Spin gears on hover
        gearRefs.current.forEach((gear, i) => {
            if (gear) {
                const direction = i % 2 === 0 ? 1 : -1;
                gear.rotation.z += (hovered ? 0.02 : 0.002) * direction;
            }
        });

        // Door glow
        if (doorRef.current) {
            doorRef.current.material.emissiveIntensity = hovered ? 0.3 : 0.1;
        }
    });

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Door frame */}
            <mesh>
                <boxGeometry args={[4, 5, 0.3]} />
                <meshStandardMaterial color="#4a3728" roughness={0.7} />
            </mesh>

            {/* Metal door */}
            <mesh ref={doorRef} position={[0, 0, 0.16]}>
                <circleGeometry args={[1.8, 32]} />
                <meshStandardMaterial
                    color="#8b7355"
                    metalness={0.9}
                    roughness={0.3}
                    emissive="#ffaa00"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Decorative gears */}
            {[[0.8, 0.8], [-0.8, 0.8], [0.8, -0.8], [-0.8, -0.8]].map(([x, y], i) => (
                <mesh key={i} ref={el => gearRefs.current[i] = el} position={[x, y, 0.2]}>
                    <torusGeometry args={[0.25, 0.05, 8, 12]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
            ))}

            {/* Center lock mechanism */}
            <mesh position={[0, 0, 0.25]}>
                <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Vault number */}
            <Text
                position={[0, 2.2, 0.2]}
                fontSize={0.4}
                color="#d4af37"
                anchorX="center"
            >
                VAULT {vaultNumber}
            </Text>

            {/* Project title */}
            <Text
                position={[0, -2.2, 0.2]}
                fontSize={0.2}
                color="#a08060"
                anchorX="center"
            >
                {project?.title || "Classified"}
            </Text>

            {hovered && (
                <pointLight position={[0, 0, 2]} intensity={1} color="#ffcc00" distance={5} />
            )}
        </group>
    );
}

// Minecart track
function MinecartTrack({ length = 50 }) {
    return (
        <group position={[0, 0, 0]}>
            {/* Rails */}
            <mesh position={[-0.5, 0.1, 0]}>
                <boxGeometry args={[0.1, 0.1, length]} />
                <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.4} />
            </mesh>
            <mesh position={[0.5, 0.1, 0]}>
                <boxGeometry args={[0.1, 0.1, length]} />
                <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.4} />
            </mesh>

            {/* Sleepers */}
            {Array.from({ length: Math.floor(length / 1.5) }).map((_, i) => (
                <mesh key={i} position={[0, 0.05, -length / 2 + 1 + i * 1.5]}>
                    <boxGeometry args={[1.5, 0.1, 0.2]} />
                    <meshStandardMaterial color="#5c3317" roughness={0.9} />
                </mesh>
            ))}
        </group>
    );
}

// Sample projects
const sampleProjects = [
    { id: 1, title: "E-Commerce App", description: "Modern React storefront" },
    { id: 2, title: "Portfolio Site", description: "3D interactive portfolio" },
    { id: 3, title: "Chat Application", description: "Real-time messaging" },
    { id: 4, title: "Game Engine", description: "WebGL game framework" },
    { id: 5, title: "API Dashboard", description: "Data visualization" },
    { id: 6, title: "Mobile App", description: "React Native project" },
];

export default function GringottsVault({ onProjectSelect }) {
    return (
        <group position={[0, 0, 0]}>
            {/* Cave floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[20, 60]} />
                <meshStandardMaterial color="#2a2520" roughness={0.95} />
            </mesh>

            {/* Cave ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
                <planeGeometry args={[20, 60]} />
                <meshStandardMaterial color="#1a1510" roughness={0.95} />
            </mesh>

            {/* Left cave wall */}
            <mesh position={[-10, 5, 0]}>
                <boxGeometry args={[0.5, 10, 60]} />
                <meshStandardMaterial color="#3a3530" roughness={0.95} />
            </mesh>

            {/* Right cave wall */}
            <mesh position={[10, 5, 0]}>
                <boxGeometry args={[0.5, 10, 60]} />
                <meshStandardMaterial color="#3a3530" roughness={0.95} />
            </mesh>

            {/* Minecart track down the center */}
            <MinecartTrack length={50} />

            {/* Vault doors on left wall */}
            <VaultDoor
                position={[-9, 3, -15]}
                rotation={[0, Math.PI / 2, 0]}
                project={sampleProjects[0]}
                vaultNumber={713}
                onClick={() => onProjectSelect?.(sampleProjects[0])}
            />
            <VaultDoor
                position={[-9, 3, 0]}
                rotation={[0, Math.PI / 2, 0]}
                project={sampleProjects[1]}
                vaultNumber={687}
                onClick={() => onProjectSelect?.(sampleProjects[1])}
            />
            <VaultDoor
                position={[-9, 3, 15]}
                rotation={[0, Math.PI / 2, 0]}
                project={sampleProjects[2]}
                vaultNumber={619}
                onClick={() => onProjectSelect?.(sampleProjects[2])}
            />

            {/* Vault doors on right wall */}
            <VaultDoor
                position={[9, 3, -15]}
                rotation={[0, -Math.PI / 2, 0]}
                project={sampleProjects[3]}
                vaultNumber={711}
                onClick={() => onProjectSelect?.(sampleProjects[3])}
            />
            <VaultDoor
                position={[9, 3, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                project={sampleProjects[4]}
                vaultNumber={656}
                onClick={() => onProjectSelect?.(sampleProjects[4])}
            />
            <VaultDoor
                position={[9, 3, 15]}
                rotation={[0, -Math.PI / 2, 0]}
                project={sampleProjects[5]}
                vaultNumber={598}
                onClick={() => onProjectSelect?.(sampleProjects[5])}
            />

            {/* Crystals on walls */}
            {Array.from({ length: 15 }).map((_, i) => (
                <Crystal
                    key={`left-${i}`}
                    position={[-9 + Math.random(), 2 + Math.random() * 6, -25 + i * 4]}
                    color={['#00ffff', '#ff00ff', '#00ff00'][i % 3]}
                    scale={0.5 + Math.random() * 0.5}
                />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
                <Crystal
                    key={`right-${i}`}
                    position={[9 - Math.random(), 2 + Math.random() * 6, -25 + i * 4]}
                    color={['#ff6600', '#ffff00', '#ff0066'][i % 3]}
                    scale={0.5 + Math.random() * 0.5}
                />
            ))}

            {/* Wall torches */}
            {Array.from({ length: 8 }).map((_, i) => (
                <WallTorch key={`torch-left-${i}`} position={[-9.5, 4, -25 + i * 7]} rotation={[0, Math.PI / 2, 0]} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
                <WallTorch key={`torch-right-${i}`} position={[9.5, 4, -25 + i * 7]} rotation={[0, -Math.PI / 2, 0]} />
            ))}

            {/* Ambient lighting - darker cave atmosphere */}
            <ambientLight intensity={0.15} color="#ffeedd" />
            <pointLight position={[0, 8, 0]} intensity={0.3} color="#ff8800" distance={30} />
            <pointLight position={[0, 8, -20]} intensity={0.2} color="#ff6600" distance={25} />
            <pointLight position={[0, 8, 20]} intensity={0.2} color="#ff6600" distance={25} />
        </group>
    );
}
