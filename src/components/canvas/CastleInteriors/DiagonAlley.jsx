/**
 * 🛒 Diagon Alley - Whimsical shopping street style
 * Features: Colorful shop facades, varied architecture, cobblestone street
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Magical shop sign
function ShopSign({ position, text, color = "#d4af37" }) {
    const signRef = useRef();

    useFrame((state) => {
        if (signRef.current) {
            signRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    return (
        <group ref={signRef} position={position}>
            {/* Sign board */}
            <mesh>
                <boxGeometry args={[2.5, 0.8, 0.1]} />
                <meshStandardMaterial color="#3c1414" roughness={0.7} />
            </mesh>
            {/* Gold text */}
            <Text
                position={[0, 0, 0.06]}
                fontSize={0.25}
                color={color}
                anchorX="center"
            >
                {text}
            </Text>
            {/* Hanging chain */}
            <mesh position={[-1, 0.5, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
            <mesh position={[1, 0.5, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>
        </group>
    );
}

// Shop window display
function ShopWindow({ position, glowColor = "#ffaa00" }) {
    return (
        <group position={position}>
            {/* Window frame */}
            <mesh>
                <boxGeometry args={[1.5, 2, 0.1]} />
                <meshStandardMaterial color="#3c2415" roughness={0.7} />
            </mesh>
            {/* Glass */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[1.2, 1.7]} />
                <meshStandardMaterial
                    color="#113355"
                    transparent
                    opacity={0.6}
                    emissive={glowColor}
                    emissiveIntensity={0.2}
                />
            </mesh>
            <pointLight position={[0, 0, 0.5]} intensity={0.3} color={glowColor} distance={3} />
        </group>
    );
}

// Shop facade
function ShopFacade({ position, rotation = [0, 0, 0], shop, onClick }) {
    const [hovered, setHovered] = useState(false);
    const facadeRef = useRef();

    useFrame(() => {
        if (facadeRef.current) {
            // Subtle glow on hover
        }
    });

    const buildingColor = shop?.color || "#8b4513";
    const roofColor = shop?.roofColor || "#4a2511";
    const accentColor = shop?.accentColor || "#d4af37";

    return (
        <group
            ref={facadeRef}
            position={position}
            rotation={rotation}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Main building */}
            <mesh position={[0, 3, 0]}>
                <boxGeometry args={[5, 6, 4]} />
                <meshStandardMaterial
                    color={buildingColor}
                    roughness={0.8}
                    emissive={hovered ? buildingColor : "#000000"}
                    emissiveIntensity={hovered ? 0.2 : 0}
                />
            </mesh>

            {/* Crooked upper floor (typical Diagon Alley style) */}
            <mesh position={[0.5, 7, 0.3]} rotation={[0, 0, 0.1]}>
                <boxGeometry args={[5.5, 3, 4.5]} />
                <meshStandardMaterial color={buildingColor} roughness={0.8} />
            </mesh>

            {/* Pointed roof */}
            <mesh position={[0.3, 9.5, 0]} rotation={[0, 0, 0.05]}>
                <coneGeometry args={[3.5, 2.5, 4]} />
                <meshStandardMaterial color={roofColor} roughness={0.9} />
            </mesh>

            {/* Door */}
            <mesh position={[0, 1.5, 2.1]}>
                <boxGeometry args={[1.5, 3, 0.2]} />
                <meshStandardMaterial
                    color="#2a1a0a"
                    roughness={0.6}
                    emissive={hovered ? "#ffaa00" : "#000000"}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Door handle */}
            <mesh position={[0.5, 1.5, 2.25]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Windows */}
            <ShopWindow position={[-1.5, 2, 2.1]} glowColor={accentColor} />
            <ShopWindow position={[1.5, 2, 2.1]} glowColor={accentColor} />
            <ShopWindow position={[-1.2, 5.5, 2.1]} glowColor={accentColor} />
            <ShopWindow position={[1.2, 5.5, 2.1]} glowColor={accentColor} />

            {/* Shop sign */}
            <ShopSign position={[0, 5, 2.5]} text={shop?.name || "Shop"} color={accentColor} />

            {/* Project info on hover */}
            {hovered && (
                <group position={[0, 8, 3]}>
                    <mesh>
                        <planeGeometry args={[4, 1.5]} />
                        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
                    </mesh>
                    <Text position={[0, 0.3, 0.01]} fontSize={0.25} color="#ffffff" anchorX="center">
                        {shop?.project?.title || "Enter Shop"}
                    </Text>
                    <Text position={[0, -0.2, 0.01]} fontSize={0.15} color="#aaaaaa" anchorX="center">
                        {shop?.project?.description || "Click to view project"}
                    </Text>
                </group>
            )}

            {/* Shop interior light */}
            <pointLight position={[0, 2, 1]} intensity={0.5} color={accentColor} distance={5} />
        </group>
    );
}

// Cobblestone ground
function CobblestoneStreet({ width = 10, length = 40 }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[width, length]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.95} />
        </mesh>
    );
}

