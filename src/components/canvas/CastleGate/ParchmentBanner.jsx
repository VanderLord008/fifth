/**
 * 📜 Parchment Banner - Floating info banner with name and title
 * Click to enter the portfolio
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function ParchmentBanner({
    position = [5, 1, 3],
    name = "Vaibhav Sharma",
    title = "Web Developer & 3D Enthusiast",
    tagline = "Creating magical digital experiences",
    onClick
}) {
    const groupRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (groupRef.current) {
            // Gentle floating motion
            groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
            groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.03;

            // Subtle scale on hover
            const targetScale = isHovered ? 1.05 : 1;
            groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.1;
            groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.1;
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={onClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
        >
            {/* Parchment background */}
            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[4, 3]} />
                <meshStandardMaterial
                    color="#fef3c7"
                    roughness={0.9}
                />
            </mesh>

            {/* Parchment edge/border */}
            <mesh position={[0, 0, -0.06]}>
                <planeGeometry args={[4.2, 3.2]} />
                <meshStandardMaterial
                    color="#d97706"
                    roughness={0.8}
                />
            </mesh>

            {/* Decorative top scroll */}
            <mesh position={[0, 1.6, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 4.3, 12]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>

            {/* Decorative bottom scroll */}
            <mesh position={[0, -1.6, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 4.3, 12]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>

            {/* Name text */}
            <Text
                position={[0, 0.8, 0.01]}
                fontSize={0.35}
                color="#1e1b4b"
                anchorX="center"
                anchorY="middle"
            >
                {name}
            </Text>

            {/* Title text */}
            <Text
                position={[0, 0.25, 0.01]}
                fontSize={0.18}
                color="#4a5568"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
            >
                {title}
            </Text>

            {/* Tagline text */}
            <Text
                position={[0, -0.2, 0.01]}
                fontSize={0.14}
                color="#6b7280"
                anchorX="center"
                anchorY="middle"
                maxWidth={3.5}
                fontStyle="italic"
            >
                {tagline}
            </Text>

            {/* Enter button */}
            <group position={[0, -0.8, 0.01]}>
                {/* Button background */}
                <mesh>
                    <planeGeometry args={[1.5, 0.5]} />
                    <meshStandardMaterial
                        color={isHovered ? "#7c3aed" : "#6366f1"}
                    />
                </mesh>

                {/* Button text */}
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.2}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    ✨ Enter ✨
                </Text>
            </group>

            {/* Decorative stars */}
            <Text position={[-1.5, 0.8, 0.01]} fontSize={0.2} color="#fbbf24">✦</Text>
            <Text position={[1.5, 0.8, 0.01]} fontSize={0.2} color="#fbbf24">✦</Text>
            <Text position={[-1.7, -0.5, 0.01]} fontSize={0.15} color="#a78bfa">☆</Text>
            <Text position={[1.7, -0.5, 0.01]} fontSize={0.15} color="#a78bfa">☆</Text>
        </group>
    );
}
