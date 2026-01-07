/**
 * 🧙‍♂️ Loading Scene - Complete magical loading experience
 * Features spell circle, wand, particles, and starfield
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

import usePortfolioStore, { SCENES } from '../../stores/portfolioStore';

import SpellCircle from '../effects/SpellCircle';
import MagicWand from '../effects/MagicWand';
import MagicalParticles from '../effects/MagicalParticles';
import StarField from '../effects/StarField';


export default function LoadingScene() {
    const groupRef = useRef();
    const intervalRef = useRef(null);
    const { camera } = useThree();

    const setLoadingProgress = usePortfolioStore((state) => state.setLoadingProgress);
    const setIsLoaded = usePortfolioStore((state) => state.setIsLoaded);
    const setScene = usePortfolioStore((state) => state.setScene);

    const [localProgress, setLocalProgress] = useState(0);
    const [loadComplete, setLoadComplete] = useState(false);

    // Camera setup for loading scene
    useEffect(() => {
        gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: 6,
            duration: 1,
            ease: 'power2.out',
        });
    }, [camera]);

    // Simulate loading progress smoothly
    useFrame((state, delta) => {
        if (loadComplete) return;

        // Rotate scene slightly
        if (groupRef.current) {
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
        }

        // Smoothly increment progress
        // Target 100% in roughly 4-5 seconds (approx 20-25% per second)
        // Add slight random variation for organic feel, but keep it continuous
        const speed = 22 + Math.sin(state.clock.elapsedTime * 5) * 5;

        let newProgress = localProgress + speed * delta;
        if (newProgress > 100) newProgress = 100;

        setLocalProgress(newProgress);
        setLoadingProgress(newProgress);

        // Check for completion
        if (newProgress >= 100 && !loadComplete && !intervalRef.current) {
            // Set a flag to prevent multiple triggers (using intervalRef as a flag here)
            intervalRef.current = true; // Mark as handled

            // Delay before transition for a moment to show 100%
            setTimeout(() => {
                setIsLoaded(true);
                setLoadComplete(true);

                // Transition to next scene smoothly
                setTimeout(() => {
                    setScene(SCENES.CLOUD_JOURNEY);
                }, 500);
            }, 500);
        }
    });



    return (
        <group ref={groupRef}>
            {/* Starfield background */}
            <StarField count={400} radius={40} />

            {/* Main spell circle */}
            <SpellCircle progress={localProgress} scale={1.2} />

            {/* Magic wand casting the spell */}
            <MagicWand position={[-2.5, 0.8, 1]} />

            {/* Floating magical particles */}
            <MagicalParticles
                count={80}
                radius={4}
                color="#ffd700"
                size={0.04}
                speed={0.15}
            />

            {/* Secondary particles (blue) */}
            <MagicalParticles
                count={50}
                radius={5}
                color="#00d4ff"
                size={0.03}
                speed={0.1}
                opacity={0.6}
            />

            {/* Purple accent particles */}
            <MagicalParticles
                count={30}
                radius={3}
                color="#8b5cf6"
                size={0.05}
                speed={0.2}
                opacity={0.4}
            />

            {/* Transition flash effect */}


            {/* Ambient lighting for the scene */}
            <ambientLight intensity={0.2} color="#6366f1" />

            {/* Dramatic back light */}
            <pointLight
                position={[0, 0, -5]}
                intensity={0.5}
                color="#4a2c7a"
                distance={20}
            />
        </group>
    );
}
