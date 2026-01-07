/**
 * 🧙‍♂️ useSceneTransition - Custom hook for scene transitions
 * Handles GSAP-powered transitions between scenes
 */

import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import usePortfolioStore, { SCENES } from '../stores/portfolioStore';

export default function useSceneTransition() {
    const {
        setScene,
        startTransition,
        endTransition,
        isTransitioning
    } = usePortfolioStore();

    const timelineRef = useRef(null);

    /**
     * Transition to a new scene with optional animation
     * @param {string} targetScene - The scene to transition to
     * @param {object} options - Transition options
     */
    const transitionTo = useCallback((targetScene, options = {}) => {
        const {
            duration = 1,
            ease = 'power2.inOut',
            onStart,
            onComplete,
            transitionType = 'fade',
        } = options;

        if (isTransitioning) {
            console.warn('Transition already in progress');
            return;
        }

        // Start transition state
        startTransition(transitionType);
        onStart?.();

        // Create GSAP timeline for the transition
        timelineRef.current = gsap.timeline({
            onComplete: () => {
                endTransition();
                onComplete?.();
            },
        });

        // Add transition animation based on type
        switch (transitionType) {
            case 'fade':
                // Simple fade - scene change happens at midpoint
                timelineRef.current
                    .to({}, { duration: duration / 2 })
                    .call(() => setScene(targetScene))
                    .to({}, { duration: duration / 2 });
                break;

            case 'spell':
                // Spell casting transition - for entering project worlds
                timelineRef.current
                    .to({}, { duration: duration * 0.3 })
                    .call(() => setScene(targetScene))
                    .to({}, { duration: duration * 0.7 });
                break;

            case 'portal':
                // Portal warp transition
                timelineRef.current
                    .to({}, { duration: duration * 0.4 })
                    .call(() => setScene(targetScene))
                    .to({}, { duration: duration * 0.6 });
                break;

            case 'instant':
                // No animation, immediate switch
                setScene(targetScene);
                endTransition();
                break;

            default:
                setScene(targetScene);
                endTransition();
        }
    }, [isTransitioning, setScene, startTransition, endTransition]);

    /**
     * Cancel any ongoing transition
     */
    const cancelTransition = useCallback(() => {
        if (timelineRef.current) {
            timelineRef.current.kill();
            timelineRef.current = null;
            endTransition();
        }
    }, [endTransition]);

    /**
     * Quick navigation methods for common transitions
     */
    const goToCloudJourney = useCallback(() => {
        transitionTo(SCENES.CLOUD_JOURNEY, {
            transitionType: 'spell',
            duration: 1.5
        });
    }, [transitionTo]);

    const goToCastleGate = useCallback(() => {
        transitionTo(SCENES.CASTLE_GATE, {
            transitionType: 'fade',
            duration: 1
        });
    }, [transitionTo]);

    const goToGreatHall = useCallback(() => {
        transitionTo(SCENES.GREAT_HALL, {
            transitionType: 'portal',
            duration: 1.2
        });
    }, [transitionTo]);

    const goToProject = useCallback((projectId) => {
        usePortfolioStore.getState().setSelectedProject(projectId);
        transitionTo(SCENES.PROJECT_WORLD, {
            transitionType: 'portal',
            duration: 1.5
        });
    }, [transitionTo]);

    const returnToHub = useCallback(() => {
        usePortfolioStore.getState().clearSelectedProject();
        transitionTo(SCENES.GREAT_HALL, {
            transitionType: 'spell',
            duration: 1
        });
    }, [transitionTo]);

    return {
        transitionTo,
        cancelTransition,
        isTransitioning,
        goToCloudJourney,
        goToCastleGate,
        goToGreatHall,
        goToProject,
        returnToHub,
    };
}
