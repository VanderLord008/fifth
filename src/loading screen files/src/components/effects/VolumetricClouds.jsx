/**
 * VolumetricClouds - Billboard cloud sprites for Atmos-like effect
 * Multiple layers with parallax and soft blending
 */

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Simple cloud texture generator
function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Create soft radial gradient for cloud puff
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
}

// Single cloud puff component
function CloudPuff({ position, scale, opacity, speed }) {
    const meshRef = useRef();
    const { camera } = useThree();

    const texture = useMemo(() => createCloudTexture(), []);

    useFrame((state) => {
        if (meshRef.current) {
            // Billboard - always face camera
            meshRef.current.quaternion.copy(camera.quaternion);

            // Gentle float animation
            const time = state.clock.elapsedTime * speed;
            meshRef.current.position.y = position[1] + Math.sin(time) * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={[scale, scale]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={opacity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

// Cloud layer - generates multiple puffs at a depth
function CloudLayer({
    count = 20,
    depth = 0,
    spread = 50,
    baseScale = 10,
    baseOpacity = 0.4,
    color = '#ffffff'
}) {
    const clouds = useMemo(() => {
        const items = [];
        for (let i = 0; i < count; i++) {
            items.push({
                position: [
                    (Math.random() - 0.5) * spread,
                    (Math.random() - 0.5) * spread * 0.4 - 5,
                    depth + (Math.random() - 0.5) * 30
                ],
                scale: baseScale + Math.random() * baseScale * 2,
                opacity: baseOpacity + Math.random() * 0.2,
                speed: 0.1 + Math.random() * 0.2
            });
        }
        return items;
    }, [count, depth, spread, baseScale, baseOpacity]);

    return (
        <group>
            {clouds.map((cloud, i) => (
                <CloudPuff key={i} {...cloud} />
            ))}
        </group>
    );
}

// Main volumetric clouds component
export default function VolumetricClouds() {
    const groupRef = useRef();

    return (
        <group ref={groupRef}>
            {/* Near layer - large, sparse */}
            <CloudLayer
                count={15}
                depth={-20}
                spread={80}
                baseScale={15}
                baseOpacity={0.3}
            />

            {/* Mid layer - medium density */}
            <CloudLayer
                count={25}
                depth={-60}
                spread={100}
                baseScale={20}
                baseOpacity={0.4}
            />

            {/* Far layer - many small clouds */}
            <CloudLayer
                count={40}
                depth={-120}
                spread={150}
                baseScale={25}
                baseOpacity={0.5}
            />

            {/* Distant haze layer */}
            <CloudLayer
                count={50}
                depth={-200}
                spread={200}
                baseScale={40}
                baseOpacity={0.6}
            />
        </group>
    );
}
