import TimedGate from './TimedGate';
import { useEffect, useRef, useState } from 'react';
import MemoriesPage from './MemoriesPage';
import { chapterPages, pageFromHash } from './navigation';
import ReasonsPage from './ReasonsPage';
import VoiceLetterPage from './VoiceLetterPage';
import FuturePage from './FuturePage';
import BirthdayPage from './BirthdayPage';
import { normalizeProgress, revealReason, REASONS_STORAGE_KEY } from './reasons';
import { ArrowLeft, ArrowRight, Heart, Music2, Volume2, X } from 'lucide-react';

const artwork = `${import.meta.env.BASE_URL}images/welcome-reference.png`;
const steps = ['Welcome', 'Our memories', '17 reasons', 'Voice letter', 'Our future', 'Birthday wish'];

// Original, locally synthesized chimes. No external music file is required.
function useChimes() {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState('');
  const session = useRef(null);
  const busy = useRef(false);
  const mounted = useRef(false);
  const revision = useRef(0);
  function stop() {
    revision.current += 1;
    const active = session.current;
    session.current = null;
    if (active) {
      clearInterval(active.timer);
      void active.context.close().catch(() => {});
    }
  }
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; stop(); };
  }, []);
  async function toggle() {
    if (busy.current) return;
    if (session.current) { stop(); setEnabled(false); return; }
    busy.current = true;
    const ticket = revision.current;
    let context;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('Audio unavailable');
      context = new AudioContext();
      await context.resume();
      if (!mounted.current || ticket !== revision.current) { await context.close(); return; }
      const play = () => {
        [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 783.99].forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const start = context.currentTime + index * 1.4;
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.045, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.1);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
          oscillator.start(start);
          oscillator.stop(start + 2.2);
        });
      };
      play();
      session.current = { context, timer: setInterval(play, 14000) };
      setEnabled(true);
      setError('');
    } catch {
      if (context && context.state !== 'closed') void context.close().catch(() => {});
      if (mounted.current) setError('Sound could not start. Please try again.');
    } finally { busy.current = false; }
  }
  function silence() { stop(); setEnabled(false); }
  return { enabled, error, toggle, silence };
}

