/**
 * 🏰 Medieval Cloth Banner - Fantasy cloth with wind simulation
 * Uses GLSL shaders for realistic fabric physics
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Text, shaderMaterial } from '@react-three/drei';
import { useControls, folder } from 'leva';
import * as THREE from 'three';

// Custom shader material for cloth simulation
const ClothMaterial = shaderMaterial(
    // Uniforms
    {
        uTime: 0,
        uWindStrength: 0.15,
        uFabricFreq: 0.35,
        uFabricColor: new THREE.Color(0xe8d4b8),
        uBorderColor: new THREE.Color(0x8b4513),
        uAccentColor: new THREE.Color(0xdaa520),
    },
    // Vertex Shader - Wind Physics
    `
        uniform float uTime;
        uniform float uWindStrength;
        uniform float uFabricFreq;
        
        varying vec2 vUv;
        varying float vWave;

        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Pinned at top - bottom flows freely
            // uv.y = 0 at bottom, 1 at top for standard PlaneGeometry
            float looseness = pow(uv.y, 1.8);
            
            // Multi-wave wind simulation
            float wave1 = sin(uv.x * 4.0 + uTime * 1.5) * 0.5;
            float wave2 = sin(uv.x * 8.0 + uTime * 2.5 + uv.y * 3.0) * 0.25;
            float wave3 = sin(uTime * 0.8) * 0.25;
            
            float totalWave = (wave1 + wave2 + wave3) * uFabricFreq;
            float displacement = (uWindStrength + totalWave) * looseness;
            
            // Apply displacement
            pos.z += displacement;
            pos.y -= sin(displacement) * 0.08 * looseness;
            
            vWave = displacement;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    // Fragment Shader - Fabric Texture
    `
        uniform vec3 uFabricColor;
        uniform vec3 uBorderColor;
        uniform vec3 uAccentColor;
        uniform float uTime;
        
        varying vec2 vUv;
        varying float vWave;

        // Simple noise function
        float noise(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            
            // Base fabric color with subtle texture
            float fabricNoise = noise(uv * 80.0) * 0.08;
            vec3 color = uFabricColor - fabricNoise;
            
            // Weave pattern
            float weaveX = sin(uv.x * 200.0) * 0.02;
            float weaveY = sin(uv.y * 200.0) * 0.02;
            color -= (weaveX + weaveY) * 0.5;
            
            // Border decoration
            float borderWidth = 0.08;
            float innerBorder = 0.12;
            
            // Outer edge border
            if (uv.x < borderWidth || uv.x > 1.0 - borderWidth ||
                uv.y < borderWidth || uv.y > 1.0 - borderWidth) {
                color = uBorderColor;
            }
            
            // Inner gold trim
            if ((uv.x > borderWidth && uv.x < innerBorder) ||
                (uv.x > 1.0 - innerBorder && uv.x < 1.0 - borderWidth) ||
                (uv.y > borderWidth && uv.y < innerBorder) ||
                (uv.y > 1.0 - innerBorder && uv.y < 1.0 - borderWidth)) {
                color = mix(color, uAccentColor, 0.7);
            }
            
            // Cloth shadow from wave displacement
            color += vWave * 0.3;
            
            // Slight darkening at bottom (gravity shadow)
            color -= (1.0 - uv.y) * 0.1;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
);

// Extend to make it available as JSX
extend({ ClothMaterial });

// Medieval styled text
function MedievalText({ children, position, fontSize = 0.3, color = '#4a3728', ...props }) {
    return (
        <Text
            position={position}
            fontSize={fontSize}
            color={color}
            anchorX="center"
            anchorY="middle"
            {...props}
        >
            {children}
        </Text>
    );
}

// Decorative banner pole
function BannerPole({ width = 2.5 }) {
    return (
        <group position={[0, 0.55, 0]}>
            {/* Main pole */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, width + 0.4, 16]} />
                <meshStandardMaterial color="#5c4033" roughness={0.8} metalness={0.1} />
            </mesh>

            {/* Left finial - shield */}
            <mesh position={[-width / 2 - 0.25, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Right finial - shield */}
            <mesh position={[width / 2 + 0.25, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Rope loops */}
            {[-0.8, -0.3, 0.3, 0.8].map((x, i) => (
                <mesh key={i} position={[x, -0.08, 0]}>
                    <torusGeometry args={[0.03, 0.01, 8, 16]} />
                    <meshStandardMaterial color="#8b7355" roughness={0.9} />
                </mesh>
            ))}
        </group>
    );
}

