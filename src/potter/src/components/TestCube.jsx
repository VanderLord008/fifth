import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';

/**
 * A magical test cube to verify R3F is working
 * This will be replaced by actual content later
 */
const TestCube = ({ position = [0, 0, 0] }) => {
    const meshRef = useRef();

    // Animate the cube rotation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.7;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[2, 2, 2]} />
            <MeshWobbleMaterial
                color="#9b59b6"
                speed={2}
                factor={0.3}
                emissive="#3498db"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

export default TestCube;