function BirthdayApp() {
  const [page, setPage] = useState(() => pageFromHash(window.location.hash));
  const [activeMemory, setActiveMemory] = useState(0);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [birthdayWished, setBirthdayWished] = useState(false);
  const [reasonProgress, setReasonProgress] = useState(() => {
    try { return normalizeProgress(JSON.parse(localStorage.getItem(REASONS_STORAGE_KEY))); }
    catch { return normalizeProgress(null); }
  });
  const currentChapter = chapterPages.indexOf(page);

  useEffect(() => {
    try { localStorage.setItem(REASONS_STORAGE_KEY, JSON.stringify(reasonProgress)); }
    catch { /* Private browsing/storage restrictions should not block the gift. */ }
  }, [reasonProgress]);
  const returnFocus = useRef(null);
  const [imageState, setImageState] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [opened, setOpened] = useState(false);
  const dialog = useRef(null);
  const openButton = useRef(null);
  const image = useRef(null);
  const music = useChimes();

  useEffect(() => {
    const sync = () => setPage(pageFromHash(window.location.hash));
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById(`${page}-title`)?.focus({ preventScroll: true });
    document.title = `${steps[chapterPages.indexOf(page)]} — For my Babe ♡`;
  }, [page]);

  function navigate(next) {
    if (!chapterPages.includes(next)) return;
    setPage(next);
    window.location.hash = next;
  }
  function replayStory() {
    document.querySelector('audio')?.pause();
    setVoicePlaying(false);
    setActiveMemory(0);
    setBirthdayWished(false);
    navigate('welcome');
  }
  function nextChapter() {
    const next = chapterPages[currentChapter + 1];
    if (next) navigate(next);
    else return;
  }

  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth > 0) setImageState('ready');
  }, []);

  useEffect(() => {
    if (!opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [opened]);

  function openLetter() {
    document.querySelector('audio')?.pause();
    setVoicePlaying(false);
    returnFocus.current = document.activeElement;
    if (!dialog.current?.open) {
      dialog.current.showModal();
      setOpened(true);
    }
  }

  function closeLetter() { dialog.current?.close(); }

  return (
    <main className="page-stage">
      <section className="birthday-page" aria-label="Your birthday surprise">
        <header className="flex items-center justify-between border-b border-[#eadbce] px-6 py-1">
          <a href="#welcome" className="brand inline-flex items-center gap-1.5">
            For my Babe <Heart size={20} strokeWidth={1.2} aria-hidden="true" />
          </a>
          <button type="button" className="sound-control flex min-h-11 items-center gap-3"
            role="switch" aria-checked={music.enabled} aria-label={voicePlaying ? 'Background chimes paused during voice letter' : 'Background chimes'} disabled={voicePlaying} onClick={music.toggle}>
            <Music2 size={18} strokeWidth={1.6} aria-hidden="true" />
            <span className={`switch-track ${music.enabled ? 'is-on' : ''}`} aria-hidden="true"><span /></span>
          </button>
        </header>

        {music.error && <p role="status" className="px-6 py-2 text-center text-sm">{music.error}</p>}

        {page === 'welcome' ? <div id="welcome" className="welcome-content">
          <div className="headline-area text-center">
            <p className="eyebrow">October 17 · Just for you</p>
            <h1 id="welcome-title" tabIndex={-1}>The world<br />became sweeter<br />the day you arrived.</h1>
            <div className="love-divider" aria-hidden="true"><span /><Heart size={10} fill="currentColor" /><span /></div>
          </div>

          <div className="artwork-container" aria-busy={imageState === 'loading'}>
            {imageState === 'loading' && <div className="artwork-skeleton" role="status"><span className="sr-only">Loading your birthday envelope</span></div>}
            <button type="button" className={`envelope-art ${imageState === 'ready' ? 'is-ready' : ''}`}
              aria-label="Open our memories" disabled={imageState !== 'ready'} onClick={() => navigate('memories')}>
              <img key={attempt} ref={image} src={`${artwork}${attempt ? `?retry=${attempt}` : ''}`}
                width="1536" height="1024" alt="Pink envelope with a burgundy heart seal, silk ribbons and flowers"
                fetchPriority="high" draggable="false" onLoad={() => setImageState('ready')} onError={() => setImageState('error')} />
            </button>
            {imageState === 'error' && <div className="artwork-error">
              <Heart size={30} strokeWidth={1} aria-hidden="true" />
              <p>The envelope image could not load.</p>
              <button type="button" className="underline underline-offset-4" onClick={() => { setImageState('loading'); setAttempt(value => value + 1); }}>Try again</button>
            </div>}
          </div>

          <div className="welcome-actions text-center">
            <p className="intro-copy">I made a little world for you, Babe.</p>
            <button ref={openButton} type="button" className="primary-button" onClick={() => navigate('memories')}>
              Open your surprise <ArrowRight size={22} strokeWidth={1.3} aria-hidden="true" />
            </button>
            <p className="sound-hint flex items-center justify-center gap-2"><Volume2 size={15} aria-hidden="true" />Best with your sound on</p>
          </div>
        </div> : page === 'memories' ? <MemoriesPage activeIndex={activeMemory} onIndexChange={setActiveMemory} onReadLetter={() => navigate('reasons')} />
          : page === 'reasons' ? <ReasonsPage progress={reasonProgress} onReveal={id => setReasonProgress(current => revealReason(current, id))} onContinue={() => navigate('voice')} />
          : page === 'voice' ? <VoiceLetterPage onVoiceStart={music.silence} onVoiceStateChange={setVoicePlaying} onContinue={() => navigate('future')} />
          : page === 'future' ? <FuturePage onContinue={() => navigate('birthday')} />
          : <BirthdayPage wished={birthdayWished} onWish={() => setBirthdayWished(true)} onReplay={replayStory} />}

        <footer className="page-footer flex items-center justify-between gap-2">
          <button type="button" className="footer-link" disabled={page === 'welcome'} onClick={() => navigate(chapterPages[Math.max(0, currentChapter - 1)])}><ArrowLeft size={16} aria-hidden="true" />Back</button>
          <ol className="flex items-center" aria-label="Surprise chapters">
            {steps.map((step, index) => {
              const current = index === currentChapter;
              return <li key={step} aria-current={current ? 'step' : undefined}>
                {index < chapterPages.length ? <button type="button" className="chapter-button"
                  aria-label={`${index + 1}. ${step}${current ? ', current chapter' : ''}`}
                  onClick={() => navigate(chapterPages[index])}>
                  <span className={`step-dot ${current ? 'active' : ''}`} aria-hidden="true" />
                </button> : <span className="chapter-button"><span className="step-dot"><span className="sr-only">{index + 1}. {step}</span></span></span>}
              </li>;
            })}
          </ol>
          <button type="button" className="footer-link" disabled={currentChapter === chapterPages.length - 1} onClick={nextChapter}>Next<ArrowRight size={16} aria-hidden="true" /></button>
        </footer>
      </section>

      <dialog ref={dialog} className="letter-dialog" aria-labelledby="letter-title"
        onClose={() => { setOpened(false); const target = returnFocus.current; if (target?.isConnected) target.focus(); }}
        onClick={event => { if (event.target === event.currentTarget) closeLetter(); }}>
        <article className="letter-paper">
          <button type="button" className="close-button" aria-label="Close birthday letter" onClick={closeLetter} autoFocus><X size={20} /></button>
          <p className="eyebrow">A little note for you</p>
          <Heart className="letter-heart" size={30} strokeWidth={1} aria-hidden="true" />
          <h2 id="letter-title">My favourite person,<br />my Babe.</h2>
          <p>This little world was made for you — for your smile, your happiness, and all the beautiful moments still ahead of us.</p>
          <p>May Allah fill your life with love, peace and beautiful blessings.</p>
          <p className="signature">Always yours ♡</p>
          <button type="button" className="primary-button" onClick={closeLetter}>Back to our dream <Heart size={17} aria-hidden="true" /></button>
        </article>
      </dialog>
    </main>
  );
}

export default function App() {
  return <TimedGate><BirthdayApp /></TimedGate>;
}
