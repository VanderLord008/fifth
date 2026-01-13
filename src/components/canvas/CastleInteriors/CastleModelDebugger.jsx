/**
 * 🔍 Castle Model Debugger - Shows all mesh names in Castle.glb
 * Use this to find the cloud mesh names
 */

import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const CASTLE_MODEL_PATH = `${import.meta.env.BASE_URL}models/Castle.glb`;

export default function CastleModelDebugger() {
    const { scene } = useGLTF(CASTLE_MODEL_PATH);

    useEffect(() => {
        console.log('=== Castle.glb Model Structure ===');
        console.log('Traversing all objects in the scene...\n');

        let meshCount = 0;
        let groupCount = 0;

        scene.traverse((child) => {
            const indent = '  '.repeat(getDepth(child, scene));

            if (child.isMesh) {
                meshCount++;
                console.log(`${indent}📦 MESH: "${child.name}"`);
                if (child.material) {
                    const matName = child.material.name || 'unnamed';
                    const color = child.material.color ?
                        `#${child.material.color.getHexString()}` : 'N/A';
                    console.log(`${indent}   └─ Material: ${matName}, Color: ${color}`);
                }
            } else if (child.isGroup || child.isObject3D) {
                groupCount++;
                if (child.name) {
                    console.log(`${indent}📁 GROUP: "${child.name}"`);
                }
            }
        });

        console.log('\n=== Summary ===');
        console.log(`Total meshes: ${meshCount}`);
        console.log(`Total groups: ${groupCount}`);
        console.log('================\n');

    }, [scene]);

    return null; // This is just a debug component, renders nothing
}

function getDepth(obj, root) {
    let depth = 0;
    let parent = obj.parent;
    while (parent && parent !== root) {
        depth++;
        parent = parent.parent;
    }
    return depth;
}

useGLTF.preload(CASTLE_MODEL_PATH);
