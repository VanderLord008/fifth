import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import WandTrace from './WandTrace';
import RuneLoader from './RuneLoader';
import ShatterEffect from './ShatterEffect';
import gsap from 'gsap';
import './LoadingScreen.css';

/**
 * LoadingScreen - Main loading screen component
 * Displays a magical wand tracing a rune while assets load
 */
const LoadingScreen = ({ progress = 0, onLoadingComplete, minDisplayTime = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isShattered, setIsShattered] = useState(false);
    const [displayProgress, setDisplayProgress] = useState(0);
    const containerRef = useRef();
    const startTimeRef = useRef(Date.now());
    const hasCompletedRef = useRef(false);

    // Smoothly animate the progress display
    useEffect(() => {
        gsap.to({ val: displayProgress }, {
            val: progress,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: function () {
                setDisplayProgress(Math.round(this.targets()[0].val));
            }
        });
    }, [progress]);

    // Handle loading completion
    const handleRuneComplete = useCallback(() => {
        if (hasCompletedRef.current) return;

        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        // Ensure minimum display time for the experience
        setTimeout(() => {
            hasCompletedRef.current = true;
            setIsShattered(true);
        }, remainingTime);
    }, [minDisplayTime]);

    // Handle shatter completion
    const handleShatterComplete = useCallback(() => {
        // Fade out the entire loading screen
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    setIsVisible(false);
                    if (onLoadingComplete) onLoadingComplete();
                }
            });
        }
    }, [onLoadingComplete]);

    // Trigger completion when progress reaches 100
    useEffect(() => {
        if (displayProgress >= 100 && !hasCompletedRef.current) {
            handleRuneComplete();
        }
    }, [displayProgress, handleRuneComplete]);

    if (!isVisible) return null;

    return (
        <div ref={containerRef} className="loading-screen">
            {/* 3D Canvas for the rune animation */}
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{
                    antialias: true,
                    alpha: true,
                    failIfMajorPerformanceCaveat: false
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
            >
                <ambientLight intensity={0.2} />

                {/* The magical rune */}
                <RuneLoader
                    progress={displayProgress}
                    onComplete={handleRuneComplete}
                />

                {/* Floating particles around the rune */}
                <MagicParticles progress={displayProgress} />

                {/* Glass shatter effect */}
                <ShatterEffect
                    isActive={isShattered}
                    onComplete={handleShatterComplete}
                />
            </Canvas>

            {/* Loading text overlay */}
            <div className="loading-overlay">
                <div className="loading-text">
                    <span className="spell-text">Casting Spell...</span>
                    <span className="progress-text">{displayProgress}%</span>
                </div>

                {/* Magical hint text */}
                <div className="loading-hint">
                    {displayProgress < 100 ? 'The ancient runes awaken...' : 'Magic unleashed!'}
                </div>
            </div>
        </div>
    );
};

/**
 * MagicParticles - Floating particles that appear around the rune
 */
const MagicParticles = ({ progress }) => {
    const particlesRef = useRef();
    const count = 50;

    // Create particle positions
    const positions = useRef(
        Array.from({ length: count }, () => ({
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4,
            z: (Math.random() - 0.5) * 2,
            speed: 0.5 + Math.random() * 1,
            offset: Math.random() * Math.PI * 2,
        }))
    );

    return (
        <group ref={particlesRef}>
            {positions.current.map((particle, i) => (
                <FloatingParticle
                    key={i}
                    position={[particle.x, particle.y, particle.z]}
                    speed={particle.speed}
                    offset={particle.offset}
                    intensity={progress / 100}
                />
            ))}
        </group>
    );
};

/**
 * Individual floating particle
 */
const FloatingParticle = ({ position, speed, offset, intensity }) => {
    const meshRef = useRef();

    // Animate particle using properly imported useFrame
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime() * speed + offset;
            meshRef.current.position.y = position[1] + Math.sin(t) * 0.3;
            meshRef.current.position.x = position[0] + Math.cos(t * 0.7) * 0.2;
            meshRef.current.scale.setScalar(0.02 + Math.sin(t * 2) * 0.01);
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial
                color="#f4d03f"
                transparent
                opacity={0.3 + intensity * 0.5}
            />
        </mesh>
    );
};

export default LoadingScreen;
