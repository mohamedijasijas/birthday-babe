// Personalize these messages before sharing. Keep 17 entries with unique IDs.
export const reasons = [
  { id: '01', title: 'Your beautiful smile.', message: 'That little smile of yours can make an ordinary day feel special.' },
  { id: '02', title: 'The little things you do.', message: 'The smallest moments with you are often the ones I treasure most.' },
  { id: '03', title: 'The way you understand me.', message: 'You listen, you notice, and somehow you make it easier for me to say what is in my heart.' },
  { id: '04', title: 'Your kindness.', message: 'I love the warmth you bring into the lives of the people around you.' },
  { id: '05', title: 'The sound of your laugh.', message: 'If I could keep a sound close to my heart, it would be your laugh.' },
  { id: '06', title: 'Our little conversations.', message: 'Even when we have nothing important to say, talking to you is still my favourite part.' },
  { id: '07', title: 'Your caring heart.', message: 'The way you care makes love feel gentle, thoughtful and real.' },
  { id: '08', title: 'Your dreams.', message: 'I love hearing what you hope for, and I want to cheer for you as you grow.' },
  { id: '09', title: 'The comfort of being myself.', message: 'With you, I want to share the happy days and the imperfect ones too.' },
  { id: '10', title: 'Your little expressions.', message: 'Those tiny reactions and little looks are such a lovely part of you.' },
  { id: '11', title: 'The joy you bring.', message: 'You give me so many little things to smile about throughout the day.' },
  { id: '12', title: 'The memories we share.', message: 'I love looking back at our moments and knowing we still have more to make.' },
  { id: '13', title: 'Your strength.', message: 'I admire the way you keep going, even when a day asks a lot of you.' },
  { id: '14', title: 'The way I miss you.', message: 'Little things remind me of you, and suddenly I wish you were right beside me.' },
  { id: '15', title: 'Our tomorrow.', message: 'Insha Allah, we will build a life filled with patience, laughter and love.' },
  { id: '16', title: 'The person you are becoming.', message: 'I want to keep learning about you, supporting you and growing alongside you.' },
  { id: '17', title: 'Simply because you are you.', message: 'There are more than seventeen reasons, Babe. But every one of them begins with you.' },
];

export const REASONS_STORAGE_KEY = 'birthday-babe:reasons:v1';

export function normalizeProgress(value, entries = reasons) {
  const valid = new Set(entries.map(reason => reason.id));
  const opened = Array.isArray(value?.opened)
    ? [...new Set(value.opened.filter(id => valid.has(id)))] : [];
  const selected = valid.has(value?.selected) && opened.includes(value.selected)
    ? value.selected : opened.at(-1) || null;
  return { opened, selected };
}

export function revealReason(progress, id, entries = reasons) {
  const current = normalizeProgress(progress, entries);
  if (!entries.some(reason => reason.id === id)) return current;
  return { opened: current.opened.includes(id) ? current.opened : [...current.opened, id], selected: id };
}
