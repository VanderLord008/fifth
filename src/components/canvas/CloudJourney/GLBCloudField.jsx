/**
 * ☁️ GLB Cloud Model - Uses the provided Cloud.glb file
 * Positioned throughout the scene for immersive flying experience
 */

import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';

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
    const { scene } = useGLTF('/models/Cloud.glb');

    // Clone materials for solid clouds
    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                // Solid clouds - no transparency
                child.material.transparent = false;
                child.material.opacity = 1.0;
                child.material.depthWrite = true;
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
    // Generate many clouds spread throughout a large environment
    const clouds = useMemo(() => {
        const data = [];

        // Close clouds on sides - flanking the flight path (not in the way)
        for (let i = 0; i < 16; i++) {
            const side = i % 2 === 0 ? -1 : 1;
            data.push({
                position: [
                    side * (25 + Math.random() * 20), // Pushed further to sides
                    -10 + Math.random() * 25,
                    -40 + i * 25
                ],
                scale: 4 + Math.random() * 3,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `close-${i}`
            });
        }

        // Upper cloud layer - above the camera path
        for (let i = 0; i < 20; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 200,
                    18 + Math.random() * 20, // Higher up
                    -50 + i * 20 + Math.random() * 15
                ],
                scale: 5 + Math.random() * 4,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `upper-${i}`
            });
        }

        // Lower cloud layer - below the camera path
        for (let i = 0; i < 18; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 180,
                    -15 - Math.random() * 15, // Below
                    -30 + i * 22 + Math.random() * 10
                ],
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

        // Distant background clouds - very far
        for (let i = 0; i < 15; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 250,
                    Math.random() * 40 - 10,
                    250 + i * 30 + Math.random() * 20
                ],
                scale: 8 + Math.random() * 6,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `far-${i}`
            });
        }

        // Extra scattered clouds for density
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            data.push({
                position: [
                    Math.cos(angle) * distance,
                    -12 + Math.random() * 35,
                    Math.random() * 350 - 30
                ],
                scale: 4 + Math.random() * 4,
                rotation: [0, Math.random() * Math.PI * 2, 0],
                opacity: 1.0,
                id: `scatter-${i}`
            });
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
