import { useEffect, useState } from 'react';
import { Heart, LockKeyhole, Sparkles } from 'lucide-react';
import { surpriseRelease, releaseStatus, countdownParts } from './release';
import './countdown.css';

export default function TimedGate({ children }) {
  const [now, setNow] = useState(() => Date.now());
  const status = releaseStatus(surpriseRelease, now);
  const parts = countdownParts(status.remaining);
  const [readyToOpen, setReadyToOpen] = useState(status.unlocked);

  useEffect(() => {
    if (readyToOpen) return;
    const update = () => {
      const current = Date.now();
      setNow(current);
      if (releaseStatus(surpriseRelease, current).unlocked) setReadyToOpen(true);
    };
    update();
    const timer = setInterval(update, 250);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [readyToOpen]);

  useEffect(() => {
    if (!readyToOpen) document.title = 'A little surprise is waiting ♡';
  }, [readyToOpen]);

  if (readyToOpen || status.unlocked) return children;

  return <main className="page-stage countdown-stage">
    <section className="birthday-page countdown-page" aria-labelledby="countdown-title">
      <header className="countdown-brand">For my Babe <Heart size={20} strokeWidth={1.2} aria-hidden="true" /></header>
      <div className="countdown-content">
        <div className="countdown-lock" aria-hidden="true"><LockKeyhole size={27} strokeWidth={1.1} /></div>
        <p className="eyebrow">Something made just for you</p>
        <h1 id="countdown-title">A little surprise.<br />A little more waiting.</h1>
        <p className="countdown-intro">Some things are worth waiting for.<br />Especially when they are made with love.</p>
        <div className="countdown-envelope" aria-hidden="true"><span>♡</span></div>
        <p className="countdown-unlock-label"><Sparkles size={15} aria-hidden="true" />Our little world opens in</p>
        <div className="countdown-clock" role="timer" aria-label="Time until your birthday surprise opens" aria-live="off">
          {Object.entries(parts).map(([name, value]) => <div className="countdown-unit" key={name}>
            <span className="countdown-number">{status.valid ? String(value).padStart(2, '0') : '--'}</span>
            <span className="countdown-unit-label">{name}</span>
          </div>)}
        </div>
        <p className="countdown-date">{surpriseRelease.dateLabel}<span>{surpriseRelease.timezoneLabel}</span></p>
        <p className="countdown-auto-note">{status.valid ? 'Stay here… your surprise will open automatically. ♡' : 'Your surprise will be ready soon. ♡'}</p>
      </div>
      <footer className="countdown-footer">Until then, keep that beautiful smile.</footer>
    </section>
  </main>;
}
