/**
 * 🌙 Night Sky - Magical moonlit atmosphere
 * Perfect for a mystical castle in the sky scene
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Night sky gradient shader with stars
const skyVertexShader = `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragmentShader = `
uniform vec3 uColorZenith;      // Deep dark blue at top
uniform vec3 uColorMid;         // Royal purple
uniform vec3 uColorHorizon;     // Soft purple-blue at horizon
uniform vec3 uColorNadir;       // Dark indigo below
uniform float uTime;

varying vec3 vWorldPosition;
varying vec2 vUv;

// Simple hash for star pattern
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec3 direction = normalize(vWorldPosition);
    float h = direction.y;
    
    // Subtle time variation for living sky
    float shift = sin(uTime * 0.015) * 0.01;
    h += shift;
    
    vec3 color;
    
    if (h < -0.1) {
        // Below horizon - deep indigo
        float t = smoothstep(-0.6, -0.1, h);
        color = mix(uColorNadir, uColorHorizon, t);
    } else if (h < 0.2) {
        // Near horizon - soft purple glow
        float t = smoothstep(-0.1, 0.2, h);
        color = mix(uColorHorizon, uColorMid, t);
    } else if (h < 0.6) {
        // Mid sky - purple to deep blue
        float t = smoothstep(0.2, 0.6, h);
        color = mix(uColorMid, uColorZenith, t);
    } else {
        // Upper sky - deepest blue-black
        float t = pow(smoothstep(0.6, 1.0, h), 0.5);
        color = mix(uColorZenith, uColorZenith * 0.7, t);
    }
    
    // Add stars only in upper sky (above clouds)
    if (h > 0.4) {
        vec2 starUV = direction.xz / (direction.y + 0.5) * 100.0;
        float starIntensity = hash(floor(starUV));
        
        // Only show bright stars
        if (starIntensity > 0.97) {
            float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + starIntensity * 100.0);
            float starBrightness = (starIntensity - 0.97) / 0.03;
            starBrightness *= twinkle * smoothstep(0.4, 0.7, h);
            color += vec3(0.9, 0.95, 1.0) * starBrightness * 0.8;
        }
    }
    
    // Subtle moonlit glow near horizon
    float horizonGlow = 1.0 - abs(h);
    horizonGlow = pow(horizonGlow, 3.0) * 0.15;
    color += vec3(0.4, 0.45, 0.6) * horizonGlow;
    
    // Add a soft purple atmospheric glow
    float atmosphereGlow = pow(max(0.0, 1.0 - abs(h - 0.1)), 4.0) * 0.1;
    color += vec3(0.5, 0.3, 0.6) * atmosphereGlow;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

export default function MysticalSky() {
    const meshRef = useRef();

    const uniforms = useMemo(() => ({
        uColorZenith: { value: new THREE.Color('#0a1628') },    // Deep dark blue-black
        uColorMid: { value: new THREE.Color('#1e1b4b') },       // Royal indigo
        uColorHorizon: { value: new THREE.Color('#312e81') },   // Soft purple-blue
        uColorNadir: { value: new THREE.Color('#0f0a1e') },     // Very dark purple
        uTime: { value: 0 }
    }), []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 64, 64]} />
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

