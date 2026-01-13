/**
 * ☁️ GLB Cloud Model - Uses the provided Cloud.glb file
 * Positioned throughout the scene for immersive flying experience
 */

import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';

// Model path with base URL for GitHub Pages
const CLOUD_MODEL_PATH = `${import.meta.env.BASE_URL}models/Cloud.glb`;

// Single cloud instance with the GLB model
function CloudModel({
    position = [0, 0, 0],
    scale = 1,
    rotation = [0, 0, 0],
    opacity = 0.9
}) {
    const meshRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    // Load the cloud model from public folder
    const { scene } = useGLTF(CLOUD_MODEL_PATH);

    // Clone materials for solid clouds with castle theme colors
    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        // Castle cloud colors: dusty rose, soft pink, mauve, light gray
        const cloudColors = [0xc9a0a0, 0xd0c5c5, 0xa08090, 0xc08585];
        const colorIndex = Math.floor(Math.random() * cloudColors.length);

        clone.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                // Solid clouds with castle pink/rose palette
                child.material.transparent = false;
                child.material.opacity = 1.0;
                child.material.depthWrite = true;
                // Apply random castle cloud color
                child.material.color.setHex(cloudColors[colorIndex]);
                child.material.emissive.setHex(0x2a1520); // Subtle warm glow
                child.material.emissiveIntensity = 0.1;
            }
        });
        return clone;
    }, [scene]);

    // Gentle floating animation
    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;
            meshRef.current.position.y = position[1] + Math.sin(time * 0.15 + phase) * 0.5;
        }
    });

    return (
        <group
            ref={meshRef}
            position={position}
            rotation={[0, rotation[1], rotation[2]]}
            scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
        >
            <primitive object={clonedScene} />
        </group>
    );
}

export default function GLBCloudField() {
    // Helper: check if position is in the camera's flight path
    // Camera flies at x≈0, y≈5, from z=0 to z=230
    const isInFlightPath = (x, y, z) => {
        const pathWidth = 20;  // How wide to clear (x axis)
        const pathTop = 15;    // Clear up to this height
        const pathBottom = -5; // Clear down to this level
        const pathEnd = 240;   // Where the path ends

        return (
            Math.abs(x) < pathWidth &&
            y > pathBottom && y < pathTop &&
            z > -10 && z < pathEnd
        );
    };

    // Generate clouds spread throughout, avoiding the flight path
    const clouds = useMemo(() => {
        const data = [];

        // Side clouds - flanking the flight path
        for (let i = 0; i < 16; i++) {
            const side = i % 2 === 0 ? -1 : 1;
            const x = side * (30 + Math.random() * 25);
            const y = -10 + Math.random() * 25;
            const z = -40 + i * 25;

            if (!isInFlightPath(x, y, z)) {
                data.push({
                    position: [x, y, z],
                    scale: 4 + Math.random() * 3,
                    rotation: [0, Math.random() * Math.PI * 2, 0],
                    opacity: 1.0,
                    id: `close-${i}`
                });
            }
        }

        // Upper cloud layer - high above camera
        for (let i = 0; i < 20; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = 20 + Math.random() * 25;
            const z = -50 + i * 20 + Math.random() * 15;

            data.push({
                position: [x, y, z],
                scale: 5 + Math.random() * 4,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `upper-${i}`
            });
        }

        // Lower cloud layer - below camera
        for (let i = 0; i < 18; i++) {
            const x = (Math.random() - 0.5) * 180;
            const y = -20 - Math.random() * 15;
            const z = -30 + i * 22 + Math.random() * 10;

            data.push({
                position: [x, y, z],
                scale: 5 + Math.random() * 4,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `lower-${i}`
            });
        }

        // Far left wall of clouds
        for (let i = 0; i < 12; i++) {
            data.push({
                position: [
                    -60 - Math.random() * 40,
                    -10 + Math.random() * 30,
                    -20 + i * 30
                ],
                scale: 6 + Math.random() * 5,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `left-${i}`
            });
        }

        // Far right wall of clouds
        for (let i = 0; i < 12; i++) {
            data.push({
                position: [
                    60 + Math.random() * 40,
                    -10 + Math.random() * 30,
                    -20 + i * 30
                ],
                scale: 6 + Math.random() * 5,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `right-${i}`
            });
        }

        // Distant background clouds - behind the castle
        for (let i = 0; i < 15; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 250,
                    Math.random() * 40 - 10,
                    280 + i * 30 + Math.random() * 20
                ],
                scale: 8 + Math.random() * 6,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `far-${i}`
            });
        }

        // Scattered clouds - but not in the path
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 60;
            const x = Math.cos(angle) * distance;
            const y = -12 + Math.random() * 35;
            const z = Math.random() * 350 - 30;

            if (!isInFlightPath(x, y, z)) {
                data.push({
                    position: [x, y, z],
                    scale: 4 + Math.random() * 4,
                    rotation: [0, Math.random() * Math.PI * 2, 0],
                    opacity: 1.0,
                    id: `scatter-${i}`
                });
            }
        }

        return data;
    }, []);

    return (
        <Suspense fallback={null}>
            {clouds.map((cloud) => (
                <CloudModel
                    key={cloud.id}
                    position={cloud.position}
                    scale={cloud.scale}
                    rotation={cloud.rotation}
                    opacity={cloud.opacity}
                />
            ))}
        </Suspense>
    );
}
