/**
 * 🧙‍♂️ Loading Scene - Complete magical loading experience
 * Features spell circle, wand, particles, and starfield
 * Now with mouse interaction for rotating the scene!
 */

import { useRef, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect } from 'react';

import usePortfolioStore, { SCENES } from '../../stores/portfolioStore';

import SpellCircle from '../effects/SpellCircle';
import MagicWand from '../effects/MagicWand';
import MagicalParticles from '../effects/MagicalParticles';
import StarField from '../effects/StarField';


export default function LoadingScene() {
    const groupRef = useRef();
    const intervalRef = useRef(null);
    const { camera, gl } = useThree();

    const setLoadingProgress = usePortfolioStore((state) => state.setLoadingProgress);
    const setIsLoaded = usePortfolioStore((state) => state.setIsLoaded);
    const setScene = usePortfolioStore((state) => state.setScene);

    const [localProgress, setLocalProgress] = useState(0);
    const [loadComplete, setLoadComplete] = useState(false);

    // Mouse interaction state
    const [isDragging, setIsDragging] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0 });
    const currentRotation = useRef({ x: 0, y: 0 });

    // Mouse event handlers
    const handlePointerDown = useCallback((e) => {
        setIsDragging(true);
        setMousePosition({ x: e.clientX, y: e.clientY });
    }, []);

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handlePointerMove = useCallback((e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - mousePosition.x;
        const deltaY = e.clientY - mousePosition.y;

        // Update target rotation based on mouse movement
        targetRotation.current.y += deltaX * 0.005;
        targetRotation.current.x += deltaY * 0.005;

        // Clamp vertical rotation to prevent flipping
        targetRotation.current.x = Math.max(-0.5, Math.min(0.5, targetRotation.current.x));

        setMousePosition({ x: e.clientX, y: e.clientY });
    }, [isDragging, mousePosition]);

    // Setup mouse event listeners
    useEffect(() => {
        const canvas = gl.domElement;

        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointerleave', handlePointerUp);
        canvas.addEventListener('pointermove', handlePointerMove);

        return () => {
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointerleave', handlePointerUp);
            canvas.removeEventListener('pointermove', handlePointerMove);
        };
    }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

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

        // Smoothly interpolate current rotation towards target rotation
        const lerpFactor = 0.08;
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;

        // Apply rotation to scene group (combined with subtle auto-rotation)
        if (groupRef.current) {
            groupRef.current.rotation.x = currentRotation.current.x;
            groupRef.current.rotation.y = currentRotation.current.y;
            // Keep the subtle z-axis wobble
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
