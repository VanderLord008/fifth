import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Custom gradient sky using Three.js ShaderMaterial
 * Avoids Lamina's WebGL context conflicts
 * Purple/blue at top → Peach/gold at bottom (Atmos style)
 */
export default function GradientSky() {
    const materialRef = useRef();

    // Custom shader for smooth gradient
    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    uniform float time;
    
    vec3 colorTop = vec3(0.1, 0.02, 0.2);      // Deep purple
    vec3 colorMid = vec3(0.29, 0.16, 0.26);    // Dusty mauve
    vec3 colorHorizon = vec3(0.55, 0.35, 0.42);// Dusty rose
    vec3 colorBottom = vec3(0.83, 0.59, 0.42); // Warm peach/gold
    
    // Simple noise function for grain
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      float y = vUv.y;
      
      // Multi-stop gradient
      vec3 color;
      if (y > 0.6) {
        // Top section: deep purple
        float t = (y - 0.6) / 0.4;
        color = mix(colorMid, colorTop, t);
      } else if (y > 0.35) {
        // Middle section: purple to rose
        float t = (y - 0.35) / 0.25;
        color = mix(colorHorizon, colorMid, t);
      } else {
        // Bottom section: rose to gold
        float t = y / 0.35;
        color = mix(colorBottom, colorHorizon, t);
      }
      
      // Add subtle film grain
      float grain = random(vUv + time * 0.01) * 0.03;
      color += grain - 0.015;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

    // Animate the grain
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh scale={[500, 500, 500]}>
            <sphereGeometry args={[1, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    time: { value: 0 }
                }}
                side={THREE.BackSide}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Fog that matches the sky gradient for seamless blending
 */
export function AtmosFog() {
    return (
        <fog attach="fog" args={['#6b4a5a', 40, 180]} />
    );
}
