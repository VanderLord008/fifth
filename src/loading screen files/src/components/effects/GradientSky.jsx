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

  // Custom shader for smooth gradient with magical wisps
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float time;
    
    // Magical Palette
    vec3 colorTop = vec3(0.05, 0.0, 0.15);       // Deep Void Purple
    vec3 colorMid = vec3(0.15, 0.05, 0.35);      // Midnight Wizard Blue
    vec3 colorHorizon = vec3(0.4, 0.1, 0.4);     // Mystic Violet
    vec3 colorBottom = vec3(1.0, 0.8, 0.4);      // Golden Magic Glow
    
    // Simplex-like noise for magical wisps
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);

      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;

      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));

      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    void main() {
      float y = vUv.y;
      
      // Base Gradient
      vec3 color;
      if (y > 0.6) {
        float t = smoothstep(0.6, 1.0, y);
        color = mix(colorMid, colorTop, t);
      } else if (y > 0.2) {
        float t = smoothstep(0.2, 0.6, y);
        color = mix(colorHorizon, colorMid, t);
      } else {
        float t = smoothstep(0.0, 0.2, y);
        color = mix(colorBottom, colorHorizon, t);
      }
      
      // Add Magical Wisps (Aurora effect)
      // Moving noise layers
      float noise1 = snoise(vUv * 8.0 + vec2(time * 0.1, time * 0.05));
      float noise2 = snoise(vUv * 15.0 - vec2(time * 0.08, time * 0.12));
      
      // Combine noise for "energy" feel
      float wisp = (noise1 + noise2) * 0.5;
      
      // Only show wisps in the middle/upper sky (not horizon)
      float wispMask = smoothstep(0.2, 0.8, y) * 0.15;
      
      // Add magical glow/tint from wisps
      vec3 wispColor = vec3(0.6, 0.3, 0.9); // Glowing purple/pink
      color += wispColor * wisp * wispMask;

      // Subtle twinkling grain
      float grain = fract(sin(dot(vUv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      color += (grain - 0.5) * 0.02;
      
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
    <fog attach="fog" args={['#2d1b4e', 40, 180]} />
  );
}
