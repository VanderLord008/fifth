/**
 * 🧙‍♂️ Loading Overlay - HTML/CSS overlay for loading text
 * Displays loading messages and progress on top of the 3D scene
 */

import { useEffect, useState } from 'react';
import usePortfolioStore from '../../stores/portfolioStore';
import './LoadingOverlay.css';

export default function LoadingOverlay() {
    const { loadingProgress, loadingMessage, isLoaded } = usePortfolioStore();
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            // Start fade out animation
            setFadeOut(true);

            // Remove from DOM after animation
            const timer = setTimeout(() => {
                setVisible(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    if (!visible) return null;

    return (
        <div className={`loading-overlay ${fadeOut ? 'fade-out' : ''}`}>
            {/* Magical title */}
            <h1 className="loading-title">The Wizard's Portfolio</h1>

            {/* Loading message */}
            <p className="loading-message">{loadingMessage}</p>

            {/* Progress bar container */}
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${loadingProgress}%` }}
                />
                <div className="progress-glow" style={{ left: `${loadingProgress}%` }} />
            </div>

            {/* Progress percentage */}
            <p className="progress-text">
                <span className="progress-number">{Math.round(loadingProgress)}</span>%
            </p>

            {/* Magical hint */}
            <p className="loading-hint">
                {loadingProgress < 100
                    ? '✨ Gathering magical energies...'
                    : '⚡ Spell ready! Prepare for apparition...'}
            </p>
        </div>
    );
}
