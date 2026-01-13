/**
 * 📜 Magical Scroll - Antique style resume scroll
 * Positioned in front of castle, with exciting visual effects
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import { useControls, folder } from 'leva';
import * as THREE from 'three';

// Resume data
const resumeData = {
    name: "Vaibhab Tiwari",
    title: "Full Stack Developer & 3D Enthusiast",
    summary: "Passionate developer crafting magical digital experiences with modern web technologies and immersive 3D graphics.",
    experience: [
        { role: "Senior Web Developer", company: "TechWizards Inc.", period: "2022 - Present" },
        { role: "Frontend Developer", company: "Digital Sorcery Co.", period: "2020 - 2022" },
        { role: "Junior Developer", company: "Code Academy", period: "2018 - 2020" }
    ],
    skills: ["React", "Three.js", "Node.js", "TypeScript", "Python", "MongoDB"],
    education: { degree: "B.S. Computer Science", school: "Tech University", year: "2018" },
    contact: { email: "captain@pirateship.dev", github: "github.com/vaibhavsharma" }
};

// Ornate metallic roll with glowing accents
function OrnateRoll({ position, width = 6 }) {
    const ringRefs = useRef([]);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        ringRefs.current.forEach((ring, i) => {
            if (ring) {
                ring.rotation.x = time * 0.5 + i * 0.5;
            }
        });
    });

    return (
        <group position={position}>
            {/* Main cylinder - rich wood with gold inlay look */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, width, 32]} />
                <meshStandardMaterial color="#5D3A1A" roughness={0.4} metalness={0.3} />
            </mesh>

            {/* Gold decorative bands */}
            {[-2, -1, 0, 1, 2].map((x, i) => (
                <mesh key={i} ref={el => ringRefs.current[i] = el} position={[x * 0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.35, 0.05, 8, 32]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} emissive="#FFD700" emissiveIntensity={0.2} />
                </mesh>
            ))}

            {/* Left ornate end cap */}
            <group position={[-width / 2 - 0.15, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.45, 0.4, 0.25, 16]} />
                    <meshStandardMaterial color="#B8860B" roughness={0.2} metalness={0.9} />
                </mesh>
                <mesh position={[-0.25, 0, 0]}>
                    <sphereGeometry args={[0.28, 16, 16]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.15} metalness={0.95} emissive="#DAA520" emissiveIntensity={0.3} />
                </mesh>
                <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <coneGeometry args={[0.15, 0.2, 8]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} />
                </mesh>
                {/* Glowing gem */}
                <mesh position={[-0.25, 0, 0.35]}>
                    <octahedronGeometry args={[0.08]} />
                    <meshBasicMaterial color="#ff4444" />
                </mesh>
                <pointLight position={[-0.25, 0, 0.4]} intensity={0.5} color="#ff4444" distance={1} />
            </group>

            {/* Right ornate end cap */}
            <group position={[width / 2 + 0.15, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.45, 0.4, 0.25, 16]} />
                    <meshStandardMaterial color="#B8860B" roughness={0.2} metalness={0.9} />
                </mesh>
                <mesh position={[0.25, 0, 0]}>
                    <sphereGeometry args={[0.28, 16, 16]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.15} metalness={0.95} emissive="#DAA520" emissiveIntensity={0.3} />
                </mesh>
                <mesh position={[0.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <coneGeometry args={[0.15, 0.2, 8]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} />
                </mesh>
                <mesh position={[0.25, 0, 0.35]}>
                    <octahedronGeometry args={[0.08]} />
                    <meshBasicMaterial color="#ff4444" />
                </mesh>
                <pointLight position={[0.25, 0, 0.4]} intensity={0.5} color="#ff4444" distance={1} />
            </group>
        </group>
    );
}

// Animated compass rose
function CompassRose({ position, size = 2, opacity = 0.15 }) {
    const groupRef = useRef();
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh><ringGeometry args={[size * 0.9, size, 64]} /><meshBasicMaterial color="#8B4513" transparent opacity={opacity} side={THREE.DoubleSide} /></mesh>
            <mesh><ringGeometry args={[size * 0.6, size * 0.65, 64]} /><meshBasicMaterial color="#B8860B" transparent opacity={opacity * 0.8} side={THREE.DoubleSide} /></mesh>
            <mesh><ringGeometry args={[size * 0.3, size * 0.35, 64]} /><meshBasicMaterial color="#DAA520" transparent opacity={opacity * 0.6} side={THREE.DoubleSide} /></mesh>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
                    <planeGeometry args={[0.1, i % 2 === 0 ? size * 0.95 : size * 0.7]} />
                    <meshBasicMaterial color={i % 2 === 0 ? "#DAA520" : "#8B4513"} transparent opacity={opacity * 1.2} side={THREE.DoubleSide} />
                </mesh>
            ))}
            <mesh><circleGeometry args={[size * 0.15, 16]} /><meshBasicMaterial color="#FFD700" transparent opacity={opacity * 2} side={THREE.DoubleSide} /></mesh>
        </group>
    );
}

