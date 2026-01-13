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
    CASTLE_PREVIEW: 'castlePreview',
    CASTLE_HALL: 'castleHall',
};

/**
 * Loading messages that cycle during loading
 */
const LOADING_MESSAGES = [
    'Summoning portfolio...',
    'Casting enchantments...',
    'Awakening magic...',
    'Gathering starlight...',
    'Weaving spells...',
    'Opening the gateway...',
];

/**
 * Global state management for the Wizard's Portfolio
 * Manages loading state, current scene, and UI interactions
 */
const usePortfolioStore = create((set, get) => ({
    // Loading state
    isLoaded: false,
    loadingProgress: 0,
    loadingMessage: 'Preparing magical journey...',

    // Current scene
    currentScene: SCENES.LOADING,
    previousScene: null,

    // UI state
    showResume: false,
    selectedProject: null,
    activePortal: null,

    // Audio settings
    isMuted: false,

    // Actions
    setLoadingProgress: (progress) => {
        const messageIndex = Math.min(
            Math.floor((progress / 100) * LOADING_MESSAGES.length),
            LOADING_MESSAGES.length - 1
        );
        set({
            loadingProgress: progress,
            loadingMessage: LOADING_MESSAGES[messageIndex]
        });
    },

    setLoadingMessage: (message) => set({ loadingMessage: message }),
    setIsLoaded: (isLoaded) => set({ isLoaded }),

    setScene: (scene) => set((state) => ({
        previousScene: state.currentScene,
        currentScene: scene
    })),

    toggleResume: () => set((state) => ({ showResume: !state.showResume })),
    setSelectedProject: (project) => set({ selectedProject: project }),
    setActivePortal: (portal) => set({ activePortal: portal }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));

export default usePortfolioStore;
