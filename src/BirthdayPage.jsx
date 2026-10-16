import { useEffect, useRef, useState } from 'react';
import { Download, Heart, LoaderCircle, RotateCcw, Sparkles } from 'lucide-react';
import { birthdayCard, cardFileName } from './birthday';
import { createBirthdayCardBlob } from './downloadBirthdayCard';
import './birthday.css';

const artwork = `${import.meta.env.BASE_URL}images/future-reference.png`;

export default function BirthdayPage({ wished, onWish, onReplay }) {
  const [burst, setBurst] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [imageState, setImageState] = useState('loading');
  const [retry, setRetry] = useState(0);
  const mounted = useRef(false);
  const downloadBusy = useRef(false);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (!burst) return;
    const timer = setTimeout(() => setBurst(false), 4200);
    return () => clearTimeout(timer);
  }, [burst]);

  function makeWish() {
    if (wished) return;
    onWish();
    setBurst(true);
  }

  async function saveCard() {
    if (downloadBusy.current) return;
    downloadBusy.current = true;
    setSaving(true); setNotice('');
    try {
      const blob = await createBirthdayCardBlob(birthdayCard, wished);
      if (!mounted.current) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = cardFileName(birthdayCard.fileName);
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setNotice('Your birthday card is ready to save. ♡');
    } catch {
      if (mounted.current) setNotice('The card could not be saved. Please try again.');
    } finally {
      downloadBusy.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  return <section className="birthday-finale" aria-labelledby="birthday-title">
    {burst && <div className="birthday-confetti" aria-hidden="true">{Array.from({length: 44}, (_, index) => <i key={index} style={{
      '--piece-x': `${(index * 37) % 100}%`, '--piece-delay': `${index % 7 * 70}ms`,
      '--piece-color': ['#c78b95', '#d4ad68', '#ebc9c0', '#91425a'][index % 4],
      '--piece-turn': `${index * 57}deg`, '--piece-drift': `${(index % 2 ? 1 : -1) * (25 + index % 65)}px`,
    }} />)}</div>}

    <div className="finale-progress" aria-label="Chapter 6 of 6"><div aria-hidden="true">{Array.from({length: 6}, (_, index) => <span key={index} />)}</div><span aria-hidden="true">6 / 6</span></div>
    <h1 id="birthday-title" tabIndex={-1}>{birthdayCard.heading}</h1>
    <Heart className="finale-heading-heart" size={21} strokeWidth={1.1} aria-hidden="true" />

    <button type="button" className={`birthday-cake ${wished ? 'is-wished' : ''}`} disabled={wished}
      onClick={makeWish} aria-label={wished ? 'Birthday wish made, candle extinguished' : 'Blow out the candle and make a birthday wish'}>
      <span className="cake-flame" aria-hidden="true" /><span className="cake-wick" aria-hidden="true" />
      <span className="cake-artwork" aria-busy={imageState === 'loading'}>
        {imageState === 'loading' && <span className="artwork-skeleton" aria-hidden="true" />}
        <img key={retry} src={artwork} alt="A pink ribbon birthday cake with flowers and one candle" draggable="false"
          className={imageState === 'ready' ? 'ready' : ''} onLoad={() => setImageState('ready')} onError={() => setImageState('error')} />
        {imageState === 'error' && <span className="cake-image-fallback">🎂<span>Your birthday cake</span></span>}
      </span>
    </button>
    {imageState === 'error' && <button type="button" className="cake-retry" onClick={() => { setImageState('loading'); setRetry(value => value + 1); }}>Retry cake image</button>}

    <button type="button" className="wish-instruction" onClick={makeWish} disabled={wished}>
      <Sparkles size={16} strokeWidth={1.3} aria-hidden="true" />{wished ? 'A little wish, a heart full of love' : 'Tap the candle & make a wish'}
    </button>
    <p className="wish-status" role="status" aria-live="polite">{wished ? birthdayCard.wishMessage : '\u00a0'}</p>
    <p className="finale-message">{birthdayCard.message}</p>
    <div className="finale-divider" aria-hidden="true"><span /><Heart size={10} fill="currentColor" /><span /></div>
    <p className="finale-signature">{birthdayCard.signature}</p>
    <div className="finale-actions">
      <button type="button" className="primary-button" onClick={onReplay}>Replay our little story <RotateCcw size={17} strokeWidth={1.3} aria-hidden="true" /></button>
      <button type="button" className="save-birthday-card" disabled={saving} onClick={saveCard}>
        {saving ? 'Preparing your card…' : 'Keep this birthday card'}
        {saving ? <LoaderCircle className="card-spinner" size={18} aria-hidden="true" /> : <Download size={18} strokeWidth={1.3} aria-hidden="true" />}
      </button>
      <p className="card-save-status" role="status">{notice}</p>
    </div>
  </section>;
}
