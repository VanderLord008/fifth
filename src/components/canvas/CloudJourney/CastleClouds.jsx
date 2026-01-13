/**
 * ☁️ Castle Clouds - Extract pSphere meshes from Castle.glb as clouds
 * Uses pSphere13, pSphere14, pSphere15 from the castle model
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';
import { useControls, folder } from 'leva';

// Model path with base URL for GitHub Pages
const CASTLE_MODEL_PATH = `${import.meta.env.BASE_URL}models/Castle.glb`;

export default function CastleClouds({ count = 30 }) {
    const groupRef = useRef();
    const { scene } = useGLTF(CASTLE_MODEL_PATH);

    // Debug controls
    const { cloudScale, cloudSpread, cloudHeight, cloudDepth } = useControls('Castle Clouds', {
        cloudScale: { value: 3, min: 0.5, max: 20, step: 0.5 },
        cloudSpread: { value: 80, min: 20, max: 200, step: 10 },
        cloudHeight: { value: 8, min: 0, max: 30, step: 1 },
        cloudDepth: { value: 200, min: 50, max: 400, step: 10 },
    });

    // Find sphere meshes (clouds) in the scene
    const cloudMeshes = useMemo(() => {
        const clouds = [];

        scene.traverse((child) => {
            // Look for pSphere meshes - these are the clouds
            if (child.isMesh && child.name.toLowerCase().includes('psphere')) {
                console.log(`Found cloud mesh: ${child.name}`);
                clouds.push(child);
            }
        });

        console.log(`Total cloud meshes found: ${clouds.length}`);
        return clouds;
    }, [scene]);

    // Generate random positions for cloud instances
    const cloudInstances = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * cloudSpread,
                cloudHeight + Math.random() * 8 - 4,
                Math.random() * cloudDepth, // Spread along the journey path (z=0 to castle)
            ],
            rotation: [
                Math.random() * 0.3,
                Math.random() * Math.PI * 2,
                Math.random() * 0.3
            ],
            scale: cloudScale * (0.5 + Math.random() * 1),
            meshIndex: Math.floor(Math.random() * Math.max(1, cloudMeshes.length)),
        }));
    }, [count, cloudSpread, cloudHeight, cloudScale, cloudDepth, cloudMeshes.length]);

    // Gentle cloud drift
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            groupRef.current.children.forEach((child, i) => {
                child.position.y += Math.sin(time * 0.15 + i * 0.5) * 0.002;
                child.position.x += Math.sin(time * 0.1 + i) * 0.001;
            });
        }
    });

    // Render cloud instances
    if (cloudMeshes.length > 0) {
        return (
            <group ref={groupRef}>
                {cloudInstances.map((props, i) => (
                    <group
                        key={i}
                        position={props.position}
                        rotation={props.rotation}
                        scale={props.scale}
                    >
                        <Clone object={cloudMeshes[props.meshIndex % cloudMeshes.length]} />
                    </group>
                ))}
            </group>
        );
    }

    // Fallback message if no clouds found
    console.warn('No pSphere cloud meshes found in Castle.glb');
    return null;
}

useGLTF.preload(CASTLE_MODEL_PATH);
