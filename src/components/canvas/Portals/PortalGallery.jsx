/**
 * 🏛️ PortalGallery - Collection of portals
 * Simplified implementation - no CameraControls to avoid crashes
 */

import { useState, Suspense } from 'react';
import { useCursor } from '@react-three/drei';
import PortalStage from './Portal';

// Using local placeholder colors instead of remote images
const PORTALS = [
    {
        name: "Project Alpha",
        color: "#df8d52",
        position: [-2.5, 0, 0],
        rotation: [0, Math.PI / 8, 0],
    },
    {
        name: "Project Beta",
        color: "#38adcf",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
    },
    {
        name: "Project Gamma",
        color: "#739d3c",
        position: [2.5, 0, 0],
        rotation: [0, -Math.PI / 8, 0],
    },
];

// Generate a simple colored texture data URL
function createColorTexture(color) {
    // Use a simple 1x1 color as base64 data URL
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Create gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return canvas.toDataURL();
}

// Pre-generate textures
const TEXTURES = {
    orange: createColorTexture('#df8d52'),
    cyan: createColorTexture('#38adcf'),
    green: createColorTexture('#739d3c'),
};

export default function PortalGallery() {
    const [active, setActive] = useState(null);
    const [hovered, setHovered] = useState(null);
    useCursor(hovered !== null);

    return (
        <group position={[0, 0, 0]}>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <pointLight position={[0, 5, 5]} intensity={1} color="#8b5cf6" />

            {/* Portals */}
            <PortalStage
                name="Project Alpha"
                color="#df8d52"
                texture={TEXTURES.orange}
                position={[-2.5, 0, 0]}
                rotation={[0, Math.PI / 8, 0]}
                active={active}
                setActive={setActive}
                hovered={hovered}
                setHovered={setHovered}
            >
                <mesh position={[0, 0, 0]}>
                    <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />
                    <meshStandardMaterial color="#df8d52" />
                </mesh>
            </PortalStage>

            <PortalStage
                name="Project Beta"
                color="#38adcf"
                texture={TEXTURES.cyan}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                active={active}
                setActive={setActive}
                hovered={hovered}
                setHovered={setHovered}
            >
                <mesh position={[0, 0, 0]}>
                    <icosahedronGeometry args={[0.8, 0]} />
                    <meshStandardMaterial color="#38adcf" />
                </mesh>
            </PortalStage>

            <PortalStage
                name="Project Gamma"
                color="#739d3c"
                texture={TEXTURES.green}
                position={[2.5, 0, 0]}
                rotation={[0, -Math.PI / 8, 0]}
                active={active}
                setActive={setActive}
                hovered={hovered}
                setHovered={setHovered}
            >
                <mesh position={[0, 0, 0]}>
                    <octahedronGeometry args={[0.7]} />
                    <meshStandardMaterial color="#739d3c" />
                </mesh>
            </PortalStage>
        </group>
    );
}
