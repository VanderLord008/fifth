import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Gate - Animated entrance with portcullis and oak doors
 * Click to trigger open animation sequence
 */
export default function Gate({ position = [0, 0, 0], onOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('closed'); // closed, portcullis, doors, open

    const portcullisRef = useRef();
    const leftDoorRef = useRef();
    const rightDoorRef = useRef();
    const glowRef = useRef();

    useCursor(isHovered && !isOpen);

    // Animation logic
    useFrame((state, delta) => {
        // Portcullis rising animation
        if (animationPhase === 'portcullis' && portcullisRef.current) {
            portcullisRef.current.position.y += delta * 2;
            if (portcullisRef.current.position.y >= 4) {
                portcullisRef.current.position.y = 4;
                setAnimationPhase('doors');
            }
        }

        // Doors swinging open
        if (animationPhase === 'doors') {
            if (leftDoorRef.current && rightDoorRef.current) {
                leftDoorRef.current.rotation.y -= delta * 1.5;
                rightDoorRef.current.rotation.y += delta * 1.5;

                if (leftDoorRef.current.rotation.y <= -Math.PI / 2) {
                    leftDoorRef.current.rotation.y = -Math.PI / 2;
                    rightDoorRef.current.rotation.y = Math.PI / 2;
                    setAnimationPhase('open');
                    onOpen?.();
                }
            }
        }

        // Hover glow effect
        if (glowRef.current) {
            const targetIntensity = isHovered && !isOpen ? 1.5 : 0;
            glowRef.current.intensity = THREE.MathUtils.lerp(
                glowRef.current.intensity,
                targetIntensity,
                delta * 5
            );
        }
    });

    const handleClick = () => {
        if (!isOpen && animationPhase === 'closed') {
            setIsOpen(true);
            setAnimationPhase('portcullis');
        }
    };

    return (
        <group position={position}>
            {/* Gate archway frame */}
            <mesh position={[0, 2, -0.1]}>
                <boxGeometry args={[3.2, 4.5, 0.3]} />
                <meshStandardMaterial color="#3a3a4a" roughness={0.9} />
            </mesh>

            {/* Portcullis (iron grid) */}
            <group ref={portcullisRef} position={[0, 0, 0.1]}>
                {/* Vertical bars */}
                {[-1, -0.5, 0, 0.5, 1].map((x, i) => (
                    <mesh key={`v-${i}`} position={[x, 2, 0]}>
                        <boxGeometry args={[0.08, 4, 0.08]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
                    </mesh>
                ))}
                {/* Horizontal bars */}
                {[0.5, 1.5, 2.5, 3.5].map((y, i) => (
                    <mesh key={`h-${i}`} position={[0, y, 0]}>
                        <boxGeometry args={[2.5, 0.08, 0.08]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
                    </mesh>
                ))}
                {/* Bottom spikes */}
                {[-1, -0.5, 0, 0.5, 1].map((x, i) => (
                    <mesh key={`spike-${i}`} position={[x, -0.2, 0]}>
                        <coneGeometry args={[0.06, 0.3, 4]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
                    </mesh>
                ))}
            </group>

            {/* Left Door */}
            <group ref={leftDoorRef} position={[-1.2, 0, 0.2]}>
                <mesh position={[0.6, 2, 0]} castShadow>
                    <boxGeometry args={[1.2, 4, 0.2]} />
                    <meshStandardMaterial color="#4a3520" roughness={0.8} />
                </mesh>
                {/* Door planks */}
                {[0.3, 0.6, 0.9].map((x, i) => (
                    <mesh key={i} position={[x, 2, 0.12]}>
                        <boxGeometry args={[0.35, 3.8, 0.05]} />
                        <meshStandardMaterial color="#3a2510" roughness={0.9} />
                    </mesh>
                ))}
                {/* Door handle */}
                <mesh position={[1, 2, 0.2]}>
                    <torusGeometry args={[0.1, 0.03, 8, 16]} />
                    <meshStandardMaterial color="#8b7355" metalness={0.6} roughness={0.4} />
                </mesh>
                {/* Iron bands */}
                {[0.8, 2, 3.2].map((y, i) => (
                    <mesh key={`band-${i}`} position={[0.6, y, 0.12]}>
                        <boxGeometry args={[1.25, 0.15, 0.05]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
                    </mesh>
                ))}
            </group>

            {/* Right Door */}
            <group ref={rightDoorRef} position={[1.2, 0, 0.2]}>
                <mesh position={[-0.6, 2, 0]} castShadow>
                    <boxGeometry args={[1.2, 4, 0.2]} />
                    <meshStandardMaterial color="#4a3520" roughness={0.8} />
                </mesh>
                {/* Door planks */}
                {[-0.3, -0.6, -0.9].map((x, i) => (
                    <mesh key={i} position={[x, 2, 0.12]}>
                        <boxGeometry args={[0.35, 3.8, 0.05]} />
                        <meshStandardMaterial color="#3a2510" roughness={0.9} />
                    </mesh>
                ))}
                {/* Door handle */}
                <mesh position={[-1, 2, 0.2]}>
                    <torusGeometry args={[0.1, 0.03, 8, 16]} />
                    <meshStandardMaterial color="#8b7355" metalness={0.6} roughness={0.4} />
                </mesh>
                {/* Iron bands */}
                {[0.8, 2, 3.2].map((y, i) => (
                    <mesh key={`band-${i}`} position={[-0.6, y, 0.12]}>
                        <boxGeometry args={[1.25, 0.15, 0.05]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
                    </mesh>
                ))}
            </group>

            {/* Click trigger zone (invisible) */}
            <mesh
                position={[0, 2, 0.5]}
                onClick={handleClick}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                <boxGeometry args={[2.8, 4, 0.5]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Hover glow */}
            <pointLight
                ref={glowRef}
                position={[0, 2, 1]}
                color="#ffd700"
                intensity={0}
                distance={5}
            />

            {/* Ground stones at threshold */}
            <mesh position={[0, -0.1, 0.5]} receiveShadow>
                <boxGeometry args={[3, 0.2, 1]} />
                <meshStandardMaterial color="#4a4a5a" roughness={0.9} />
            </mesh>
        </group>
    );
}
