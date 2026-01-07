import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import usePortfolioStore from '../../store/usePortfolioStore';

/**
 * CameraRig - Animated camera controller for the journey through clouds
 * Uses GSAP for smooth cinematic camera movements
 */
const CameraRig = ({
    isActive = true,
    onJourneyComplete,
    onProgress,
    journeyDuration = 10,
}) => {
    const { camera } = useThree();
    const [isAnimating, setIsAnimating] = useState(false);
    const timelineRef = useRef(null);
    const shakeRef = useRef({ x: 0, y: 0 });
    const currentPhase = usePortfolioStore((state) => state.currentPhase);

    // Camera journey waypoints
    // Castle is at z=-140, so we travel from z=100 to z=-115
    const waypoints = {
        start: {
            position: new THREE.Vector3(0, 50, 100),
            lookAt: new THREE.Vector3(0, 0, -140),
        },
        diving: {
            position: new THREE.Vector3(0, 25, 30),
            lookAt: new THREE.Vector3(0, 0, -140),
        },
        throughClouds: {
            position: new THREE.Vector3(5, 10, -40),
            lookAt: new THREE.Vector3(0, 5, -140),
        },
        approaching: {
            position: new THREE.Vector3(0, 8, -80),
            lookAt: new THREE.Vector3(0, 5, -140),
        },
        arrival: {
            position: new THREE.Vector3(0, 5, -115),
            lookAt: new THREE.Vector3(0, 5, -140),
        },
    };

    // Start the journey animation
    useEffect(() => {
        if (currentPhase === 'journey' && !isAnimating) {
            startJourney();
        }
    }, [currentPhase]);

    const startJourney = () => {
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        setIsAnimating(true);

        // Set initial camera position
        camera.position.copy(waypoints.start.position);

        // Create GSAP timeline for the journey
        const tl = gsap.timeline({
            onUpdate: () => {
                // Report progress (0 to 1)
                if (onProgress) {
                    onProgress(tl.progress());
                }
            },
            onComplete: () => {
                setIsAnimating(false);
                if (onProgress) onProgress(1);
                if (onJourneyComplete) onJourneyComplete();
            },
        });

        timelineRef.current = tl;

        // Animate camera through waypoints
        tl.to(camera.position, {
            x: waypoints.diving.position.x,
            y: waypoints.diving.position.y,
            z: waypoints.diving.position.z,
            duration: journeyDuration * 0.25,
            ease: 'power2.inOut',
        })
            .to(camera.position, {
                x: waypoints.throughClouds.position.x,
                y: waypoints.throughClouds.position.y,
                z: waypoints.throughClouds.position.z,
                duration: journeyDuration * 0.3,
                ease: 'power1.inOut',
            })
            .to(camera.position, {
                x: waypoints.approaching.position.x,
                y: waypoints.approaching.position.y,
                z: waypoints.approaching.position.z,
                duration: journeyDuration * 0.25,
                ease: 'power2.inOut',
            })
            .to(camera.position, {
                x: waypoints.arrival.position.x,
                y: waypoints.arrival.position.y,
                z: waypoints.arrival.position.z,
                duration: journeyDuration * 0.2,
                ease: 'power3.out',
            });

        // Add camera shake effect
        gsap.to(shakeRef.current, {
            x: 0.02,
            y: 0.015,
            duration: journeyDuration * 0.5,
            ease: 'power1.in',
            yoyo: true,
            repeat: 1,
        });
    };

    // Apply camera shake and look direction
    useFrame((state) => {
        if (!isActive) return;

        const time = state.clock.elapsedTime;

        // Apply subtle camera shake
        const shakeX = Math.sin(time * 10) * shakeRef.current.x;
        const shakeY = Math.cos(time * 12) * shakeRef.current.y;

        camera.rotation.x += shakeX * 0.1;
        camera.rotation.y += shakeY * 0.1;

        // Look toward the castle at z=-140
        const castleTarget = new THREE.Vector3(0, 5, -140);

        // Gentle camera look toward castle
        camera.lookAt(castleTarget);
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, []);

    return null; // This component only controls the camera
};

export default CameraRig;
