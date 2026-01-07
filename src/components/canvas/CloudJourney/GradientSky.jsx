/**
 * ☁️ Gradient Sky - Atmos-inspired sky with warm horizon to cool zenith
 * Creates a beautiful gradient background using a custom shader
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom sky shader
const skyVertexShader = `
varying vec3 vWorldPosition;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragmentShader = `
uniform vec3 uTopColor;
uniform vec3 uMiddleColor;
uniform vec3 uBottomColor;
uniform float uOffset;
uniform float uExponent;
uniform float uTime;

varying vec3 vWorldPosition;

void main() {
    // Normalize height (-1 to 1 range based on sphere)
    float h = normalize(vWorldPosition).y;
    
    // Add subtle time-based variation
    float timeOffset = sin(uTime * 0.1) * 0.02;
    h += timeOffset;
    
    // Create smooth gradient transitions
    vec3 color;
    
    if (h < 0.0) {
        // Below horizon - warm colors
        float t = smoothstep(-0.5, 0.0, h);
        color = mix(uBottomColor, uMiddleColor, t);
    } else {
        // Above horizon - transition to cool colors
        float t = pow(h, uExponent);
        color = mix(uMiddleColor, uTopColor, t);
    }
    
    // Add subtle noise for atmosphere
    float noise = fract(sin(dot(vWorldPosition.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
    color += noise;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

export default function GradientSky({
    topColor = '#1a0533',      // Deep purple (zenith)
    middleColor = '#ff6b35',   // Warm orange (horizon)
    bottomColor = '#2d1b4e',   // Dark purple (below horizon)
    exponent = 0.4
}) {
    const meshRef = useRef();

    const uniforms = useMemo(() => ({
        uTopColor: { value: new THREE.Color(topColor) },
        uMiddleColor: { value: new THREE.Color(middleColor) },
        uBottomColor: { value: new THREE.Color(bottomColor) },
        uOffset: { value: 0 },
        uExponent: { value: exponent },
        uTime: { value: 0 }
    }), [topColor, middleColor, bottomColor, exponent]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 32, 32]} />
            <shaderMaterial
                vertexShader={skyVertexShader}
                fragmentShader={skyFragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide}
                depthWrite={false}
            />
        </mesh>
    );
}
