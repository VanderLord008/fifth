/**
 * 🏰 Hogwarts Great Hall - Classic Harry Potter style interior
 * Features: Enchanted ceiling, floating candles, portrait frames as project portals
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Enchanted ceiling with stars
function EnchantedCeiling({ width = 30, depth = 50 }) {
    const ceilingRef = useRef();

    useFrame((state) => {
        if (ceilingRef.current) {
            ceilingRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                varying vec2 vUv;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }
                
                void main() {
                    // Night sky gradient
                    vec3 skyTop = vec3(0.02, 0.02, 0.1);
                    vec3 skyBottom = vec3(0.1, 0.05, 0.15);
                    vec3 sky = mix(skyBottom, skyTop, vUv.y);
                    
                    // Stars
                    float stars = 0.0;
                    for(float i = 1.0; i < 4.0; i++) {
                        vec2 st = vUv * 100.0 * i;
                        float r = random(floor(st));
                        if(r > 0.97) {
                            float twinkle = sin(uTime * 3.0 + r * 100.0) * 0.5 + 0.5;
                            stars += twinkle * (1.0 - i * 0.2);
                        }
                    }
                    
                    // Moon glow
                    vec2 moonPos = vec2(0.7, 0.8);
                    float moonDist = distance(vUv, moonPos);
                    float moon = smoothstep(0.15, 0.0, moonDist) * 0.5;
                    
                    vec3 color = sky + vec3(stars) + vec3(0.9, 0.85, 0.7) * moon;
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide
        });
    }, []);

    return (
        <mesh ref={ceilingRef} position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
            <planeGeometry args={[width, depth]} />
        </mesh>
    );
}

// Floating candle with flame
function FloatingCandle({ position }) {
    const candleRef = useRef();
    const flameRef = useRef();
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (candleRef.current) {
            candleRef.current.position.y = position[1] + Math.sin(time * 0.5 + phase) * 0.3;
        }
        if (flameRef.current) {
            flameRef.current.scale.y = 1 + Math.sin(time * 10 + phase) * 0.2;
            flameRef.current.material.opacity = 0.8 + Math.sin(time * 8) * 0.2;
        }
    });

    return (
        <group ref={candleRef} position={position}>
            {/* Candle body */}
            <mesh>
                <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
                <meshStandardMaterial color="#f5e6c8" />
            </mesh>
            {/* Flame */}
            <mesh ref={flameRef} position={[0, 0.3, 0]}>
                <coneGeometry args={[0.04, 0.15, 8]} />
                <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
            </mesh>
            <pointLight position={[0, 0.3, 0]} intensity={0.3} color="#ffaa00" distance={5} />
        </group>
    );
}

// Portrait frame for projects
function PortraitFrame({ position, rotation = [0, 0, 0], project, onClick }) {
    const [hovered, setHovered] = useState(false);
    const frameRef = useRef();

    useFrame(() => {
        if (frameRef.current) {
            const scale = hovered ? 1.05 : 1;
            frameRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        }
    });

    return (
        <group
            ref={frameRef}
            position={position}
            rotation={rotation}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Ornate frame */}
            <mesh>
                <boxGeometry args={[2.5, 3.5, 0.15]} />
                <meshStandardMaterial color="#5c3317" roughness={0.6} metalness={0.2} />
            </mesh>

            {/* Gold inner border */}
            <mesh position={[0, 0, 0.08]}>
                <boxGeometry args={[2.2, 3.2, 0.02]} />
                <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Canvas/image area */}
            <mesh position={[0, 0, 0.1]}>
                <planeGeometry args={[2, 3]} />
                <meshStandardMaterial
                    color={hovered ? "#3a2010" : "#2a1810"}
                    emissive={hovered ? "#442200" : "#000000"}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Project title */}
            <Text
                position={[0, 0.8, 0.12]}
                fontSize={0.2}
                color="#d4af37"
                anchorX="center"
            >
                {project?.title || "Project"}
            </Text>

            {/* Project description */}
            <Text
                position={[0, 0, 0.12]}
                fontSize={0.12}
                color="#a08060"
                anchorX="center"
                maxWidth={1.8}
                textAlign="center"
            >
                {project?.description || "Click to enter"}
            </Text>

            {/* Glow effect on hover */}
            {hovered && (
                <pointLight position={[0, 0, 1]} intensity={0.5} color="#ffcc00" distance={3} />
            )}
        </group>
    );
}

