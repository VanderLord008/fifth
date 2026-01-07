import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SkyBackground - Magical purple-gold sunset sky
 * Creates an immersive gradient backdrop for the cloud journey
 */
const SkyBackground = () => {
    const meshRef = useRef();

    // Custom shader for smooth gradient sky
    const skyShader = {
        uniforms: {
            topColor: { value: new THREE.Color('#1a0a2e') },      // Deep purple (top)
            midColor: { value: new THREE.Color('#4a1942') },      // Rich magenta (middle)
            horizonColor: { value: new THREE.Color('#ff6b35') },  // Warm orange (horizon)
            sunColor: { value: new THREE.Color('#ffd700') },      // Golden sun glow
            offset: { value: 20 },
            exponent: { value: 0.6 },
            time: { value: 0 },
        },
        vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 horizonColor;
      uniform vec3 sunColor;
      uniform float offset;
      uniform float exponent;
      uniform float time;
      varying vec3 vWorldPosition;
      
      void main() {
        // Normalize height
        float h = normalize(vWorldPosition + offset).y;
        
        // Create multi-stop gradient
        vec3 color;
        if (h < 0.3) {
          // Horizon to mid
          float t = h / 0.3;
          color = mix(horizonColor, midColor, pow(t, 0.8));
          
          // Add sun glow near horizon center
          float sunGlow = exp(-pow(vWorldPosition.x * 0.01, 2.0) - pow((h - 0.1) * 5.0, 2.0));
          color = mix(color, sunColor, sunGlow * 0.6);
        } else if (h < 0.6) {
          // Mid to upper
          float t = (h - 0.3) / 0.3;
          color = mix(midColor, topColor, pow(t, 0.7));
        } else {
          // Upper sky
          color = topColor;
        }
        
        // Add subtle animated stars in upper sky
        float starIntensity = smoothstep(0.5, 0.8, h);
        float stars = fract(sin(dot(vWorldPosition.xz * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
        stars = pow(stars, 20.0) * starIntensity * 0.5;
        color += vec3(stars);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    };

    // Animate time uniform for subtle effects
    useFrame((state) => {
        if (meshRef.current?.material?.uniforms?.time) {
            meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 32, 32]} />
            <shaderMaterial
                attach="material"
                args={[skyShader]}
                side={THREE.BackSide}
            />
        </mesh>
    );
};

export default SkyBackground;
