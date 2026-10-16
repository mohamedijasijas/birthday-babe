import { useId } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { reasons } from './reasons';
import './reasons.css';

const art = `${import.meta.env.BASE_URL}images/reasons-reference.png`;
const photos = `${import.meta.env.BASE_URL}images/welcome-reference.png`;
const crops = ['948 381 216 153', '927 644 97 64', '1080 665 96 62'];

function ReasonHeart({ reason, index, opened, selected, onOpen }) {
  const pattern = `heart-${useId().replace(/:/g, '')}`;
  return <button type="button" className={`reason-heart ${opened ? 'is-opened' : ''} ${selected ? 'is-selected' : ''}`}
    aria-label={`Reason ${index + 1}${opened ? ', opened' : ', unopened'}${selected ? ', selected' : ''}`}
    aria-pressed={selected} aria-controls="reason-message" onClick={() => onOpen(reason.id)}>
    <svg viewBox="0 0 100 90" aria-hidden="true" focusable="false">
      <defs><pattern id={pattern} width="1" height="1" viewBox={crops[index % crops.length]} preserveAspectRatio="xMidYMid slice">
        <image href={photos} x="0" y="0" width="1536" height="1024" />
      </pattern></defs>
      <path d="M50 83 C42 76 5 53 5 26 C5 4 34 -3 50 18 C66 -3 95 4 95 26 C95 53 58 76 50 83Z"
        fill={opened ? `url(#${pattern})` : '#fffaf5'} stroke="currentColor" strokeWidth={selected ? '2.5' : '1.4'} />
      {opened && <circle cx="50" cy="40" r="15" fill="#4b182f" fillOpacity=".65" />}
      <text x="50" y="45" textAnchor="middle" fill={opened ? '#fffaf5' : '#722c42'} fontSize="23">{index + 1}</text>
    </svg>
    <span className="heart-spark spark-left" aria-hidden="true" />
    <span className="heart-spark spark-right" aria-hidden="true" />
  </button>;
}

export default function ReasonsPage({ progress, onReveal, onContinue }) {
  const selected = reasons.find(reason => reason.id === progress.selected);
  const openedCount = progress.opened.length;
  const complete = openedCount === reasons.length;

  return <section className="reasons-page" aria-labelledby="reasons-title">
    <div className="reasons-art-banner" aria-hidden="true"><img src={art} alt="" /></div>
    <header className="reasons-heading">
      <h1 id="reasons-title" tabIndex={-1}>17 reasons. One you.</h1>
      <p>Tap each heart to find a little truth.</p>
    </header>
    <div className="reasons-progress">
      <p>{openedCount} of {reasons.length} opened</p>
      <progress max={reasons.length} value={openedCount} aria-label="Reasons opened" />
    </div>
    <div className="reasons-grid" aria-label="Seventeen reasons to love you">
      {reasons.map((reason, index) => <ReasonHeart key={reason.id} reason={reason} index={index}
        opened={progress.opened.includes(reason.id)} selected={reason.id === progress.selected} onOpen={onReveal} />)}
    </div>
    <div className="reason-paper" id="reason-message" role="region" aria-label="Your little truth" aria-live="polite" aria-atomic="true">
      <span className="reason-paper-tape" aria-hidden="true" />
      {selected ? <div key={selected.id} className="reason-copy">
        <p className="reason-number">{selected.id} <span aria-hidden="true">—</span></p>
        <h2>{selected.title} <span aria-hidden="true">♡</span></h2>
        <p className="reason-body">{selected.message}</p>
      </div> : <div className="reason-copy reason-empty">
        <Heart size={27} strokeWidth={1} aria-hidden="true" />
        <h2>A little love,<br />behind every heart.</h2>
        <p className="reason-body">Choose any heart above. Each one holds something I love about you.</p>
      </div>}
      {complete && <p className="all-reasons-opened">All 17 hearts, just for you. ♡</p>}
      <button type="button" className="primary-button" onClick={onContinue}>A message for you <ArrowRight size={20} strokeWidth={1.3} aria-hidden="true" /></button>
    </div>
  </section>;
}
