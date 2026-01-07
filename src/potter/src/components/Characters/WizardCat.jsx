import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

/**
 * WizardCat - A low-poly cat with wizard hat and idle animations
 * Click for meow + jump animation
 */
export default function WizardCat({ position = [0, 0, 0], scale = 1 }) {
    const groupRef = useRef();
    const tailRef = useRef();
    const earLeftRef = useRef();
    const earRightRef = useRef();
    const bodyRef = useRef();

    const [isHovered, setIsHovered] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const jumpStartTime = useRef(0);

    useCursor(isHovered);

    // Idle and jump animations
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Jump animation
        if (isJumping && groupRef.current) {
            const jumpProgress = (time - jumpStartTime.current) / 0.5; // 0.5s jump
            if (jumpProgress <= 1) {
                // Parabolic jump
                groupRef.current.position.y = position[1] + Math.sin(jumpProgress * Math.PI) * 0.8;
            } else {
                groupRef.current.position.y = position[1];
                setIsJumping(false);
            }
        }

        // Tail swish
        if (tailRef.current) {
            tailRef.current.rotation.z = Math.sin(time * 2) * 0.4;
            tailRef.current.rotation.x = Math.sin(time * 1.5) * 0.2;
        }

        // Ear twitch
        if (earLeftRef.current && earRightRef.current) {
            const twitch = Math.sin(time * 8) > 0.95 ? 0.2 : 0;
            earLeftRef.current.rotation.z = 0.3 + twitch;
            earRightRef.current.rotation.z = -0.3 - twitch;
        }

        // Breathing
        if (bodyRef.current) {
            const breathe = 1 + Math.sin(time * 2) * 0.03;
            bodyRef.current.scale.y = breathe;
        }
    });

    const handleClick = () => {
        if (!isJumping) {
            setIsJumping(true);
            jumpStartTime.current = performance.now() / 1000;
            // Could trigger meow sound here
        }
    };

    return (
        <group
            ref={groupRef}
            position={position}
            scale={scale}
            onClick={handleClick}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.4, 0]} castShadow>
                <capsuleGeometry args={[0.35, 0.5, 4, 8]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.9, 0.25]} castShadow>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>

            {/* Snout */}
            <mesh position={[0, 0.82, 0.5]}>
                <sphereGeometry args={[0.12, 6, 6]} />
                <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
            </mesh>

            {/* Nose */}
            <mesh position={[0, 0.85, 0.6]}>
                <sphereGeometry args={[0.04, 4, 4]} />
                <meshStandardMaterial color="#ff9999" roughness={0.5} />
            </mesh>

            {/* Eyes */}
            {[-0.1, 0.1].map((x, i) => (
                <group key={i} position={[x, 0.95, 0.45]}>
                    <mesh>
                        <sphereGeometry args={[0.08, 6, 6]} />
                        <meshBasicMaterial color="#ffff00" />
                    </mesh>
                    <mesh position={[0, 0, 0.05]}>
                        <sphereGeometry args={[0.04, 4, 4]} />
                        <meshBasicMaterial color="#000000" />
                    </mesh>
                </group>
            ))}

            {/* Left Ear */}
            <mesh ref={earLeftRef} position={[-0.2, 1.15, 0.15]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>

            {/* Right Ear */}
            <mesh ref={earRightRef} position={[0.2, 1.15, 0.15]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>

            {/* Front Legs */}
            {[-0.15, 0.15].map((x, i) => (
                <mesh key={i} position={[x, 0.15, 0.2]} castShadow>
                    <capsuleGeometry args={[0.08, 0.2, 4, 6]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
                </mesh>
            ))}

            {/* Back Legs */}
            {[-0.18, 0.18].map((x, i) => (
                <mesh key={i} position={[x, 0.2, -0.2]} castShadow>
                    <capsuleGeometry args={[0.1, 0.25, 4, 6]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
                </mesh>
            ))}

            {/* Tail */}
            <group ref={tailRef} position={[0, 0.4, -0.4]}>
                <mesh rotation={[0.5, 0, 0]} position={[0, 0.2, -0.2]}>
                    <capsuleGeometry args={[0.05, 0.5, 4, 6]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
                </mesh>
            </group>

            {/* WIZARD HAT */}
            <group position={[0, 1.2, 0.1]} rotation={[0.2, 0, 0]}>
                {/* Hat brim */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.05, 8]} />
                    <meshStandardMaterial color="#4a0080" roughness={0.6} />
                </mesh>
                {/* Hat cone */}
                <mesh position={[0, 0.25, 0]}>
                    <coneGeometry args={[0.25, 0.5, 8]} />
                    <meshStandardMaterial color="#4a0080" roughness={0.6} />
                </mesh>
                {/* Hat band */}
                <mesh position={[0, 0.08, 0]}>
                    <cylinderGeometry args={[0.26, 0.26, 0.08, 8]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.3} />
                </mesh>
                {/* Star on hat */}
                <mesh position={[0, 0.52, 0.15]} rotation={[0.3, 0, 0]}>
                    <octahedronGeometry args={[0.08, 0]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        emissive="#ffd700"
                        emissiveIntensity={0.5}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>
            </group>

            {/* Collar with bell */}
            <mesh position={[0, 0.65, 0.2]}>
                <torusGeometry args={[0.18, 0.03, 6, 12]} />
                <meshStandardMaterial color="#8b0000" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.58, 0.35]}>
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
}
