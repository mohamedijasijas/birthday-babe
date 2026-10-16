export const voiceLetter = {
  // Put your recording in public/audio/birthday-message.mp3, then set:
  // src: 'audio/birthday-message.mp3',
  src: 'audio/birthday-message.mp3',
  caption: 'A birthday message, from my heart to yours.',
  note: 'Some feelings sound better than they read.',
  // Optional exact transcript of your recording for accessibility.
  transcript: '',
};

export function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export function clampAudioTime(time, duration) {
  if (!Number.isFinite(time) || !Number.isFinite(duration) || duration <= 0) return 0;
  return Math.min(duration, Math.max(0, time));
}

export function resolveAudioSource(src, base) {
  if (typeof src !== 'string' || !src.trim()) return '';
  const value = src.trim();
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  return `${base}${value}`;
}
