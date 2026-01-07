import { useCallback } from 'react';
import usePortfolioStore from '../store/usePortfolioStore';

/**
 * Hook to manage experience phase transitions
 * Provides methods to navigate between phases
 */
const usePhaseManager = () => {
    const currentPhase = usePortfolioStore((state) => state.currentPhase);
    const setPhase = usePortfolioStore((state) => state.setPhase);

    const phases = ['loading', 'journey', 'castle', 'hall'];

    const goToPhase = useCallback((phase) => {
        if (phases.includes(phase)) {
            setPhase(phase);
        }
    }, [setPhase]);

    const nextPhase = useCallback(() => {
        const currentIndex = phases.indexOf(currentPhase);
        if (currentIndex < phases.length - 1) {
            setPhase(phases[currentIndex + 1]);
        }
    }, [currentPhase, setPhase]);

    const isPhase = useCallback((phase) => {
        return currentPhase === phase;
    }, [currentPhase]);

    return {
        currentPhase,
        goToPhase,
        nextPhase,
        isPhase,
    };
};

export default usePhaseManager;
