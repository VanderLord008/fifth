import { create } from 'zustand';

/**
 * Scene constants
 */
export const SCENES = {
    LOADING: 'loading',
    CLOUD_JOURNEY: 'cloudJourney',
    CASTLE_GATE: 'castleGate',
    GREAT_HALL: 'greatHall',
    PROJECT_WORLD: 'projectWorld',
};

/**
 * Global state management for the Harry Potter Portfolio
 * Manages loading state, current scene, and UI interactions
 */
const usePortfolioStore = create((set) => ({
    // Loading state
    isLoaded: false,
    loadingProgress: 0,
    loadingMessage: 'Preparing magical journey...',

    // Current scene
    currentScene: SCENES.LOADING,

    // UI state
    showResume: false,
    selectedProject: null,

    // Audio settings
    isMuted: false,

    // Actions
    setLoadingProgress: (progress) => set({ loadingProgress: progress }),
    setLoadingMessage: (message) => set({ loadingMessage: message }),
    setIsLoaded: (isLoaded) => set({ isLoaded }),
    setScene: (scene) => set({ currentScene: scene }),
    toggleResume: () => set((state) => ({ showResume: !state.showResume })),
    setSelectedProject: (project) => set({ selectedProject: project }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));

export default usePortfolioStore;
