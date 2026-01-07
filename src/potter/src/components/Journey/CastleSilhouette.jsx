import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CastleSilhouette - Distant floating castle that appears during the journey
 * Creates a mysterious silhouette that the camera approaches
 */
const CastleSilhouette = ({ position = [0, 15, -80] }) => {
    const groupRef = useRef();

    // Subtle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 1;
            groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.02;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Floating Island Base */}
            <FloatingIslandShape />

            {/* Castle Towers */}
            <CastleShape />

            {/* Magical glow behind castle */}
            <mesh position={[0, 5, -5]}>
                <circleGeometry args={[25, 32]} />
                <meshBasicMaterial
                    color="#ffd700"
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Ambient particles around castle */}
            <CastleParticles />
        </group>
    );
};

/**
 * Simple castle shape using primitives
 */
const CastleShape = () => {
    const castleColor = '#1a1a2e';

    return (
        <group position={[0, 8, 0]}>
            {/* Main tower - center */}
            <mesh position={[0, 6, 0]}>
                <cylinderGeometry args={[3, 4, 12, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>
            <mesh position={[0, 14, 0]}>
                <coneGeometry args={[4, 6, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>

            {/* Left tower */}
            <mesh position={[-8, 4, 0]}>
                <cylinderGeometry args={[2.5, 3, 8, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>
            <mesh position={[-8, 10, 0]}>
                <coneGeometry args={[3.5, 5, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>

            {/* Right tower */}
            <mesh position={[8, 4, 0]}>
                <cylinderGeometry args={[2.5, 3, 8, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>
            <mesh position={[8, 10, 0]}>
                <coneGeometry args={[3.5, 5, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>

            {/* Back towers */}
            <mesh position={[-5, 8, -5]}>
                <cylinderGeometry args={[2, 2.5, 10, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>
            <mesh position={[5, 8, -5]}>
                <cylinderGeometry args={[2, 2.5, 10, 8]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>

            {/* Connecting walls */}
            <mesh position={[-4, 1, 0]}>
                <boxGeometry args={[8, 4, 2]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>
            <mesh position={[4, 1, 0]}>
                <boxGeometry args={[8, 4, 2]} />
                <meshBasicMaterial color={castleColor} />
            </mesh>

            {/* Gate */}
            <mesh position={[0, 0, 2]}>
                <boxGeometry args={[5, 6, 2]} />
                <meshBasicMaterial color="#0a0a15" />
            </mesh>
        </group>
    );
};

/**
 * Floating island shape
 */
const FloatingIslandShape = () => {
    return (
        <group>
            {/* Main island body */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[15, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                <meshBasicMaterial color="#2d2d44" />
            </mesh>

            {/* Hanging rocks */}
            <mesh position={[-8, -8, 3]}>
                <coneGeometry args={[3, 8, 6]} />
                <meshBasicMaterial color="#1a1a2e" />
            </mesh>
            <mesh position={[6, -10, -2]}>
                <coneGeometry args={[2.5, 6, 6]} />
                <meshBasicMaterial color="#1a1a2e" />
            </mesh>
            <mesh position={[0, -12, 0]}>
                <coneGeometry args={[4, 10, 6]} />
                <meshBasicMaterial color="#1a1a2e" />
            </mesh>
        </group>
    );
};

/**
 * Magical particles floating around the castle
 */
const CastleParticles = () => {
    const particlesRef = useRef();

    const particles = useMemo(() => {
        return Array.from({ length: 30 }, () => ({
            position: [
                (Math.random() - 0.5) * 40,
                Math.random() * 30,
                (Math.random() - 0.5) * 40,
            ],
            speed: 0.5 + Math.random(),
            offset: Math.random() * Math.PI * 2,
        }));
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (particlesRef.current) {
            particlesRef.current.children.forEach((particle, i) => {
                const data = particles[i];
                particle.position.y = data.position[1] + Math.sin(time * data.speed + data.offset) * 3;
                particle.position.x = data.position[0] + Math.cos(time * data.speed * 0.5 + data.offset) * 2;
            });
        }
    });

    return (
        <group ref={particlesRef}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.position}>
                    <sphereGeometry args={[0.2, 8, 8]} />
                    <meshBasicMaterial
                        color="#ffd700"
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    );
};

export default CastleSilhouette;
