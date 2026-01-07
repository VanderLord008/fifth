import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { LayerMaterial, Gradient, Noise } from 'lamina';
import * as THREE from 'three';

/**
 * Atmos-style animated gradient sky using Lamina
 * Purple/blue at top → Peach/gold at bottom
 */
export default function LaminaSky() {
    const materialRef = useRef();

    // Subtle animation of the gradient
    useFrame((state) => {
        if (materialRef.current) {
            // Very subtle color shift over time
            const t = state.clock.elapsedTime * 0.05;
            materialRef.current.layers[0].colorA.setHSL(
                0.75 + Math.sin(t) * 0.02, // Purple hue with slight shift
                0.4,
                0.3
            );
        }
    });

    return (
        <mesh scale={[500, 500, 500]}>
            <sphereGeometry args={[1, 32, 32]} />
            <LayerMaterial
                ref={materialRef}
                side={THREE.BackSide}
                lighting="unlit"
            >
                {/* Base gradient: Deep purple to warm peach */}
                <Gradient
                    colorA="#1a0533" // Deep purple/navy at top
                    colorB="#4a1942" // Rich purple mid
                    axes="y"
                    start={1}
                    end={0.3}
                />
                <Gradient
                    colorA="#4a1942" // Rich purple
                    colorB="#8b4a6b" // Dusty rose
                    axes="y"
                    start={0.4}
                    end={-0.1}
                    alpha={0.8}
                />
                <Gradient
                    colorA="transparent"
                    colorB="#d4956b" // Warm peach/gold at horizon
                    axes="y"
                    start={-0.1}
                    end={-0.5}
                    alpha={0.9}
                />
                <Gradient
                    colorA="transparent"
                    colorB="#f5c882" // Golden glow at bottom
                    axes="y"
                    start={-0.4}
                    end={-1}
                    alpha={0.7}
                />
                {/* Film grain texture */}
                <Noise
                    colorA="#ffffff"
                    colorB="#000000"
                    alpha={0.03}
                    scale={300}
                    offset={[0, 0, 0]}
                    mapping="local"
                />
            </LayerMaterial>
        </mesh>
    );
}

/**
 * Fog that matches the sky gradient for seamless blending
 */
export function AtmosFog() {
    return (
        <fog attach="fog" args={['#6b3a5c', 30, 200]} />
    );
}
