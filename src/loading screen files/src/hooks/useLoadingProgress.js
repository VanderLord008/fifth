/**
 * 🧙‍♂️ useLoadingProgress - Custom hook for tracking asset loading
 * Provides loading progress and manages loading state
 */

import { useEffect, useCallback, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import usePortfolioStore from '../stores/portfolioStore';

// Loading messages that cycle during load
const LOADING_MESSAGES = [
    'Summoning portfolio...',
    'Casting enchantments...',
    'Preparing apparition...',
    'Brewing magic...',
    'Gathering spells...',
    'Awakening the castle...',
];

export default function useLoadingProgress() {
    const {
        loadingProgress,
        setLoadingProgress,
        setLoadingMessage,
        setIsLoaded,
        isLoaded,
    } = usePortfolioStore();

    // Track drei's loading progress
    const { progress, loaded, total, active } = useProgress();

    const messageIntervalRef = useRef(null);
    const messageIndexRef = useRef(0);

    // Sync drei progress with our store
    useEffect(() => {
        setLoadingProgress(progress);

        if (progress >= 100 && !isLoaded) {
            // Add a small delay before marking as loaded for smoother transition
            const timer = setTimeout(() => {
                setIsLoaded(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [progress, isLoaded, setLoadingProgress, setIsLoaded]);

    // Cycle through loading messages
    useEffect(() => {
        if (!isLoaded) {
            messageIntervalRef.current = setInterval(() => {
                messageIndexRef.current = (messageIndexRef.current + 1) % LOADING_MESSAGES.length;
                setLoadingMessage(LOADING_MESSAGES[messageIndexRef.current]);
            }, 2000);
        }

        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, [isLoaded, setLoadingMessage]);

    /**
     * Manually set progress (useful for simulated loading)
     */
    const simulateProgress = useCallback((targetProgress, duration = 1000) => {
        const startProgress = loadingProgress;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentProgress = startProgress + (targetProgress - startProgress) * progress;

            setLoadingProgress(currentProgress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [loadingProgress, setLoadingProgress]);

    /**
     * Force complete loading (for development/testing)
     */
    const forceComplete = useCallback(() => {
        setLoadingProgress(100);
        setIsLoaded(true);
    }, [setLoadingProgress, setIsLoaded]);

    return {
        progress: loadingProgress,
        isLoaded,
        isLoading: active,
        loaded,
        total,
        simulateProgress,
        forceComplete,
    };
}
