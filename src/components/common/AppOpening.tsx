import { useCallback, useEffect, useState } from 'react';
import { LandingPage } from '../../pages/LandingPage';
import './AppOpening.css';

const INTRO_STORAGE_KEY = 'caremizhi:intro:20260915';
const AUTO_DISMISS_MS = 4500; // Auto-transition after 4.5s
const EXIT_TRANSITION_MS = 600;

export function AppOpening() {
  const [showIntro, setShowIntro] = useState(() => {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    // Check if seen in current session
    try {
      return sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'seen';
    } catch {
      return true;
    }
  });

  const [isExiting, setIsExiting] = useState(false);

  const handleFinish = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'seen');
    } catch {
      // Ignore storage errors
    }
    window.setTimeout(() => {
      setShowIntro(false);
    }, EXIT_TRANSITION_MS);
  }, [isExiting]);

  useEffect(() => {
    if (!showIntro) return;
    const timer = window.setTimeout(handleFinish, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [showIntro, handleFinish]);

  return (
    <>
      {/* Landing Page pre-rendered for instant seamless reveal */}
      <div className="w-full min-h-full">
        <LandingPage />
      </div>

      {/* Animated Intro Overlay matching the Video */}
      {showIntro && (
        <div
          className={`caremizhi-intro-overlay ${isExiting ? 'intro-exit' : ''}`}
          onClick={handleFinish}
          role="dialog"
          aria-label="CareMizhi Animated Introduction"
        >
          {/* Ambient Glow Atmosphere */}
          <div className="intro-ambient-glow" />

          {/* Skip Button */}
          <button
            type="button"
            className="intro-skip-pill"
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            aria-label="Skip introduction animation"
          >
            Skip &rarr;
          </button>

          {/* Animation Stage */}
          <div className="intro-stage">
            {/* 1. Circular Emblem with Drone Beam and Cross Aura */}
            <div className="intro-emblem-wrap intro-emblem-float">
              <img
                src="/assets/caremizhi-symbol.png"
                alt="CareMizhi Symbol"
                className="intro-emblem-img select-none pointer-events-none"
              />

              {/* Glowing Drone Light Beam */}
              <div className="intro-drone-beam" />

              {/* Medical Cross Pulsing Aura */}
              <div className="intro-cross-glow" />
            </div>

            {/* 2. "CareMizhi" Wordmark with Shimmer Sweep */}
            <div className="intro-wordmark-wrap">
              <img
                src="/assets/caremizhi-wordmark.png"
                alt="CareMizhi"
                className="intro-wordmark-img select-none pointer-events-none"
              />
              <div className="intro-wordmark-shimmer" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppOpening;
