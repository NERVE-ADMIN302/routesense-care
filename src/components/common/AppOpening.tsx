import { useCallback, useEffect, useRef, useState } from 'react';
import { LandingPage } from '../../pages/LandingPage';
import './AppOpening.css';

const INTRO_SEEN = 'caremizhi:opening:20260913';
const HOLD_MS = 1600;
const FADE_MS = 900;

export function AppOpening() {
  const video = useRef<HTMLVideoElement>(null);
  const closing = useRef(false);
  const [finished, setFinished] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    try { return sessionStorage.getItem(INTRO_SEEN) === 'yes'; } catch { return false; }
  });
  const [holding, setHolding] = useState(false);
  const [exiting, setExiting] = useState(false);
  const finish = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    video.current?.pause();
    try { sessionStorage.setItem(INTRO_SEEN, 'yes'); } catch { /* Optional session storage. */ }
    setExiting(true);
  }, []);
  useEffect(() => {
    if (!holding) return;
    const timer = window.setTimeout(finish, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [holding, finish]);
  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => setFinished(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [exiting]);
  useEffect(() => {
    if (finished) return;
    let active = true;
    video.current?.play().catch(() => { if (active) finish(); });
    // A stalled or unsupported animation must never trap someone outside the app.
    const timer = window.setTimeout(finish, 45000);
    return () => { active = false; window.clearTimeout(timer); };
  }, [finished, finish]);
  return <>
    <div className="app-opening-landing" inert={!finished} aria-hidden={!finished}><LandingPage /></div>
    {!finished && <section className={`app-opening${exiting ? ' app-opening-exit' : ''}`} aria-label="CareMizhi opening animation">
      <img className="opening-brand-placeholder" src="/assets/caremizhi-logo.jpg" alt="" aria-hidden="true"/>
      <video ref={video} className="app-opening-video" src="/media/caremizhi-opening.mp4"
        autoPlay muted playsInline preload="auto" controls={false} disablePictureInPicture disableRemotePlayback
        tabIndex={-1} aria-hidden="true" onEnded={() => setHolding(true)} onError={finish}/>
    </section>}
  </>;
}