// Long wooden table
function HouseTable({ position, rotation = [0, 0, 0], color = "#5c3317" }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Table top */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[3, 0.1, 20]} />
                <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Benches */}
            <mesh position={[-1.5, 0.4, 0]}>
                <boxGeometry args={[0.5, 0.05, 18]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            <mesh position={[1.5, 0.4, 0]}>
                <boxGeometry args={[0.5, 0.05, 18]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
        </group>
    );
}

// Sample projects
const sampleProjects = [
    { id: 1, title: "E-Commerce App", description: "Modern React storefront" },
    { id: 2, title: "Portfolio Site", description: "3D interactive portfolio" },
    { id: 3, title: "Chat Application", description: "Real-time messaging" },
    { id: 4, title: "Game Engine", description: "WebGL game framework" },
    { id: 5, title: "API Dashboard", description: "Data visualization" },
    { id: 6, title: "Mobile App", description: "React Native project" },
];

export default function HogwartsGreatHall({ onProjectSelect }) {
    return (
        <group position={[0, 0, 0]}>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[30, 50]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>

            {/* Enchanted ceiling */}
            <EnchantedCeiling width={30} depth={50} />

            {/* Stone walls */}
            {/* Left wall */}
            <mesh position={[-15, 7.5, 0]}>
                <boxGeometry args={[0.5, 15, 50]} />
                <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
            </mesh>
            {/* Right wall */}
            <mesh position={[15, 7.5, 0]}>
                <boxGeometry args={[0.5, 15, 50]} />
                <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
            </mesh>
            {/* Back wall */}
            <mesh position={[0, 7.5, -25]}>
                <boxGeometry args={[30, 15, 0.5]} />
                <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
            </mesh>

            {/* Portrait frames on walls - Left side */}
            <PortraitFrame
                position={[-14.5, 5, -10]}
                rotation={[0, Math.PI / 2, 0]}
                project={sampleProjects[0]}
                onClick={() => onProjectSelect?.(sampleProjects[0])}
            />
            <PortraitFrame
                position={[-14.5, 5, 0]}
                rotation={[0, Math.PI / 2, 0]}
                project={sampleProjects[1]}
                onClick={() => onProjectSelect?.(sampleProjects[1])}
            />
            <PortraitFrame
                position={[-14.5, 5, 10]}
                rotation={[0, Math.PI / 2, 0]}
                project={sampleProjects[2]}
                onClick={() => onProjectSelect?.(sampleProjects[2])}
            />

            {/* Portrait frames on walls - Right side */}
            <PortraitFrame
                position={[14.5, 5, -10]}
                rotation={[0, -Math.PI / 2, 0]}
                project={sampleProjects[3]}
                onClick={() => onProjectSelect?.(sampleProjects[3])}
            />
            <PortraitFrame
                position={[14.5, 5, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                project={sampleProjects[4]}
                onClick={() => onProjectSelect?.(sampleProjects[4])}
            />
            <PortraitFrame
                position={[14.5, 5, 10]}
                rotation={[0, -Math.PI / 2, 0]}
                project={sampleProjects[5]}
                onClick={() => onProjectSelect?.(sampleProjects[5])}
            />

            {/* House tables */}
            <HouseTable position={[-6, 0, 0]} color="#722f37" />
            <HouseTable position={[-2, 0, 0]} color="#1a472a" />
            <HouseTable position={[2, 0, 0]} color="#0e1a40" />
            <HouseTable position={[6, 0, 0]} color="#ecb939" />

            {/* Floating candles */}
            {Array.from({ length: 40 }).map((_, i) => (
                <FloatingCandle
                    key={i}
                    position={[
                        (Math.random() - 0.5) * 25,
                        8 + Math.random() * 5,
                        (Math.random() - 0.5) * 40
                    ]}
                />
            ))}

            {/* Head table at the back */}
            <mesh position={[0, 0.5, -22]}>
                <boxGeometry args={[20, 0.1, 3]} />
                <meshStandardMaterial color="#3c1414" roughness={0.6} />
            </mesh>

            {/* Ambient lighting */}
            <ambientLight intensity={0.3} color="#ffeedd" />
            <pointLight position={[0, 12, 0]} intensity={1} color="#ffcc88" distance={30} />
            <pointLight position={[0, 12, -15]} intensity={0.8} color="#ffcc88" distance={25} />
        </group>
    );
}
