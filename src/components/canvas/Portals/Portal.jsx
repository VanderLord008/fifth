/**
 * 🌀 Portal Stage - MeshPortalMaterial based portal
 * Simplified implementation to avoid WebGL crashes
 */

import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import {
    MeshPortalMaterial,
    RoundedBox,
    Text,
    useTexture,
} from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

// Simple portal with texture backdrop - no external fonts
function PortalStageInner({
    children,
    texture,
    name = "Portal",
    color = "#8b5cf6",
    active,
    setActive,
    hovered,
    setHovered,
    ...props
}) {
    const map = useTexture(texture);
    const portalMaterial = useRef();

    // Animate blend when portal is active
    useFrame((_state, delta) => {
        if (portalMaterial.current) {
            const worldOpen = active === name;
            easing.damp(portalMaterial.current, 'blend', worldOpen ? 1 : 0, 0.2, delta);
        }
    });

    return (
        <group {...props}>
            {/* Simple 3D text label using meshBasicMaterial */}
            <mesh position={[0, -1.7, 0.1]}>
                <planeGeometry args={[1.8, 0.3]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Portal Frame + Content */}
            <RoundedBox
                name={name}
                args={[2, 3, 0.1]}
                onDoubleClick={() => setActive && setActive(active === name ? null : name)}
                onPointerEnter={() => setHovered && setHovered(name)}
                onPointerLeave={() => setHovered && setHovered(null)}
            >
                <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
                    {/* Lighting inside portal */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 5, 5]} intensity={1} />

                    {/* 3D content inside portal */}
                    {children}

                    {/* Sphere backdrop with texture */}
                    <mesh>
                        <sphereGeometry args={[5, 32, 32]} />
                        <meshStandardMaterial map={map} side={THREE.BackSide} />
                    </mesh>
                </MeshPortalMaterial>
            </RoundedBox>

            {/* Frame outline */}
            <mesh position={[0, 0, -0.06]}>
                <boxGeometry args={[2.2, 3.2, 0.05]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
            </mesh>
        </group>
    );
}

// Wrapper with Suspense for texture loading
export default function PortalStage(props) {
    return (
        <Suspense fallback={
            <mesh position={props.position || [0, 0, 0]}>
                <boxGeometry args={[2, 3, 0.1]} />
                <meshBasicMaterial color="#333" />
            </mesh>
        }>
            <PortalStageInner {...props} />
        </Suspense>
    );
}