// Glowing close button - faces camera
function CloseButton({ position, onClick }) {
    const [hovered, setHovered] = useState(false);
    const btnRef = useRef();
    const glowRef = useRef();

    useFrame((state) => {
        if (btnRef.current) {
            const scale = hovered ? 1.3 : 1;
            btnRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
        }
        if (glowRef.current) {
            glowRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
        }
    });

    return (
        <group ref={btnRef} position={position} onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            {/* Glow effect */}
            <mesh ref={glowRef} position={[0, 0, -0.1]}>
                <circleGeometry args={[0.7, 32]} />
                <meshBasicMaterial color="#ff0000" transparent opacity={0.4} />
            </mesh>
            {/* Wax seal - facing forward */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.55, 0.15, 32]} />
                <meshStandardMaterial color="#8B0000" roughness={0.5} metalness={0.3} />
            </mesh>
            {/* Seal face */}
            <mesh position={[0, 0, 0.08]}>
                <circleGeometry args={[0.45, 32]} />
                <meshStandardMaterial color="#A52A2A" roughness={0.4} emissive="#ff0000" emissiveIntensity={hovered ? 0.8 : 0.2} />
            </mesh>
            {/* X mark - facing forward */}
            <Text position={[0, 0, 0.12]} fontSize={0.45} color="#FFD700" anchorX="center" anchorY="middle" fontWeight="bold">
                ✕
            </Text>
            <pointLight position={[0, 0, 0.5]} intensity={hovered ? 2 : 0.5} color="#ff4400" distance={3} />
        </group>
    );
}

// Floating magical particles around the scroll
function MagicalAura({ width, height, progress }) {
    if (progress < 0.5) return null;

    return (
        <group>
            <Sparkles count={50} scale={[width + 2, height + 2, 2]} size={3} speed={0.5} color="#FFD700" opacity={0.8} />
            <Sparkles count={30} scale={[width + 1, height + 1, 1]} size={2} speed={0.3} color="#00ffff" opacity={0.6} />
        </group>
    );
}