export default function ParchmentBanner({
    name = "Vaibhav Sharma",
    title = "Web Developer & 3D Enthusiast",
    tagline = "Crafting magical digital experiences",
    onClick
}) {
    const groupRef = useRef();
    const materialRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    // Leva debug controls
    const { posX, posY, posZ, rotX, rotY, rotZ, bannerScale, windStrength } = useControls('Banner', {
        position: folder({
            posX: { value: 3.5, min: -20, max: 20, step: 0.1 },
            posY: { value: -0.9, min: -10, max: 15, step: 0.1 },
            posZ: { value: -0.5, min: -20, max: 20, step: 0.1 },
        }),
        rotation: folder({
            rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotY: { value: 0.03, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        }),
        bannerScale: { value: 0.5, min: 0.2, max: 3, step: 0.1 },
        windStrength: { value: 0.15, min: 0, max: 0.5, step: 0.01 },
    });

    // Create subdivided geometry for cloth simulation
    const geometry = useMemo(() => {
        return new THREE.PlaneGeometry(2.5, 1.8, 32, 32);
    }, []);

    // Animation loop
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (materialRef.current) {
            materialRef.current.uTime = time;

            // Variable wind with gusts
            const gust = (Math.sin(time * 0.7) + Math.sin(time * 2.3) * 0.5 + 1) * 0.5;
            materialRef.current.uWindStrength = windStrength * gust;
        }

        // Gentle floating motion
        if (groupRef.current) {
            groupRef.current.position.y = posY + Math.sin(time * 0.8) * 0.02;
        }
    });

    return (
        <group
            ref={groupRef}
            position={[posX, posY, posZ]}
            rotation={[rotX, rotY, rotZ]}
            scale={bannerScale}
            onClick={onClick}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
        >
            {/* Banner pole at top */}
            <BannerPole width={2.5} />

            {/* Cloth banner with shader */}
            <mesh geometry={geometry} position={[0, -0.4, 0]}>
                <clothMaterial
                    ref={materialRef}
                    side={THREE.DoubleSide}
                    uFabricColor={new THREE.Color(0xe8d4b8)}
                    uBorderColor={new THREE.Color(0x8b4513)}
                    uAccentColor={new THREE.Color(0xdaa520)}
                />
            </mesh>

            {/* Text content - positioned in front of cloth to avoid overlap */}
            <group position={[0, -0.35, 0.4]}>
                {/* Header */}
                <MedievalText position={[0, 0.55, 0]} fontSize={0.14} color="#8b4513">
                    ✨ Welcome, Traveler ✨
                </MedievalText>

                {/* Name */}
                <MedievalText position={[0, 0.28, 0]} fontSize={0.22} color="#4a3728">
                    {name}
                </MedievalText>

                {/* Title */}
                <MedievalText position={[0, 0.02, 0]} fontSize={0.1} color="#6b5344">
                    {title}
                </MedievalText>

                {/* Tagline */}
                <MedievalText position={[0, -0.15, 0]} fontSize={0.07} color="#8b7355">
                    {tagline}
                </MedievalText>

                {/* Decorative icons */}
                <MedievalText position={[-0.95, 0.28, 0]} fontSize={0.15} color="#daa520">
                    🏰
                </MedievalText>
                <MedievalText position={[0.95, 0.28, 0]} fontSize={0.15} color="#daa520">
                    🏰
                </MedievalText>
            </group>

            {/* Call to action button */}
            <group position={[0, -1.0, 0.4]}>
                <mesh>
                    <planeGeometry args={[1.2, 0.28]} />
                    <meshStandardMaterial
                        color={isHovered ? "#daa520" : "#8b4513"}
                        roughness={0.7}
                    />
                </mesh>
                <MedievalText position={[0, 0, 0.02]} fontSize={0.09} color="#f5f0e6">
                    🌟 Enter the Realm 🌟
                </MedievalText>
            </group>

            {/* Warm lighting */}
            <pointLight position={[0, 0, 0.5]} intensity={0.4} color="#ffd89b" distance={3} />
        </group>
    );
}
