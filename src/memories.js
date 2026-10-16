// Replace src with a path such as 'images/memories/photo-01.jpg'.
// Paths are relative to public/. Sample artwork is used while src is empty.
export const memories = [
  { id: '01', src: 'images/memories/memory-1.jpeg', sample: 'sunset', alt: 'Our first photo', caption: 'A moment I would live again' },
  { id: '02', src: 'images/memories/memory-2.jpg', sample: 'flowers', alt: 'A favourite photo of us', caption: 'The little things, with you' },
  { id: '03', src: 'images/memories/memory-3.jpg', sample: 'coffee', alt: 'A quiet moment together', caption: 'My favourite place is beside you' },
  { id: '04', src: 'images/memories/memory-4.jpg', sample: 'sunset', alt: 'A day to remember', caption: 'Some days stay in your heart' },
  { id: '05', src: 'images/memories/memory-5.jpg', sample: 'flowers', alt: 'A happy memory together', caption: 'You make ordinary days beautiful' },
  { id: '06', src: 'images/memories/memory-6.jpg', sample: 'coffee', alt: 'One more favourite memory', caption: 'And so many more moments to come' },
];

export function wrapIndex(index, length) {
  return length > 0 ? ((index % length) + length) % length : 0;
}

export function pageFromHash(hash) {
  return hash === '#memories' ? 'memories' : 'welcome';
}
