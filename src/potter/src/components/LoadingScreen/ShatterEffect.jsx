import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * ShatterEffect - Glass shatter transition effect
 * Creates fragments that explode outward when loading is complete
 */
const ShatterEffect = ({ isActive = false, onComplete }) => {
    const groupRef = useRef();
    const [fragments, setFragments] = useState([]);
    const hasAnimated = useRef(false);
    const { viewport } = useThree();

    // Create glass fragments
    const fragmentData = useMemo(() => {
        const frags = [];
        const rows = 8;
        const cols = 12;
        const fragWidth = (viewport.width * 1.2) / cols;
        const fragHeight = (viewport.height * 1.2) / rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = (j - cols / 2 + 0.5) * fragWidth;
                const y = (i - rows / 2 + 0.5) * fragHeight;

                // Random offset for organic look
                const offsetX = (Math.random() - 0.5) * fragWidth * 0.3;
                const offsetY = (Math.random() - 0.5) * fragHeight * 0.3;

                frags.push({
                    id: `${i}-${j}`,
                    position: [x + offsetX, y + offsetY, 0],
                    rotation: [0, 0, Math.random() * 0.2 - 0.1],
                    scale: [
                        fragWidth * (0.8 + Math.random() * 0.4),
                        fragHeight * (0.8 + Math.random() * 0.4),
                        0.02
                    ],
                    // Random velocity for explosion
                    velocity: {
                        x: (x / viewport.width) * 3 + (Math.random() - 0.5) * 2,
                        y: (y / viewport.height) * 3 + (Math.random() - 0.5) * 2,
                        z: -2 - Math.random() * 3,
                        rotX: (Math.random() - 0.5) * 10,
                        rotY: (Math.random() - 0.5) * 10,
                        rotZ: (Math.random() - 0.5) * 10,
                    },
                    delay: Math.random() * 0.1,
                });
            }
        }
        return frags;
    }, [viewport]);

    // Trigger shatter animation
    useEffect(() => {
        if (isActive && !hasAnimated.current) {
            hasAnimated.current = true;
            setFragments(fragmentData);

            // Animate each fragment
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 1500);
        }
    }, [isActive, fragmentData, onComplete]);

    if (!isActive || fragments.length === 0) return null;

    return (
        <group ref={groupRef}>
            {fragments.map((frag) => (
                <ShatterFragment
                    key={frag.id}
                    initialPosition={frag.position}
                    initialRotation={frag.rotation}
                    scale={frag.scale}
                    velocity={frag.velocity}
                    delay={frag.delay}
                />
            ))}
        </group>
    );
};

/**
 * Individual glass fragment that animates
 */
const ShatterFragment = ({ initialPosition, initialRotation, scale, velocity, delay }) => {
    const meshRef = useRef();
    const startTime = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useFrame((state) => {
        if (!meshRef.current) return;

        if (startTime.current === null) {
            startTime.current = state.clock.getElapsedTime() + delay;
        }

        const elapsed = state.clock.getElapsedTime() - startTime.current;

        if (elapsed < 0) return; // Still in delay

        const t = elapsed;
        const gravity = -5;

        // Update position with physics
        meshRef.current.position.x = initialPosition[0] + velocity.x * t;
        meshRef.current.position.y = initialPosition[1] + velocity.y * t + 0.5 * gravity * t * t;
        meshRef.current.position.z = initialPosition[2] + velocity.z * t;

        // Update rotation
        meshRef.current.rotation.x = initialRotation[0] + velocity.rotX * t;
        meshRef.current.rotation.y = initialRotation[1] + velocity.rotY * t;
        meshRef.current.rotation.z = initialRotation[2] + velocity.rotZ * t;

        // Fade out
        if (meshRef.current.material) {
            meshRef.current.material.opacity = Math.max(0, 1 - t * 0.8);
        }

        // Hide when faded
        if (t > 1.5) {
            setIsVisible(false);
        }
    });

    if (!isVisible) return null;

    return (
        <mesh
            ref={meshRef}
            position={initialPosition}
            rotation={initialRotation}
            scale={scale}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                color="#0a0a15"
                transparent
                opacity={1}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default ShatterEffect;
