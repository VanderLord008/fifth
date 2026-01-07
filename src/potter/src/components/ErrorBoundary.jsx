import { Component } from 'react';

/**
 * ErrorBoundary - Catches React errors and displays a fallback UI
 * Particularly useful for handling WebGL context errors in 3D components
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return this.props.fallback || (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, #1a1a2e, #0f0f23)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f4d03f',
                    fontFamily: 'Georgia, serif',
                    textAlign: 'center',
                    padding: '20px',
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        ✨ Magic Requires Modern Wands ✨
                    </h1>
                    <p style={{ color: '#8b7355', maxWidth: '500px' }}>
                        Your browser's magical energy (WebGL) seems to be blocked or unavailable.
                        Please try using a modern browser like Chrome, Firefox, or Edge.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '12px 24px',
                            background: 'linear-gradient(145deg, #9b59b6, #8e44ad)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            cursor: 'pointer',
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
