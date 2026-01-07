import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight } from 'three';
import gsap from 'gsap';

/**
 * WandTrace - A glowing wand tip that follows a path
 * Creates a magical particle effect as it traces the rune
 */
const WandTrace = ({ progress = 0, path, isTracing = true }) => {
    const lightRef = useRef();
    const glowRef = useRef();
    const particlesRef = useRef();

    // Animate the glow intensity based on progress
    useEffect(() => {
        if (lightRef.current) {
            gsap.to(lightRef.current, {
                intensity: 0.5 + (progress / 100) * 2,
                duration: 0.3,
            });
        }
    }, [progress]);

    // Subtle floating animation
    useFrame((state) => {
        if (glowRef.current && isTracing) {
            const t = state.clock.getElapsedTime();
            glowRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.1);
        }
    });

    return (
        <group>
            {/* Main wand tip glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial
                    color="#ffeaa7"
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Inner bright core */}
            <mesh>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Outer glow halo */}
            <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial
                    color="#f4d03f"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Point light for illumination */}
            <pointLight
                ref={lightRef}
                color="#ffeaa7"
                intensity={1}
                distance={3}
                decay={2}
            />
        </group>
    );
};

export default WandTrace;
