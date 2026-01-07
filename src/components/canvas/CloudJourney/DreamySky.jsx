/**
 * ☁️ Dreamy Gradient Background - Beautiful warm magical sky
 * Uses native Three.js shader for maximum compatibility
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Warm dreamy gradient shader
const skyVertexShader = `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragmentShader = `
uniform vec3 uColorTop;
uniform vec3 uColorMiddle;
uniform vec3 uColorBottom;
uniform float uTime;

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    // Normalize height for gradient
    float h = normalize(vWorldPosition).y;
    
    // Add subtle animation
    float timeShift = sin(uTime * 0.05) * 0.02;
    h += timeShift;
    
    vec3 color;
    
    if (h < 0.0) {
        // Bottom section - warm golden
        float t = smoothstep(-1.0, 0.0, h);
        color = mix(uColorBottom, uColorMiddle, t);
    } else {
        // Top section - soft pink to lavender
        float t = smoothstep(0.0, 1.0, h);
        color = mix(uColorMiddle, uColorTop, pow(t, 0.6));
    }
    
    // Add subtle warmth variation
    float warmth = sin(vWorldPosition.x * 0.01 + uTime * 0.1) * 0.03;
    color.r += warmth;
    color.g += warmth * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

export default function DreamySky() {
    const meshRef = useRef();

    const uniforms = useMemo(() => ({
        uColorTop: { value: new THREE.Color('#c9b1ff') },     // Soft lavender
        uColorMiddle: { value: new THREE.Color('#ffb6c1') },  // Light pink
        uColorBottom: { value: new THREE.Color('#ffd89b') },  // Warm golden
        uTime: { value: 0 }
    }), []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} scale={[-1, 1, 1]}>
            <sphereGeometry args={[400, 64, 64]} />
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
