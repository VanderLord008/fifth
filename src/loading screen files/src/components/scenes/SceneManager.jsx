/**
 * 🧙‍♂️ Scene Manager - Routes between different 3D scenes
 * Handles scene transitions and renders the appropriate scene
 */

import { useEffect } from 'react';
import usePortfolioStore, { SCENES } from '../../stores/portfolioStore';

// Scene components
import LoadingScene from './LoadingScene';
import CloudJourneyScene from './CloudJourneyScene';
// import CastleGateScene from './CastleGateScene';
// import GreatHallScene from './GreatHallScene';
// import ProjectWorldScene from './ProjectWorldScene';

// Placeholder component for scenes not yet implemented
function PlaceholderScene({ name }) {
    return (
        <group>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#4a2c7a" />
            </mesh>
            {/* Text would go here but drei's Text needs font loaded */}
        </group>
    );
}

export default function SceneManager() {
    const { currentScene, isLoaded } = usePortfolioStore();

    // Scene rendering based on current state
    const renderScene = () => {
        switch (currentScene) {
            case SCENES.LOADING:
                return <LoadingScene />;

            case SCENES.CLOUD_JOURNEY:
                return <CloudJourneyScene />;

            case SCENES.CASTLE_GATE:
                // return <CastleGateScene />;
                return <PlaceholderScene name="Castle Gate" />;

            case SCENES.GREAT_HALL:
                // return <GreatHallScene />;
                return <PlaceholderScene name="Great Hall" />;

            case SCENES.PROJECT_WORLD:
                // return <ProjectWorldScene />;
                return <PlaceholderScene name="Project World" />;

            default:
                return <LoadingScene />;
        }
    };

    return (
        <group>
            {renderScene()}
        </group>
    );
}
