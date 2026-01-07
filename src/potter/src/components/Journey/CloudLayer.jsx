import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CloudLayer - Volumetric cloud layers with parallax effect
 * Creates multiple layers of clouds that move past the camera
 */
const CloudLayer = ({
    count = 50,
    spread = 100,
    height = 0,
    speed = 1,
    opacity = 0.6,
    scale = 1,
    color = '#ffffff'
}) => {
    const groupRef = useRef();
    const cloudRefs = useRef([]);

    // Generate cloud positions
    const clouds = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * spread,
                height + (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * spread - 50, // Start behind camera
            ],
            rotation: [0, Math.random() * Math.PI, 0],
            scale: (0.5 + Math.random() * 1.5) * scale,
            speed: 0.5 + Math.random() * 0.5,
            wobble: Math.random() * Math.PI * 2,
        }));
    }, [count, spread, height, scale]);

    // Animate clouds
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        cloudRefs.current.forEach((cloud, i) => {
            if (cloud) {
                const data = clouds[i];

                // Move clouds toward camera (parallax effect)
                cloud.position.z += delta * speed * data.speed * 10;

                // Reset cloud position when it passes the camera
                if (cloud.position.z > 50) {
                    cloud.position.z = -spread / 2;
                    cloud.position.x = (Math.random() - 0.5) * spread;
                }

                // Subtle wobble animation
                cloud.position.y = data.position[1] + Math.sin(time * 0.5 + data.wobble) * 2;
                cloud.rotation.z = Math.sin(time * 0.3 + data.wobble) * 0.1;
            }
        });
    });

    return (
        <group ref={groupRef}>
            {clouds.map((cloud, i) => (
                <Cloud
                    key={i}
                    ref={(el) => (cloudRefs.current[i] = el)}
                    position={cloud.position}
                    rotation={cloud.rotation}
                    scale={cloud.scale}
                    opacity={opacity}
                    color={color}
                />
            ))}
        </group>
    );
};

/**
 * Individual Cloud mesh
 */
import { forwardRef } from 'react';

const Cloud = forwardRef(({ position, rotation, scale, opacity, color }, ref) => {
    // Create a cloud shape using multiple spheres
    const cloudParts = useMemo(() => {
        return [
            { pos: [0, 0, 0], scale: 1 },
            { pos: [1.2, 0.2, 0.3], scale: 0.8 },
            { pos: [-1, 0.1, -0.2], scale: 0.9 },
            { pos: [0.5, 0.4, -0.5], scale: 0.7 },
            { pos: [-0.6, 0.3, 0.4], scale: 0.75 },
            { pos: [0.8, -0.1, 0.6], scale: 0.6 },
        ];
    }, []);

    return (
        <group ref={ref} position={position} rotation={rotation} scale={scale}>
            {cloudParts.map((part, i) => (
                <mesh key={i} position={part.pos} scale={part.scale}>
                    <sphereGeometry args={[3, 8, 8]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={opacity * (0.7 + part.scale * 0.3)}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
});

Cloud.displayName = 'Cloud';

/**
 * MistWisps - Close-range fog particles that brush past the camera
 */
export const MistWisps = ({ count = 30 }) => {
    const groupRef = useRef();
    const wispRefs = useRef([]);

    const wisps = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: [
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 50 - 20,
            ],
            speed: 1 + Math.random() * 2,
            scale: 0.5 + Math.random() * 1.5,
        }));
    }, [count]);

    useFrame((state, delta) => {
        wispRefs.current.forEach((wisp, i) => {
            if (wisp) {
                const data = wisps[i];

                // Move wisps toward and past camera
                wisp.position.z += delta * data.speed * 15;

                // Fade in/out based on z position
                const dist = Math.abs(wisp.position.z);
                const opacity = dist < 10 ? (10 - dist) / 10 * 0.3 : 0.3;
                if (wisp.material) {
                    wisp.material.opacity = opacity;
                }

                // Reset when past camera
                if (wisp.position.z > 20) {
                    wisp.position.z = -30;
                    wisp.position.x = (Math.random() - 0.5) * 30;
                    wisp.position.y = (Math.random() - 0.5) * 20;
                }
            }
        });
    });

    return (
        <group ref={groupRef}>
            {wisps.map((wisp, i) => (
                <mesh
                    key={i}
                    ref={(el) => (wispRefs.current[i] = el)}
                    position={wisp.position}
                    scale={wisp.scale}
                >
                    <planeGeometry args={[8, 4]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.15}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
};

export default CloudLayer;
