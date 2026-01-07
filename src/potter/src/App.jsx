import { useState, useEffect, useCallback } from 'react';
import Experience from './Experience';
import { LoadingScreen } from './components/LoadingScreen';
import { ResumeModal } from './components/UI';
import ErrorBoundary from './components/ErrorBoundary';
import usePortfolioStore from './store/usePortfolioStore';
import './index.css';

/**
 * Root App Component
 * Harry Potter Themed 3D Portfolio
 * 
 * Flow: Loading → Journey (clouds) → Castle → Great Hall
 */
function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const setPhase = usePortfolioStore((state) => state.setPhase);
  const currentPhase = usePortfolioStore((state) => state.currentPhase);

  // Simulate loading progress (will be replaced with actual asset loading later)
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random increment between 5-20
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setLoadingProgress(Math.min(100, Math.round(progress)));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Handle loading complete transition
  const handleLoadingComplete = useCallback(() => {
    setIsLoadingComplete(true);
    // Start with the journey through clouds
    setPhase('journey');
  }, [setPhase]);

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Main 3D Experience */}
        <ErrorBoundary>
          <Experience />
        </ErrorBoundary>

        {/* Loading Screen Overlay */}
        {!isLoadingComplete && (
          <ErrorBoundary>
            <LoadingScreen
              progress={loadingProgress}
              onLoadingComplete={handleLoadingComplete}
              minDisplayTime={4000} // At least 4 seconds to enjoy the animation
            />
          </ErrorBoundary>
        )}

        {/* UI Overlay - Shown after loading */}
        {isLoadingComplete && (
          <div className="ui-overlay fade-in">
            {currentPhase === 'journey' && (
              <div className="journey-text">
                ☁️ Flying through the clouds... ☁️
              </div>
            )}
            {currentPhase === 'castle' && (
              <div className="instruction-text">
                🏰 Click the gate to enter ✨
              </div>
            )}
          </div>
        )}

        {/* Resume Modal */}
        <ResumeModal />
      </div>
    </ErrorBoundary>
  );
}

export default App;
