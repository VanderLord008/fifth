import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * RuneLoader - A magical rune that gets traced by the wand
 * The rune is a Deathly Hallows-inspired symbol that glows as loading progresses
 */
const RuneLoader = ({ progress = 0, onComplete }) => {
    const runeGroupRef = useRef();
    const glowIntensity = useRef(0);
    const completedRef = useRef(false);

    // Define the rune path points (Deathly Hallows-inspired triangle with circle and line)
    const runePaths = useMemo(() => {
        const scale = 1.5;

        // Triangle points
        const triangle = [
            new THREE.Vector3(0, scale, 0),           // Top
            new THREE.Vector3(-scale * 0.866, -scale * 0.5, 0), // Bottom left
            new THREE.Vector3(scale * 0.866, -scale * 0.5, 0),  // Bottom right
            new THREE.Vector3(0, scale, 0),           // Back to top
        ];

        // Circle points (inscribed)
        const circlePoints = [];
        const circleRadius = scale * 0.5;
        const circleCenter = new THREE.Vector3(0, 0, 0);
        for (let i = 0; i <= 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            circlePoints.push(new THREE.Vector3(
                circleCenter.x + Math.cos(angle) * circleRadius,
                circleCenter.y + Math.sin(angle) * circleRadius,
                0
            ));
        }

        // Vertical line
        const verticalLine = [
            new THREE.Vector3(0, scale, 0),
            new THREE.Vector3(0, -scale * 0.5, 0),
        ];

        return { triangle, circle: circlePoints, verticalLine };
    }, []);

    // Calculate how much of each path should be drawn based on progress
    const getDrawProgress = useMemo(() => {
        // Triangle: 0-40%, Circle: 40-80%, Line: 80-100%
        return {
            triangleProgress: Math.min(1, progress / 40),
            circleProgress: Math.max(0, Math.min(1, (progress - 40) / 40)),
            lineProgress: Math.max(0, Math.min(1, (progress - 80) / 20)),
        };
    }, [progress]);

    // Animate glow based on progress
    useEffect(() => {
        gsap.to(glowIntensity, {
            current: progress / 100,
            duration: 0.5,
        });
    }, [progress]);

    // Handle completion
    useEffect(() => {
        if (progress >= 100 && !completedRef.current) {
            completedRef.current = true;
            // Pulse animation on complete
            if (runeGroupRef.current) {
                gsap.to(runeGroupRef.current.scale, {
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        if (onComplete) onComplete();
                    }
                });
            }
        }
    }, [progress, onComplete]);

    // Subtle floating animation
    useFrame((state) => {
        if (runeGroupRef.current) {
            const t = state.clock.getElapsedTime();
            runeGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
        }
    });

    // Get partial path based on progress
    const getPartialPath = (points, progressPercent) => {
        if (progressPercent <= 0) return [points[0], points[0]];
        if (progressPercent >= 1) return points;

        const totalSegments = points.length - 1;
        const targetIndex = progressPercent * totalSegments;
        const currentSegment = Math.floor(targetIndex);
        const segmentProgress = targetIndex - currentSegment;

        const result = points.slice(0, currentSegment + 1);

        if (currentSegment < totalSegments) {
            const start = points[currentSegment];
            const end = points[currentSegment + 1];
            const interpolated = new THREE.Vector3().lerpVectors(start, end, segmentProgress);
            result.push(interpolated);
        }

        return result.length >= 2 ? result : [points[0], points[0]];
    };

    const baseColor = '#4a4a4a';
    const glowColor = '#f4d03f';

    return (
        <group ref={runeGroupRef}>
            {/* Background rune (dimmed guide) */}
            <Line
                points={runePaths.triangle}
                color={baseColor}
                lineWidth={1}
                transparent
                opacity={0.3}
            />
            <Line
                points={runePaths.circle}
                color={baseColor}
                lineWidth={1}
                transparent
                opacity={0.3}
            />
            <Line
                points={runePaths.verticalLine}
                color={baseColor}
                lineWidth={1}
                transparent
                opacity={0.3}
            />

            {/* Glowing traced rune */}
            {getDrawProgress.triangleProgress > 0 && (
                <Line
                    points={getPartialPath(runePaths.triangle, getDrawProgress.triangleProgress)}
                    color={glowColor}
                    lineWidth={3}
                    transparent
                    opacity={0.8 + glowIntensity.current * 0.2}
                />
            )}

            {getDrawProgress.circleProgress > 0 && (
                <Line
                    points={getPartialPath(runePaths.circle, getDrawProgress.circleProgress)}
                    color={glowColor}
                    lineWidth={3}
                    transparent
                    opacity={0.8 + glowIntensity.current * 0.2}
                />
            )}

            {getDrawProgress.lineProgress > 0 && (
                <Line
                    points={getPartialPath(runePaths.verticalLine, getDrawProgress.lineProgress)}
                    color={glowColor}
                    lineWidth={3}
                    transparent
                    opacity={0.8 + glowIntensity.current * 0.2}
                />
            )}

            {/* Glow effect mesh behind the rune */}
            <mesh position={[0, 0.2, -0.1]}>
                <circleGeometry args={[2, 32]} />
                <meshBasicMaterial
                    color={glowColor}
                    transparent
                    opacity={glowIntensity.current * 0.15}
                />
            </mesh>
        </group>
    );
};

export default RuneLoader;
