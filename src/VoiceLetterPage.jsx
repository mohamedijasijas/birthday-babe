import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Headphones, LoaderCircle, Pause, Play, RotateCcw } from 'lucide-react';
import { voiceLetter, formatAudioTime, clampAudioTime, resolveAudioSource } from './voice';
import './voice.css';

const artwork = `${import.meta.env.BASE_URL}images/reasons-reference.png`;
// Decorative bars, not an analysis of the personal recording.
const bars = [9,14,11,18,28,36,25,45,58,40,32,50,37,23,18,31,44,55,39,26,16,25,35,53,64,47,32,22,40,51,36,28,17,24,37,48,33,21,15,23,31,19,12,17,10];

export default function VoiceLetterPage({ onVoiceStart, onVoiceStateChange, onContinue }) {
  const src = resolveAudioSource(voiceLetter.src, import.meta.env.BASE_URL);
  const audio = useRef(null);
  const mounted = useRef(false);
  const request = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(Boolean(src));
  const [duration, setDuration] = useState(NaN);
  const [time, setTime] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    mounted.current = true;
    const element = audio.current;
    setPlaying(false);
    setPending(false);
    setLoading(Boolean(src));
    setDuration(NaN);
    setTime(0);
    setError('');
    return () => {
      mounted.current = false;
      request.current += 1;
      element?.pause();
      onVoiceStateChange(false);
    };
  }, [onVoiceStateChange, src]);

  function paused() {
    if (!mounted.current) return;
    setPlaying(false);
    setPending(false);
    onVoiceStateChange(false);
  }

  function failed() {
    if (!mounted.current) return;
    request.current += 1;
    audio.current?.pause();
    paused();
    setLoading(false);
    setError('This voice letter could not load. Please try again.');
  }

  async function toggle() {
    const element = audio.current;
    if (!element || !src) return;
    if (playing || pending) {
      request.current += 1;
      element.pause();
      paused();
      return;
    }
    const ticket = ++request.current;
    if (element.ended) { element.currentTime = 0; setTime(0); }
    setError('');
    setPending(true);
    onVoiceStart();
    onVoiceStateChange(true);
    try {
      await element.play();
    } catch (err) {
      if (!mounted.current || ticket !== request.current) return;
      paused();
      if (err.name !== 'AbortError') setError('Playback could not start. Tap Retry and try again.');
    }
  }

  function retry() {
    request.current += 1;
    audio.current?.pause();
    paused();
    setError('');
    setTime(0);
    setDuration(NaN);
    setLoading(true);
    audio.current?.load();
  }

  function seek(value) {
    const next = clampAudioTime(Number(value), duration);
    if (audio.current && Number.isFinite(duration) && duration > 0) {
      audio.current.currentTime = next;
      setTime(next);
    }
  }

  function continueStory() {
    request.current += 1;
    audio.current?.pause();
    paused();
    onContinue();
  }

  const knownDuration = Number.isFinite(duration) && duration > 0;
  const position = knownDuration ? clampAudioTime(time, duration) : 0;
  const percentage = knownDuration ? position / duration * 100 : 0;

  return <section className="voice-page" aria-labelledby="voice-title">
    <div className="voice-art-banner" aria-hidden="true"><img src={artwork} alt="" /></div>
    <header className="voice-heading">
      <h1 id="voice-title" tabIndex={-1}>Just you, me<br />&amp; my voice.</h1>
      <p>Put on your headphones, Babe.</p>
    </header>

    <div className={`voice-player ${playing ? 'is-playing' : ''}`} aria-label="Birthday voice recording">
      <div className="voice-play-rings">
        <span className="voice-spark" aria-hidden="true">✧</span>
        <button type="button" className="voice-play-button" disabled={!src || loading || Boolean(error)}
          aria-label={pending || playing ? 'Pause voice letter' : time > 0 && knownDuration && time >= duration ? 'Replay voice letter' : 'Play voice letter'}
          aria-busy={pending || loading} onClick={toggle}>
          {loading || pending ? <LoaderCircle size={34} className="voice-spinner" aria-hidden="true" />
            : playing ? <Pause size={34} fill="currentColor" strokeWidth={1} aria-hidden="true" />
            : <Play size={36} fill="currentColor" strokeWidth={1} className="play-triangle" aria-hidden="true" />}
        </button>
        <span className="voice-floating-heart" aria-hidden="true">♡</span>
      </div>

      <div className="voice-waveform" aria-hidden="true">
        {bars.map((height, index) => <span key={index} style={{ '--bar-height': `${height}px`, '--bar-delay': `${index * -0.07}s` }} />)}
      </div>

      <div className="voice-timeline">
        <span>{formatAudioTime(position)}</span>
        <input type="range" min="0" max={knownDuration ? duration : 1} step="0.1" value={position}
          aria-label="Voice letter playback position" aria-valuetext={`${formatAudioTime(position)} of ${formatAudioTime(duration)}`}
          disabled={!knownDuration || Boolean(error)} onChange={event => seek(event.target.value)}
          style={{ '--audio-progress': `${percentage}%` }} />
        <span>{formatAudioTime(duration)}</span>
      </div>

      <div className="voice-status" role="status" aria-live="polite">
        {!src ? <p>This voice letter isn't available yet.</p>
          : error ? <><p>{error}</p><button type="button" onClick={retry}><RotateCcw size={14} aria-hidden="true" /> Retry</button></>
          : loading ? <p>Getting your message ready…</p>
          : pending ? <p>One moment…</p>
          : playing ? <p><Headphones size={13} aria-hidden="true" /> Just listen. This moment is yours.</p> : null}
      </div>
    </div>

    <p className="voice-caption">{voiceLetter.caption}</p>
    <div className="voice-small-divider" aria-hidden="true" />
    <p className="voice-note">{voiceLetter.note}<span aria-hidden="true">♡</span></p>
    {voiceLetter.transcript && <details className="voice-transcript"><summary>Read my message</summary><p>{voiceLetter.transcript}</p></details>}
    <button type="button" className="primary-button voice-next" onClick={continueStory}>One more dream <ArrowRight size={21} strokeWidth={1.3} aria-hidden="true" /></button>

    {src && <audio ref={audio} src={src} preload="metadata"
      onLoadedMetadata={event => { setDuration(event.currentTarget.duration); setLoading(false); }}
      onDurationChange={event => setDuration(event.currentTarget.duration)}
      onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
      onPlaying={() => { setPlaying(true); setPending(false); setLoading(false); onVoiceStart(); onVoiceStateChange(true); }}
      onPause={paused} onEnded={() => { paused(); setTime(audio.current?.duration || 0); }}
      onWaiting={() => { if (audio.current && !audio.current.paused) setPending(true); }}
      onError={failed} />}
  </section>;
}
