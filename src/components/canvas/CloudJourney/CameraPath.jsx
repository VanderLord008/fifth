/**
 * ☁️ Camera Flight Path - GSAP-powered cinematic camera journey
 * Creates a smooth flight through the clouds with dynamic effects
 */

import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

export default function CameraPath({
    onJourneyComplete,
    duration = 10,
    startDelay = 0.5
}) {
    const { camera } = useThree();
    const timelineRef = useRef(null);
    const shakeRef = useRef({ x: 0, y: 0 });
    const [isFlying, setIsFlying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Camera shake parameters
    const shakeIntensity = useRef(0);

    useEffect(() => {
        // Initial camera position (starting in clouds)
        camera.position.set(0, 0, -100);
        camera.lookAt(0, 0, 0);
        camera.fov = 60;
        camera.updateProjectionMatrix();

        // Create the flight timeline
        const tl = gsap.timeline({
            delay: startDelay,
            onStart: () => setIsFlying(true),
            onUpdate: () => {
                setProgress(tl.progress());
            },
            onComplete: () => {
                setIsFlying(false);
                if (onJourneyComplete) onJourneyComplete();
            }
        });

        // Store reference
        timelineRef.current = tl;

        // Phase 1: Slow emergence through clouds (0-20%)
        tl.to(camera.position, {
            z: -60,
            y: 5,
            duration: duration * 0.2,
            ease: 'power1.in',
        }, 0);

        tl.to(shakeIntensity, {
            current: 0.05,
            duration: duration * 0.2,
            ease: 'power1.in',
        }, 0);

        // Phase 2: Acceleration through clouds (20-60%)
        tl.to(camera.position, {
            z: 20,
            y: 10,
            duration: duration * 0.4,
            ease: 'power2.inOut',
        });

        // Increase FOV for speed effect
        tl.to(camera, {
            fov: 85,
            duration: duration * 0.3,
            ease: 'power2.in',
            onUpdate: () => camera.updateProjectionMatrix()
        }, duration * 0.15);

        // Increase shake during acceleration
        tl.to(shakeIntensity, {
            current: 0.15,
            duration: duration * 0.3,
            ease: 'power2.inOut',
        }, duration * 0.2);

        // Phase 3: Peak speed flight (40-70%)
        tl.to(camera.position, {
            z: 80,
            y: 8,
            x: 2,
            duration: duration * 0.2,
            ease: 'none',
        });

        // Subtle banking effect
        tl.to(camera.rotation, {
            z: 0.05,
            duration: duration * 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut',
        }, duration * 0.4);

        // Phase 4: Deceleration and approach (70-90%)
        tl.to(camera.position, {
            z: 140,
            y: 5,
            x: 0,
            duration: duration * 0.2,
            ease: 'power2.out',
        });

        // Reduce FOV back to normal
        tl.to(camera, {
            fov: 65,
            duration: duration * 0.25,
            ease: 'power2.out',
            onUpdate: () => camera.updateProjectionMatrix()
        }, duration * 0.65);

        // Reduce shake during deceleration
        tl.to(shakeIntensity, {
            current: 0.02,
            duration: duration * 0.25,
            ease: 'power2.out',
        }, duration * 0.6);

        // Phase 5: Gentle float to final position (90-100%)
        tl.to(camera.position, {
            z: 180,
            y: 3,
            duration: duration * 0.1,
            ease: 'power1.out',
        });

        // Final camera stabilization
        tl.to(shakeIntensity, {
            current: 0,
            duration: duration * 0.1,
            ease: 'power2.out',
        }, duration * 0.9);

        return () => {
            tl.kill();
        };
    }, [camera, duration, startDelay, onJourneyComplete]);

    // Apply camera shake each frame
    useFrame((state) => {
        if (!isFlying) return;

        const time = state.clock.elapsedTime;
        const intensity = shakeIntensity.current;

        // Perlin-like smooth noise for organic shake
        shakeRef.current.x = Math.sin(time * 8) * intensity * 0.5 +
            Math.sin(time * 13) * intensity * 0.3;
        shakeRef.current.y = Math.cos(time * 10) * intensity * 0.5 +
            Math.cos(time * 7) * intensity * 0.3;

        // Apply shake offset
        camera.position.x += shakeRef.current.x;
        camera.position.y += shakeRef.current.y;

        // Look ahead with slight variation
        const lookAheadY = Math.sin(time * 0.5) * 2;
        camera.lookAt(camera.position.x, lookAheadY, camera.position.z + 50);
    });

    return null; // This component only controls the camera
}
