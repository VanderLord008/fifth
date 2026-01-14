/**
 * 🚪 Castle Door with Portal - Animated doors that open to reveal swirling portal
 * Click to open doors and see the magical portal effect
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { AdditiveBlending } from 'three';
import { useControls, folder } from 'leva';
import './PortalShaderMaterial'; // This extends the material

export default function CastleDoorPortal({
    position = [0, 0, 0],
    onEnter,
    colorStart = 'hotpink',
    colorEnd = 'white',
}) {
    const portalMaterial = useRef();
    const leftDoorRef = useRef();
    const rightDoorRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Leva controls
    const { doorWidth, doorHeight, portalRadius, portalColorStart, portalColorEnd } = useControls('Castle Door', {
        door: folder({
            doorWidth: { value: 1.2, min: 0.5, max: 3, step: 0.1 },
            doorHeight: { value: 2.5, min: 1, max: 5, step: 0.1 },
        }),
        portal: folder({
            portalRadius: { value: 1.0, min: 0.3, max: 2, step: 0.1 },
            portalColorStart: { value: '#ff69b4' }, // hotpink
            portalColorEnd: { value: '#ffffff' },
        }),
    });

    // Animate portal shader time
    useFrame((state, delta) => {
        if (portalMaterial.current) {
            portalMaterial.current.uTime += delta;
        }

        // Animate doors opening/closing
        if (leftDoorRef.current && rightDoorRef.current) {
            const targetRotation = isOpen ? -Math.PI / 2 : 0;
            const speed = 3;

            // Left door rotates on its left edge
            leftDoorRef.current.rotation.y += (targetRotation - leftDoorRef.current.rotation.y) * speed * delta;
            // Right door rotates on its right edge (opposite direction)
            rightDoorRef.current.rotation.y += (-targetRotation - rightDoorRef.current.rotation.y) * speed * delta;
        }
    });

    const handleClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen && onEnter) {
            // Delay onEnter until door is open
            setTimeout(() => onEnter(), 500);
        }
    };

    return (
        <group position={position}>
            {/* Portal circle behind doors */}
            <mesh position={[0, doorHeight / 2, -0.1]} rotation={[0, 0, 0]}>
                <circleGeometry args={[portalRadius, 64]} />
                <portalMaterial
                    ref={portalMaterial}
                    blending={AdditiveBlending}
                    uColorStart={portalColorStart}
                    uColorEnd={portalColorEnd}
                    transparent
                />
            </mesh>

            {/* Sparkles around portal */}
            <Sparkles
                count={50}
                size={2}
                position={[0, doorHeight / 2, 0]}
                scale={[doorWidth * 2, doorHeight, 1]}
                speed={0.3}
                color={portalColorStart}
            />

            {/* Left Door */}
            <group position={[-doorWidth / 2, 0, 0]}>
                <mesh
                    ref={leftDoorRef}
                    position={[doorWidth / 4, doorHeight / 2, 0]}
                    onClick={handleClick}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    {/* Door pivot is on the left edge */}
                    <boxGeometry args={[doorWidth / 2, doorHeight, 0.1]} />
                    <meshStandardMaterial
                        color={hovered ? "#5a3d2b" : "#4a2c1a"}
                        metalness={0.3}
                        roughness={0.7}
                    />
                </mesh>
                {/* Door handle */}
                <mesh position={[doorWidth / 3, doorHeight / 2, 0.08]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* Right Door */}
            <group position={[doorWidth / 2, 0, 0]}>
                <mesh
                    ref={rightDoorRef}
                    position={[-doorWidth / 4, doorHeight / 2, 0]}
                    onClick={handleClick}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    {/* Door pivot is on the right edge */}
                    <boxGeometry args={[doorWidth / 2, doorHeight, 0.1]} />
                    <meshStandardMaterial
                        color={hovered ? "#5a3d2b" : "#4a2c1a"}
                        metalness={0.3}
                        roughness={0.7}
                    />
                </mesh>
                {/* Door handle */}
                <mesh position={[-doorWidth / 3, doorHeight / 2, 0.08]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* Door Frame */}
            <mesh position={[0, doorHeight + 0.1, 0]}>
                <boxGeometry args={[doorWidth + 0.3, 0.2, 0.15]} />
                <meshStandardMaterial color="#3a2010" metalness={0.2} roughness={0.8} />
            </mesh>
            <mesh position={[-doorWidth / 2 - 0.1, doorHeight / 2, 0]}>
                <boxGeometry args={[0.2, doorHeight + 0.2, 0.15]} />
                <meshStandardMaterial color="#3a2010" metalness={0.2} roughness={0.8} />
            </mesh>
            <mesh position={[doorWidth / 2 + 0.1, doorHeight / 2, 0]}>
                <boxGeometry args={[0.2, doorHeight + 0.2, 0.15]} />
                <meshStandardMaterial color="#3a2010" metalness={0.2} roughness={0.8} />
            </mesh>

            {/* Light glow when open */}
            {isOpen && (
                <pointLight
                    position={[0, doorHeight / 2, 0.5]}
                    intensity={2}
                    color={portalColorStart}
                    distance={5}
                />
            )}
        </group>
    );
}
