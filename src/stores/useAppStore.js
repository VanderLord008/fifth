import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  // Loading state
  loadingProgress: 0,
  loadingMessage: 'Summoning portfolio...',
  isLoaded: false,
  
  // Scene navigation
  currentScene: 'loading', // 'loading' | 'clouds' | 'castle' | 'hall' | 'project'
  previousScene: null,
  
  // Project portal state
  activePortal: null,
  selectedProject: null,
  
  // Loading messages that cycle during loading
  loadingMessages: [
    'Summoning portfolio...',
    'Casting enchantments...',
    'Awakening magic...',
    'Gathering starlight...',
    'Weaving spells...',
    'Opening the gateway...',
  ],
  
  // Actions
  setLoadingProgress: (progress) => {
    const messages = get().loadingMessages
    const messageIndex = Math.min(
      Math.floor((progress / 100) * messages.length),
      messages.length - 1
    )
    set({ 
      loadingProgress: progress,
      loadingMessage: messages[messageIndex]
    })
  },
  
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  
  setCurrentScene: (scene) => set((state) => ({ 
    previousScene: state.currentScene,
    currentScene: scene 
  })),
  
  setActivePortal: (portal) => set({ activePortal: portal }),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  // Transition helper
  transitionTo: (scene) => {
    const current = get().currentScene
    set({ previousScene: current, currentScene: scene })
  },
}))

export default useAppStore
