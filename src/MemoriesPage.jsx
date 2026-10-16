import { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, RotateCcw } from 'lucide-react';
import { memories, wrapIndex } from './memories';
import './memories.css';

const artwork = `${import.meta.env.BASE_URL}images/welcome-reference.png`;
// Rectangles inside the original artwork, displayed through a CSS viewport.
const samples = {
  sunset: { x: 948, y: 381, width: 216, height: 153 },
  flowers: { x: 927, y: 644, width: 97, height: 64 },
  coffee: { x: 1080, y: 665, width: 96, height: 62 },
};

function MemoryImage({ memory, thumbnail = false }) {
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);
  const sample = !memory.src;
  const crop = samples[memory.sample] || samples.sunset;
  const src = sample ? artwork : /^(https?:\/\/|\/)/.test(memory.src)
    ? memory.src : `${import.meta.env.BASE_URL}${memory.src}`;
  const style = sample ? {
    width: `${1536 / crop.width * 100}%`,
    left: `${-crop.x / crop.width * 100}%`,
    top: `${-crop.y / crop.height * 100}%`,
    height: `${1024 / crop.height * 100}%`,
  } : undefined;

  return (
    <div className={`memory-image ${sample ? 'sample-image' : ''}`} aria-busy={status === 'loading'}>
      {status === 'loading' && <div className="artwork-skeleton" role={thumbnail ? undefined : 'status'}>
        {!thumbnail && <span className="sr-only">Loading memory photo</span>}
      </div>}
      <img key={retry} src={src} alt={thumbnail ? '' : sample ? `Sample ${memory.sample} artwork. Add your own photo.` : memory.alt}
        style={style} className={status === 'ready' ? 'photo-ready' : ''}
        draggable="false" onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />
      {status === 'error' && <div className="memory-image-error" role="status">
        <Heart size={thumbnail ? 18 : 28} strokeWidth={1} aria-hidden="true" />
        {!thumbnail && <>
          <span>Photo could not load</span>
          <button type="button" onClick={() => { setStatus('loading'); setRetry(value => value + 1); }}>
            <RotateCcw size={14} aria-hidden="true" /> Retry
          </button>
        </>}
      </div>}
      {sample && status === 'ready' && !thumbnail && <span className="sample-label">Our photo here · Sample</span>}
    </div>
  );
}

export default function MemoriesPage({ activeIndex, onIndexChange, onReadLetter }) {
  const touch = useRef(null);
  const current = wrapIndex(activeIndex, memories.length);
  const memory = memories[current];
  const following = [1, 2].map(offset => wrapIndex(current + offset, memories.length));
  const move = direction => onIndexChange(wrapIndex(current + direction, memories.length));

  if (!memory) return <section className="memories-page"><h1 tabIndex={-1}>Our little moments</h1><p>Add a memory to begin our story.</p></section>;

  return (
    <section id="memories" className="memories-page" aria-labelledby="memories-title">
      <div className="memory-floral-edge" aria-hidden="true"><img src={artwork} alt="" /></div>
      <div className="memory-ribbon-edge" aria-hidden="true"><img src={artwork} alt="" /></div>
      <header className="memories-heading">
        <h1 id="memories-title" tabIndex={-1}>Our little<br />moments <span aria-hidden="true">♡</span></h1>
        <p>My favourite memories have you in them.</p>
      </header>

      <div className="memory-carousel" role="region" aria-roledescription="carousel" aria-label="Our photos"
        tabIndex={0} onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
          if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        }}>
        <div className="polaroid-stack" onTouchStart={event => {
          const point = event.touches[0];
          touch.current = event.touches.length === 1 ? { x: point.clientX, y: point.clientY } : null;
        }} onTouchEnd={event => {
          if (!touch.current) return;
          const point = event.changedTouches[0];
          const dx = point.clientX - touch.current.x;
          const dy = point.clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
        }} onTouchCancel={() => { touch.current = null; }}>
          <div className="polaroid-shadow-card shadow-one" aria-hidden="true" />
          <div className="polaroid-shadow-card shadow-two" aria-hidden="true" />
          <span className="paper-tape" aria-hidden="true" />
          <figure className="main-polaroid" key={memory.id} aria-label={`Memory ${current + 1} of ${memories.length}`}>
            <MemoryImage key={`${memory.id}-${memory.src}`} memory={memory} />
            <figcaption>{memory.caption} <span aria-hidden="true">♡</span></figcaption>
          </figure>
        </div>

        <div className="memory-thumbnails">
          {following.map((index, position) => <button key={memories[index].id} type="button"
            className={`thumbnail-polaroid thumbnail-${position + 1}`}
            onClick={() => onIndexChange(index)} aria-label={`Show memory ${index + 1}: ${memories[index].caption}`}>
            <MemoryImage key={`${memories[index].id}-${memories[index].src}`} memory={memories[index]} thumbnail />
            <span>{memories[index].src ? 'Our little moment' : 'Our photo here'} ♡</span>
          </button>)}
        </div>

        <div className="carousel-controls">
          <button type="button" className="carousel-arrow" onClick={() => move(-1)} aria-label="Previous memory"><ChevronLeft size={21} strokeWidth={1.4} /></button>
          <p aria-live="polite" aria-atomic="true"><span className="sr-only">Memory </span>{String(current + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}</p>
          <button type="button" className="carousel-arrow" onClick={() => move(1)} aria-label="Next memory"><ChevronRight size={21} strokeWidth={1.4} /></button>
        </div>
      </div>

      <button type="button" className="primary-button memories-next" onClick={onReadLetter}>
        There is more to love <ArrowRight size={21} strokeWidth={1.3} aria-hidden="true" />
      </button>
    </section>
  );
}