export default function MagicalScroll({ isOpen, onClose, castlePosition = [0, 1, 250] }) {
    const { camera } = useThree();
    const scrollRef = useRef();
    const topRollRef = useRef();
    const bottomRollRef = useRef();

    const [scrollProgress, setScrollProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);

    // Leva debug controls
    const { posX, posY, posZ, rotX, rotY, rotZ, scrollScale, scrollWidth, scrollHeight } = useControls('Magical Scroll', {
        position: folder({
            posX: { value: -0.1, min: -20, max: 20, step: 0.1 },
            posY: { value: 4.0, min: -10, max: 20, step: 0.1 },
            posZ: { value: 244, min: 200, max: 280, step: 1 },
        }),
        rotation: folder({
            rotX: { value: -3.14, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
            rotZ: { value: -3.14, min: -Math.PI, max: Math.PI, step: 0.01 },
        }),
        size: folder({
            scrollScale: { value: 1.0, min: 0.5, max: 3, step: 0.1 },
            scrollWidth: { value: 7, min: 3, max: 12, step: 0.5 },
            scrollHeight: { value: 9, min: 4, max: 15, step: 0.5 },
        }),
    });

    useFrame((state, delta) => {
        if (isOpen && scrollProgress < 1) {
            setScrollProgress(prev => Math.min(prev + delta * 0.6, 1));
        } else if (!isOpen && scrollProgress > 0) {
            setScrollProgress(prev => Math.max(prev - delta * 1.0, 0));
        }

        if (scrollProgress > 0.6 && !showContent) setShowContent(true);
        else if (scrollProgress < 0.4 && showContent) setShowContent(false);

        if (topRollRef.current && bottomRollRef.current) {
            const openHeight = scrollHeight * 0.45;
            topRollRef.current.position.y = scrollProgress * openHeight;
            bottomRollRef.current.position.y = -scrollProgress * openHeight;
        }

        // Gentle floating
        if (scrollRef.current && isOpen) {
            const time = state.clock.elapsedTime;
            scrollRef.current.position.y = posY + Math.sin(time * 0.8) * 0.08;
            scrollRef.current.rotation.y = Math.sin(time * 0.3) * 0.02;
        }
    });

    if (scrollProgress === 0 && !isOpen) return null;

    const currentHeight = scrollHeight * scrollProgress * 0.9;

    return (
        <group ref={scrollRef} position={[posX, posY, posZ]} rotation={[rotX, rotY, rotZ]} scale={scrollScale}>
            {/* Dark backdrop */}
            <mesh position={[0, 0, -5]}>
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.85 * scrollProgress} />
            </mesh>

            {/* Magical aura */}
            <MagicalAura width={scrollWidth} height={currentHeight} progress={scrollProgress} />

            {/* Top roll */}
            <group ref={topRollRef}>
                <OrnateRoll position={[0, 0, 0]} width={scrollWidth + 1.5} />
            </group>

            {/* Bottom roll */}
            <group ref={bottomRollRef}>
                <OrnateRoll position={[0, 0, 0]} width={scrollWidth + 1.5} />
            </group>

            {/* Parchment */}
            {scrollProgress > 0.05 && (
                <group>
                    {/* Main parchment with glow edge */}
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[scrollWidth + 0.2, currentHeight + 0.2]} />
                        <meshBasicMaterial color="#DAA520" transparent opacity={0.3 * scrollProgress} />
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <planeGeometry args={[scrollWidth, currentHeight]} />
                        <meshStandardMaterial color="#F5E6C8" roughness={0.85} metalness={0} side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, 0, 0.001]}>
                        <planeGeometry args={[scrollWidth, currentHeight]} />
                        <meshBasicMaterial color="#D4A574" transparent opacity={0.12} side={THREE.DoubleSide} />
                    </mesh>

                    {/* Edge shadows */}
                    <mesh position={[0, currentHeight / 2 - 0.15, 0.002]}><planeGeometry args={[scrollWidth, 0.4]} /><meshBasicMaterial color="#8B4513" transparent opacity={0.2} /></mesh>
                    <mesh position={[0, -currentHeight / 2 + 0.15, 0.002]}><planeGeometry args={[scrollWidth, 0.4]} /><meshBasicMaterial color="#8B4513" transparent opacity={0.2} /></mesh>

                    {/* Compass rose */}
                    <CompassRose position={[0, 0, 0.003]} size={Math.min(scrollWidth, currentHeight) * 0.4} opacity={0.15} />

                    {/* Decorative corners */}
                    {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([dx, dy], i) => (
                        <mesh key={i} position={[dx * (scrollWidth / 2 - 0.4), dy * (currentHeight / 2 - 0.4), 0.004]}>
                            <ringGeometry args={[0.15, 0.2, 6]} />
                            <meshBasicMaterial color="#B8860B" transparent opacity={0.4} side={THREE.DoubleSide} />
                        </mesh>
                    ))}
                </group>
            )}

            {/* Content */}
            {showContent && (
                <group position={[0, 0, 0.02]}>
                    <Text position={[0, currentHeight * 0.38, 0]} fontSize={0.4} color="#2F1810" anchorX="center" fontWeight="bold">⚓ {resumeData.name} ⚓</Text>
                    <Text position={[0, currentHeight * 0.28, 0]} fontSize={0.18} color="#5D4037" anchorX="center">{resumeData.title}</Text>

                    {/* Divider */}
                    <group position={[0, currentHeight * 0.2, 0]}>
                        <mesh><planeGeometry args={[scrollWidth * 0.7, 0.02]} /><meshBasicMaterial color="#DAA520" /></mesh>
                        <Text position={[0, 0, 0.01]} fontSize={0.15} color="#B8860B" anchorX="center">⚔ ☠ ⚔</Text>
                    </group>

                    <Text position={[0, currentHeight * 0.1, 0]} fontSize={0.11} color="#3E2723" anchorX="center" maxWidth={scrollWidth * 0.85} textAlign="center">{resumeData.summary}</Text>

                    <Text position={[0, currentHeight * -0.02, 0]} fontSize={0.16} color="#8B4513" anchorX="center" fontWeight="bold">══ VOYAGES ══</Text>
                    {resumeData.experience.map((exp, i) => (
                        <group key={i} position={[0, -0.18 - i * 0.25, 0]}>
                            <Text position={[-scrollWidth * 0.38, 0, 0]} fontSize={0.11} color="#2F1810" anchorX="left">★ {exp.role}</Text>
                            <Text position={[scrollWidth * 0.38, 0, 0]} fontSize={0.09} color="#8D6E63" anchorX="right">{exp.period}</Text>
                            <Text position={[-scrollWidth * 0.35, -0.13, 0]} fontSize={0.09} color="#6D4C41" anchorX="left">{exp.company}</Text>
                        </group>
                    ))}

                    <Text position={[0, -currentHeight * 0.35, 0]} fontSize={0.16} color="#8B4513" anchorX="center" fontWeight="bold">══ ABILITIES ══</Text>
                    <Text position={[0, -currentHeight * 0.42, 0]} fontSize={0.1} color="#2F1810" anchorX="center">{resumeData.skills.join(" • ")}</Text>
                    <Text position={[0, -currentHeight * 0.48, 0]} fontSize={0.1} color="#5D4037" anchorX="center">📧 {resumeData.contact.email}  |  🐙 {resumeData.contact.github}</Text>
                </group>
            )}

            {/* Close button - fixed position at top right */}
            {scrollProgress > 0.3 && (
                <CloseButton
                    position={[scrollWidth / 2 + 0.3, currentHeight / 2 + 0.5, 0.2]}
                    onClick={onClose}
                />
            )}

            {/* Dramatic lighting */}
            <pointLight position={[0, 0, 3]} intensity={2} color="#FFF8DC" distance={15} />
            <pointLight position={[-3, 3, 2]} intensity={1} color="#FFD700" distance={8} />
            <pointLight position={[3, -3, 2]} intensity={1} color="#DAA520" distance={8} />
            <spotLight position={[0, 5, 5]} angle={0.5} intensity={2} color="#ffffff" distance={20} />
        </group>
    );
}
