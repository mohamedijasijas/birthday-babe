import { Heart, Sparkles } from 'lucide-react';
import { futureLetter } from './future';
import './future.css';

const artwork = `${import.meta.env.BASE_URL}images/future-reference.png`;

function WeddingRings() {
  return <svg className="wedding-rings" viewBox="0 0 150 108" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeWidth="1.35">
      <ellipse cx="54" cy="68" rx="40" ry="20" transform="rotate(-22 54 68)" />
      <ellipse cx="54" cy="66" rx="35" ry="15" transform="rotate(-22 54 66)" />
      <path d="M18 75c13 16 49 12 70-10M22 80c18 11 43 7 61-4" />
      <ellipse cx="103" cy="55" rx="37" ry="19" transform="rotate(29 103 55)" />
      <ellipse cx="103" cy="53" rx="32" ry="14" transform="rotate(29 103 53)" />
      <path d="M75 42c-5 16 24 35 47 34M76 46c-1 12 23 28 40 29" />
      <path d="M74 21c-14-10-8-18-2-10 4-12 17-9 2 10Z" />
    </g>
  </svg>;
}

export default function FuturePage({ onContinue }) {
  return <section className="future-page" aria-labelledby="future-title">
    <div className="future-floral-edge future-floral-left" aria-hidden="true"><img src={artwork} alt="" /></div>
    <div className="future-floral-edge future-floral-right" aria-hidden="true"><img src={artwork} alt="" /></div>

    <div className="future-top-progress" aria-label="Chapter 5 of 6">
      <div className="future-top-dots" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <span key={index} className={index < 5 ? 'filled' : ''} />)}</div>
      <span aria-hidden="true">5 / 6</span>
    </div>

    <h1 id="future-title" tabIndex={-1}>{futureLetter.heading}</h1>

    <figure className="future-polaroid" aria-label="An empty photo frame reserved for our future wedding photo">
      <div className="future-photo-space">
        <div className="future-frame-message">
          <WeddingRings />
          <p>{futureLetter.frameText}</p>
        </div>
      </div>
      <figcaption>{futureLetter.signature}</figcaption>
    </figure>

    <blockquote className="future-quote">“{futureLetter.message}”</blockquote>
    <div className="future-love-divider" aria-hidden="true"><span /><Heart size={11} fill="currentColor" /><span /></div>
    <button type="button" className="primary-button future-next" onClick={onContinue}>
      Make a birthday wish <Sparkles size={20} strokeWidth={1.3} aria-hidden="true" />
    </button>
  </section>;
}
