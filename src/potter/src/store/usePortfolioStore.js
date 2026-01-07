import { create } from 'zustand';

/**
 * Global state management for the Harry Potter Portfolio
 * Manages loading state, current phase, and UI interactions
 */
const usePortfolioStore = create((set) => ({
  // Loading state
  isLoading: true,
  loadingProgress: 0,
  
  // Experience phases: 'loading' | 'journey' | 'castle' | 'hall'
  currentPhase: 'loading',
  
  // UI state
  showResume: false,
  selectedProject: null,
  
  // Audio settings
  isMuted: false,
  
  // Actions
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoading: (isLoading) => set({ isLoading }),
  setPhase: (phase) => set({ currentPhase: phase }),
  toggleResume: () => set((state) => ({ showResume: !state.showResume })),
  setSelectedProject: (project) => set({ selectedProject: project }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));

export default usePortfolioStore;
