import { wrapCardText } from './birthday';
import { customBirthdayCard } from './customBirthdayCard';

// Native browser canvas export. No third-party screenshot service is used.
export async function createBirthdayCardBlob(card, wished) {
  if (customBirthdayCard.enabled) {
    const src = customBirthdayCard.src;
    const url = /^(https?:\/\/|\/)/i.test(src) ? src : `${import.meta.env.BASE_URL}${src}`;
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Custom birthday card unavailable');
    const blob = await response.blob();
    if (blob.type.split(';')[0] !== 'image/png' || !blob.size) throw new Error('Custom birthday card must be a PNG image');
    return blob;
  }
  await document.fonts.ready;
  const image = new Image();
  image.src = `${import.meta.env.BASE_URL}images/future-reference.png`;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Card export unavailable');
  ctx.fillStyle = '#fff8f2';
  ctx.fillRect(0, 0, 1080, 1440);
  ctx.strokeStyle = '#d8b9a3';
  ctx.lineWidth = 2;
  ctx.strokeRect(35, 35, 1010, 1370);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#722c42';
  ctx.font = '25px Inter, sans-serif';
  ctx.fillText('OCTOBER 17  •  JUST FOR YOU', 540, 115);

  function centeredText(text, y, size, maxHeight, maxWidth = 890, italic = false) {
    let lines;
    let fontSize = size;
    do {
      ctx.font = `${italic ? 'italic ' : ''}${fontSize}px "Cormorant Garamond", Georgia, serif`;
      lines = wrapCardText(ctx, text, maxWidth);
      if (lines.length * fontSize * 1.1 <= maxHeight) break;
      fontSize -= 2;
    } while (fontSize > 14);
    lines.forEach((line, index) => ctx.fillText(line, 540, y + index * fontSize * 1.1, maxWidth));
  }

  centeredText(card.heading, 260, 96, 265);
  // Same cake artwork as the page. Excludes the baked-in flame so the state is real.
  ctx.drawImage(image, 812, 376, 470, 215, 80, 575, 920, 421);
  ctx.fillStyle = '#76503e';
  ctx.fillRect(537, 565, 4, 12);
  if (!wished) {
    const glow = ctx.createRadialGradient(540, 540, 2, 540, 540, 40);
    glow.addColorStop(0, '#ffd782'); glow.addColorStop(1, '#fff8f200');
    ctx.fillStyle = glow; ctx.fillRect(495, 495, 90, 85);
    ctx.fillStyle = '#edb450';
    ctx.beginPath(); ctx.moveTo(540, 507); ctx.bezierCurveTo(516, 548, 534, 569, 540, 566); ctx.bezierCurveTo(558, 560, 554, 540, 540, 507); ctx.fill();
    ctx.fillStyle = '#fff9db'; ctx.beginPath(); ctx.ellipse(540, 552, 5, 12, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#722c42';
  centeredText(card.message, 1100, 44, 170);
  centeredText(card.signature, 1320, 55, 70, 890, true);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not export card')), 'image/png'));
}
