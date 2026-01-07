/**
 * ☁️ Volumetric Clouds - Soft, billowy cloud clusters
 * Creates Atmos-style volumetric clouds using instanced sphere clusters
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Single cloud cluster made of multiple soft spheres
function CloudCluster({
    position = [0, 0, 0],
    scale = 1,
    sphereCount = 8,
    color = '#ffffff',
    opacity = 0.85,
    speed = 0.1
}) {
    const groupRef = useRef();

    // Generate sphere positions within the cluster
    const spheres = useMemo(() => {
        const sphereData = [];
        for (let i = 0; i < sphereCount; i++) {
            // Random position within cluster bounds
            const x = (Math.random() - 0.5) * 2;
            const y = (Math.random() - 0.5) * 0.8;
            const z = (Math.random() - 0.5) * 1.5;

            // Random size variation
            const size = 0.5 + Math.random() * 1;

            // Slight opacity variation
            const sphereOpacity = opacity * (0.6 + Math.random() * 0.4);

            sphereData.push({
                position: [x, y, z],
                size,
                opacity: sphereOpacity,
                phase: Math.random() * Math.PI * 2
            });
        }
        return sphereData;
    }, [sphereCount, opacity]);

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle floating animation
            const time = state.clock.elapsedTime;
            groupRef.current.position.y = position[1] + Math.sin(time * speed + position[0]) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {spheres.map((sphere, i) => (
                <mesh key={i} position={sphere.position}>
                    <sphereGeometry args={[sphere.size, 16, 16]} />
                    <meshStandardMaterial
                        color={color}
                        transparent
                        opacity={sphere.opacity}
                        depthWrite={false}
                        roughness={1}
                        metalness={0}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Cloud layer with multiple clusters
function CloudLayer({
    y = 0,
    cloudCount = 15,
    spreadX = 100,
    spreadZ = 100,
    minScale = 2,
    maxScale = 6,
    color = '#ffffff',
    opacity = 0.8,
    speed = 0.05
}) {
    const clouds = useMemo(() => {
        const cloudData = [];
        for (let i = 0; i < cloudCount; i++) {
            const x = (Math.random() - 0.5) * spreadX;
            const z = (Math.random() - 0.5) * spreadZ;
            const yOffset = (Math.random() - 0.5) * 10;
            const scale = minScale + Math.random() * (maxScale - minScale);
            const sphereCount = Math.floor(5 + Math.random() * 8);

            cloudData.push({
                position: [x, y + yOffset, z],
                scale,
                sphereCount,
                id: i
            });
        }
        return cloudData;
    }, [cloudCount, spreadX, spreadZ, y, minScale, maxScale]);

    return (
        <group>
            {clouds.map((cloud) => (
                <CloudCluster
                    key={cloud.id}
                    position={cloud.position}
                    scale={cloud.scale}
                    sphereCount={cloud.sphereCount}
                    color={color}
                    opacity={opacity}
                    speed={speed}
                />
            ))}
        </group>
    );
}

export default function VolumetricClouds({ cameraZ = 0 }) {
    const groupRef = useRef();

    useFrame((state, delta) => {
        // Slowly drift clouds
        if (groupRef.current) {
            groupRef.current.position.z += delta * 2;

            // Reset position for infinite scroll effect
            if (groupRef.current.position.z > 50) {
                groupRef.current.position.z = -50;
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* Upper cloud layer - brighter, more visible */}
            <CloudLayer
                y={15}
                cloudCount={20}
                spreadX={150}
                spreadZ={200}
                minScale={3}
                maxScale={8}
                color="#fff5f0"
                opacity={0.9}
                speed={0.03}
            />

            {/* Middle cloud layer */}
            <CloudLayer
                y={5}
                cloudCount={25}
                spreadX={180}
                spreadZ={250}
                minScale={4}
                maxScale={10}
                color="#ffe4d4"
                opacity={0.85}
                speed={0.04}
            />

            {/* Lower cloud layer - denser, slightly darker */}
            <CloudLayer
                y={-5}
                cloudCount={30}
                spreadX={200}
                spreadZ={300}
                minScale={5}
                maxScale={12}
                color="#ffd4c4"
                opacity={0.8}
                speed={0.05}
            />

            {/* Ground fog layer */}
            <CloudLayer
                y={-20}
                cloudCount={15}
                spreadX={250}
                spreadZ={350}
                minScale={8}
                maxScale={15}
                color="#e8c8b8"
                opacity={0.6}
                speed={0.02}
            />
        </group>
    );
}
