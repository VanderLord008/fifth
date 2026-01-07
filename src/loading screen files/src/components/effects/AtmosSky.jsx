/**
 * AtmosSky - Gradient sky dome with warm horizon to cool zenith
 * Creates the dreamy atmospheric backdrop
 */

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Custom shader for gradient sky
const skyVertexShader = `
varying vec3 vWorldPosition;
void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragmentShader = `
uniform vec3 topColor;
uniform vec3 horizonColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {
    float h = normalize(vWorldPosition + offset).y;
    
    // Blend from bottom to horizon to top
    vec3 color;
    if (h < 0.0) {
        // Below horizon - blend to bottom color
        color = mix(horizonColor, bottomColor, pow(-h, exponent));
    } else {
        // Above horizon - blend to top color
        color = mix(horizonColor, topColor, pow(h, exponent));
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;

export default function AtmosSky({
    topColor = '#1a1a3e',      // Deep night blue
    horizonColor = '#ff9966',  // Warm sunset orange
    bottomColor = '#2d1b4e',   // Deep purple
    size = 500
}) {
    const materialRef = useRef();

    const uniforms = useMemo(() => ({
        topColor: { value: new THREE.Color(topColor) },
        horizonColor: { value: new THREE.Color(horizonColor) },
        bottomColor: { value: new THREE.Color(bottomColor) },
        offset: { value: 10 },
        exponent: { value: 0.6 }
    }), [topColor, horizonColor, bottomColor]);

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[size, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={skyVertexShader}
                fragmentShader={skyFragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide}
                depthWrite={false}
            />
        </mesh>
    );
}
