import { useProgress } from '@react-three/drei';
import { useEffect } from 'react';
import usePortfolioStore from '../store/usePortfolioStore';

/**
 * Hook to track 3D asset loading progress
 * Connects drei's useProgress to our global store
 */
const useLoadingProgress = () => {
    const { progress, loaded, total, active } = useProgress();
    const setLoadingProgress = usePortfolioStore((state) => state.setLoadingProgress);
    const setLoading = usePortfolioStore((state) => state.setLoading);

    useEffect(() => {
        setLoadingProgress(progress);

        // When all assets are loaded
        if (progress === 100 && !active) {
            // Small delay before marking as complete for smooth transition
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [progress, active, setLoadingProgress, setLoading]);

    return { progress, loaded, total, isLoading: active };
};

export default useLoadingProgress;
