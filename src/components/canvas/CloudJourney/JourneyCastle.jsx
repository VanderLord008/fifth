/**
 * 🏰 GLB Castle for Journey Scene - Uses the provided Castle.glb model
 * With door "sucked into portal" animation effect
 * Camera flies into portal and switches to Castle Hall scene
 */

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Sparkles } from '@react-three/drei';
import { useControls, folder, button } from 'leva';
import { AdditiveBlending } from 'three';
import * as THREE from 'three';
import usePortfolioStore, { SCENES } from '../../../stores/portfolioStore';
import '../CastleDoor/PortalShaderMaterial'; // Extends <portalMaterial />

// Model path with base URL for GitHub Pages
const CASTLE_MODEL_PATH = `${import.meta.env.BASE_URL}models/Castle.glb`;

export default function JourneyCastle({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, onPortalEnter }) {
    const groupRef = useRef();
    const portalMaterial = useRef();
    const { scene } = useGLTF(CASTLE_MODEL_PATH);
    const { camera } = useThree();
    const [doorsOpen, setDoorsOpen] = useState(false);
    const [doorMesh, setDoorMesh] = useState(null);
    const [cameraFlying, setCameraFlying] = useState(false);

    // Get the scene switcher from store
    const setScene = usePortfolioStore((state) => state.setScene);

    // Animation state refs (persisted between frames)
    const doorAnimation = useRef({
        scale: 1,
        posX: 0,
        posY: 0,
        posZ: 0,
        rotZ: 0,
        opacity: 1,
    });
    const cameraAnimation = useRef({
        progress: 0,
        startPos: null,
        targetPos: null,
    });
    const originalDoorMaterial = useRef(null);

    // Leva controls for fine-tuning
    const {
        offsetX, offsetY, offsetZ, rotY, castleScale,
        doorMeshName, doorOffsetX, doorOffsetY, doorOffsetZ, doorScale, suckSpeed, spinAmount,
        portalX, portalY, portalZ, portalScale, portalColorStart, portalColorEnd,
        cameraFlySpeed, showDebug
    } = useControls('Journey Castle', {
        position: folder({
            offsetX: { value: -2.5, min: -20, max: 20, step: 0.5 },
            offsetY: { value: 15.5, min: -20, max: 30, step: 0.5 },
            offsetZ: { value: -3.5, min: -20, max: 20, step: 0.5 },
        }),
        rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        castleScale: { value: 1.8, min: 0.1, max: 5, step: 0.1 },
        doors: folder({
            doorMeshName: { value: 'pCube42', label: 'Door Mesh Name' },
            doorOffsetX: { value: 0, min: -30, max: 30, step: 0.1 },
            doorOffsetY: { value: 0, min: -30, max: 30, step: 0.1 },
            doorOffsetZ: { value: 0.4, min: -30, max: 30, step: 0.1 },
            doorScale: { value: 1, min: 0.1, max: 5, step: 0.1 },
            suckSpeed: { value: 3, min: 1, max: 10, step: 0.5 },
            spinAmount: { value: 4, min: 0, max: 10, step: 0.5 },
            showDebug: { value: false, label: 'Show Click Area' },
        }),
        portal: folder({
            portalX: { value: 1.2, min: -30, max: 30, step: 0.1 },
            portalY: { value: -8.7, min: -30, max: 30, step: 0.1 },
            portalZ: { value: 0.2, min: -30, max: 30, step: 0.1 },
            portalScale: { value: 2.05, min: 0.1, max: 5, step: 0.05 },
            portalColorStart: { value: '#ff69b4' },
            portalColorEnd: { value: '#ffffff' },
        }),
        cameraFlySpeed: { value: 2, min: 0.5, max: 5, step: 0.1 },
        'Toggle Portal': button(() => setDoorsOpen(prev => !prev)),
        'Reset Door': button(() => {
            doorAnimation.current = { scale: 1, posX: 0, posY: 0, posZ: 0, rotZ: 0, opacity: 1 };
            setDoorsOpen(false);
            setCameraFlying(false);
        }),
    });

    // Clone scene and find door mesh
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Find door mesh after scene is loaded
    useEffect(() => {
        let door = null;

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.userData.clickable = true;

                if (child.name === doorMeshName) {
                    door = child;
                    // Store original material for opacity animation
                    if (door.material) {
                        originalDoorMaterial.current = door.material.clone();
                        door.material = door.material.clone();
                        door.material.transparent = true;
                    }
                    console.log('Found DOOR mesh:', child.name);
                }
            }
        });

        setDoorMesh(door);
    }, [clonedScene, doorMeshName]);

    // Animation loop
    useFrame((state, delta) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;
            groupRef.current.position.y = position[1] + offsetY + Math.sin(time * 0.3) * 0.2;
        }

        // Animate portal shader
        if (portalMaterial.current) {
            portalMaterial.current.uTime += delta;
        }

        // Animate door - "sucked into portal" effect
        if (doorMesh) {
            const anim = doorAnimation.current;

            if (doorsOpen) {
                // Door is being sucked in
                const targetScale = 0.01;
                anim.scale += (targetScale - anim.scale) * suckSpeed * delta;

                // Move toward portal position
                const targetPosX = portalX;
                const targetPosY = portalY;
                const targetPosZ = portalZ - 0.3;
                anim.posX = anim.posX || 0;
                anim.posY = anim.posY || 0;
                anim.posX += (targetPosX - anim.posX) * suckSpeed * delta;
                anim.posY += (targetPosY - anim.posY) * suckSpeed * delta;
                anim.posZ += (targetPosZ - anim.posZ) * suckSpeed * delta;

                // Spin as it gets sucked in
                anim.rotZ += spinAmount * delta;

                // Fade out
                anim.opacity += (0 - anim.opacity) * suckSpeed * delta;
            } else {
                // Door is returning
                anim.scale += (1 - anim.scale) * suckSpeed * delta;
                anim.posX = anim.posX || 0;
                anim.posY = anim.posY || 0;
                anim.posX += (0 - anim.posX) * suckSpeed * delta;
                anim.posY += (0 - anim.posY) * suckSpeed * delta;
                anim.posZ += (0 - anim.posZ) * suckSpeed * delta;
                anim.rotZ += (0 - anim.rotZ) * suckSpeed * 0.5 * delta;
                anim.opacity += (1 - anim.opacity) * suckSpeed * delta;
            }

            // Apply animation to mesh
            doorMesh.scale.setScalar(Math.max(anim.scale * doorScale, 0.01));
            doorMesh.position.x = doorOffsetX + (anim.posX || 0);
            doorMesh.position.y = doorOffsetY + (anim.posY || 0);
            doorMesh.position.z = doorOffsetZ + anim.posZ;
            doorMesh.rotation.z = anim.rotZ;

            if (doorMesh.material) {
                doorMesh.material.opacity = anim.opacity;
            }
        }

        // Animate camera flying into portal
        if (cameraFlying && groupRef.current) {
            const camAnim = cameraAnimation.current;
            camAnim.progress += cameraFlySpeed * delta;

            if (camAnim.progress < 1) {
                // Easing function for smooth acceleration
                const t = 1 - Math.pow(1 - camAnim.progress, 3);

                // Get portal world position
                const portalWorldPos = new THREE.Vector3(portalX, portalY, portalZ);
                groupRef.current.localToWorld(portalWorldPos);

                // Interpolate camera position toward portal
                if (camAnim.startPos) {
                    camera.position.lerpVectors(camAnim.startPos, portalWorldPos, t);
                    camera.lookAt(portalWorldPos);
                }
            } else {
                // Animation complete - switch to Castle Hall scene
                console.log('Camera reached portal! Switching to Castle Hall...');
                setScene(SCENES.CASTLE_HALL);
                setCameraFlying(false);
            }
        }
    });

    // Handle click on castle door
    const handleClick = (e) => {
        e.stopPropagation();

        const clickedMesh = e.object;
        console.log('Clicked mesh:', clickedMesh.name);

        // Check if clicked on the door
        if (clickedMesh.name === doorMeshName && !cameraFlying) {
            console.log('Door clicked! Activating portal and camera fly...');
            setDoorsOpen(true);

            // Start camera fly animation after a short delay
            setTimeout(() => {
                cameraAnimation.current = {
                    progress: 0,
                    startPos: camera.position.clone(),
                    targetPos: null,
                };
                setCameraFlying(true);
            }, 500);

            if (onPortalEnter) {
                setTimeout(() => onPortalEnter(), 800);
            }
        }
    };

    return (
        <group
            ref={groupRef}
            position={[position[0] + offsetX, position[1] + offsetY, position[2] + offsetZ]}
            rotation={[rotation[0], rotation[1] + rotY, rotation[2]]}
            scale={scale * castleScale}
        >
            {/* Castle model - clickable */}
            <primitive
                object={clonedScene}
                onClick={handleClick}
            />

            {/* Portal effect behind doors */}
            <mesh
                position={[portalX, portalY, portalZ]}
                rotation={[0, 0, 0]}
            >
                <circleGeometry args={[portalScale, 64]} />
                <portalMaterial
                    ref={portalMaterial}
                    blending={AdditiveBlending}
                    uColorStart={portalColorStart}
                    uColorEnd={portalColorEnd}
                    transparent
                />
            </mesh>

            {/* Sparkles around portal - more intense when open */}
            <Sparkles
                count={doorsOpen ? 60 : 20}
                size={doorsOpen ? 3 : 1}
                position={[portalX, portalY, portalZ + 0.1]}
                scale={[portalScale * 2.5, portalScale * 2.5, 0.5]}
                speed={doorsOpen ? 1 : 0.3}
                color={portalColorStart}
            />

            {/* Glow light - intensifies when portal is active */}
            <pointLight
                position={[portalX, portalY, portalZ + 0.3]}
                intensity={doorsOpen ? 5 : 1}
                color={portalColorStart}
                distance={doorsOpen ? 4 : 2}
            />

            {/* Debug: Click area visualization */}
            {showDebug && (
                <mesh position={[0, 1.5, 0.9]} onClick={() => setDoorsOpen(!doorsOpen)}>
                    <boxGeometry args={[1, 2, 0.1]} />
                    <meshBasicMaterial color="red" transparent opacity={0.3} wireframe />
                </mesh>
            )}
        </group>
    );
}

useGLTF.preload(CASTLE_MODEL_PATH);
