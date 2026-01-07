import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FloatingIsland - A magical floating rocky landmass
 * Features: Rocky base, grassy top, hanging fragments, floating animation
 */
export default function FloatingIsland({ position = [0, 0, 0], scale = 1 }) {
    const groupRef = useRef();
    const fragmentsRef = useRef();

    // Floating animation
    useFrame((state) => {
        if (groupRef.current) {
            // Gentle bobbing motion
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
            // Subtle rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
        }
        // Animate hanging fragments
        if (fragmentsRef.current) {
            fragmentsRef.current.children.forEach((fragment, i) => {
                fragment.position.y = fragment.userData.baseY + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.1;
            });
        }
    });

    // Generate hanging rock fragments
    const fragments = useMemo(() => {
        const frags = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 2 + Math.random() * 2;
            const baseY = -3 - Math.random() * 2;
            frags.push({
                position: [
                    Math.cos(angle) * radius,
                    baseY,
                    Math.sin(angle) * radius
                ],
                baseY,
                scale: 0.3 + Math.random() * 0.5,
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0]
            });
        }
        return frags;
    }, []);

    // Dust particles falling below
    const dustParticles = useMemo(() => {
        const particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push({
                position: [
                    (Math.random() - 0.5) * 8,
                    -4 - Math.random() * 6,
                    (Math.random() - 0.5) * 8
                ],
                scale: 0.02 + Math.random() * 0.03
            });
        }
        return particles;
    }, []);

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Main island body - tapered rocky form */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[5, 2.5, 4, 8, 1]} />
                <meshStandardMaterial
                    color="#5a4a3a"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Rocky underbelly */}
            <mesh position={[0, -3.5, 0]}>
                <coneGeometry args={[2.5, 3, 7]} />
                <meshStandardMaterial
                    color="#4a3a2a"
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            {/* Grass/ground layer on top */}
            <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[5.2, 5, 0.4, 12]} />
                <meshStandardMaterial
                    color="#2d5a2d"
                    roughness={0.8}
                    metalness={0}
                />
            </mesh>

            {/* Rocky rim around edge */}
            <mesh position={[0, 0.3, 0]}>
                <torusGeometry args={[5, 0.4, 6, 16]} />
                <meshStandardMaterial
                    color="#6a5a4a"
                    roughness={0.9}
                />
            </mesh>

            {/* Large accent rocks on surface */}
            {[
                { pos: [3.5, 1.2, 1], scale: 0.8 },
                { pos: [-2, 1.1, 3], scale: 0.6 },
                { pos: [-3.5, 1.3, -2], scale: 0.9 },
                { pos: [1, 1.1, -3.5], scale: 0.5 },
            ].map((rock, i) => (
                <mesh key={i} position={rock.pos} scale={rock.scale}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color="#7a6a5a"
                        roughness={0.95}
                        flatShading
                    />
                </mesh>
            ))}

            {/* Hanging rock fragments */}
            <group ref={fragmentsRef}>
                {fragments.map((frag, i) => (
                    <mesh
                        key={i}
                        position={frag.position}
                        rotation={frag.rotation}
                        scale={frag.scale}
                        userData={{ baseY: frag.baseY }}

                    >
                        <dodecahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color="#5a4a3a"
                            roughness={0.9}
                            flatShading
                        />
                    </mesh>
                ))}
            </group>

            {/* Dust particles */}
            {dustParticles.map((particle, i) => (
                <mesh key={`dust-${i}`} position={particle.position}>
                    <sphereGeometry args={[particle.scale, 4, 4]} />
                    <meshBasicMaterial color="#8a7a6a" transparent opacity={0.4} />
                </mesh>
            ))}
        </group>
    );
}
