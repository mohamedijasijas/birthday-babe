export const birthdayCard = {
  heading: 'Happy Birthday,\nmy Babe!',
  message: 'May your days be gentle, your dreams grow, and your heart always feel loved.',
  signature: 'Always yours ♡',
  wishMessage: 'May Allah bless your beautiful heart. Ameen. ♡',
  fileName: 'For_My_Babe_Birthday_Card.png',
};

export function cardFileName(name) {
  const safe = String(name || '').replace(/\.png$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
  return `${safe || 'Birthday_Card'}.png`;
}

export function wrapCardText(context, text, maxWidth) {
  const lines = [];
  for (const paragraph of String(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > maxWidth) { lines.push(line); line = word; }
      else line = candidate;
    }
    lines.push(line);
  }
  return lines;
}