// Street lamp
function StreetLamp({ position }) {
    const glowRef = useRef();

    useFrame((state) => {
        if (glowRef.current) {
            glowRef.current.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        }
    });

    return (
        <group position={position}>
            {/* Post */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 4, 8]} />
                <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.4} />
            </mesh>
            {/* Lamp holder */}
            <mesh position={[0, 4.2, 0]}>
                <boxGeometry args={[0.6, 0.8, 0.6]} />
                <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Lamp glow */}
            <mesh ref={glowRef} position={[0, 4.2, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color="#ffcc44" transparent opacity={0.7} />
            </mesh>
            <pointLight position={[0, 4.2, 0]} intensity={1} color="#ffcc44" distance={10} />
        </group>
    );
}

// Sample shops with projects
const shops = [
    {
        name: "Ollivander's",
        color: "#6b4423",
        roofColor: "#3c2415",
        accentColor: "#d4af37",
        project: { id: 1, title: "E-Commerce App", description: "Wand selection made magical" }
    },
    {
        name: "Flourish & Blotts",
        color: "#2d5a3d",
        roofColor: "#1a3326",
        accentColor: "#88cc88",
        project: { id: 2, title: "Portfolio Site", description: "Books of knowledge" }
    },
    {
        name: "Weasley's Wizard Wheezes",
        color: "#ff6600",
        roofColor: "#993d00",
        accentColor: "#ffcc00",
        project: { id: 3, title: "Game Engine", description: "Magical mischief managed" }
    },
    {
        name: "Quality Quidditch",
        color: "#4a2511",
        roofColor: "#2a1508",
        accentColor: "#cc9944",
        project: { id: 4, title: "Mobile App", description: "Broomsticks and more" }
    },
    {
        name: "Eeylops Owl Emporium",
        color: "#5a4a3a",
        roofColor: "#3a3025",
        accentColor: "#aabbcc",
        project: { id: 5, title: "Chat Application", description: "Owl post messaging" }
    },
    {
        name: "Gringotts Exchange",
        color: "#e8e8e8",
        roofColor: "#888888",
        accentColor: "#d4af37",
        project: { id: 6, title: "API Dashboard", description: "Manage your galleons" }
    },
];

export default function DiagonAlley({ onProjectSelect }) {
    return (
        <group position={[0, 0, 0]}>
            {/* Cobblestone street */}
            <CobblestoneStreet width={15} length={50} />

            {/* Sky backdrop */}
            <mesh position={[0, 20, -30]}>
                <planeGeometry args={[100, 50]} />
                <meshBasicMaterial color="#1a1a2e" />
            </mesh>

            {/* Shops on the left side */}
            <ShopFacade
                position={[-6, 0, -15]}
                rotation={[0, 0.1, 0]}
                shop={shops[0]}
                onClick={() => onProjectSelect?.(shops[0].project)}
            />
            <ShopFacade
                position={[-7, 0, 0]}
                rotation={[0, 0.05, 0]}
                shop={shops[1]}
                onClick={() => onProjectSelect?.(shops[1].project)}
            />
            <ShopFacade
                position={[-6, 0, 15]}
                rotation={[0, -0.05, 0]}
                shop={shops[2]}
                onClick={() => onProjectSelect?.(shops[2].project)}
            />

            {/* Shops on the right side */}
            <ShopFacade
                position={[6, 0, -15]}
                rotation={[0, -0.1, 0]}
                shop={shops[3]}
                onClick={() => onProjectSelect?.(shops[3].project)}
            />
            <ShopFacade
                position={[7, 0, 0]}
                rotation={[0, -0.05, 0]}
                shop={shops[4]}
                onClick={() => onProjectSelect?.(shops[4].project)}
            />
            <ShopFacade
                position={[6, 0, 15]}
                rotation={[0, 0.05, 0]}
                shop={shops[5]}
                onClick={() => onProjectSelect?.(shops[5].project)}
            />

            {/* Street lamps */}
            <StreetLamp position={[-3, 0, -12]} />
            <StreetLamp position={[3, 0, -12]} />
            <StreetLamp position={[-3, 0, 3]} />
            <StreetLamp position={[3, 0, 3]} />
            <StreetLamp position={[-3, 0, 18]} />
            <StreetLamp position={[3, 0, 18]} />

            {/* Central fountain/monument */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[2, 2.5, 1, 16]} />
                    <meshStandardMaterial color="#666666" roughness={0.8} />
                </mesh>
                <mesh position={[0, 1.5, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
                    <meshStandardMaterial color="#555555" roughness={0.7} />
                </mesh>
                <mesh position={[0, 3, 0]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffcc00" distance={8} />
            </group>

            {/* Ambient lighting */}
            <ambientLight intensity={0.3} color="#aabbcc" />
            <directionalLight position={[10, 20, 10]} intensity={0.5} color="#ffeedd" />
        </group>
    );
}
